import http, { type IncomingMessage, type ServerResponse } from "node:http";
import { randomUUID, timingSafeEqual } from "node:crypto";
import { calculateMcv, getMcvOptions } from "../src/lib/mcv/client";
import type { McvCalculationRequest, McvOptionsRequest } from "../src/lib/mcv/types";

const PORT = Number(process.env.PORT || 8787);
const TOKEN = process.env.MCV_WORKER_TOKEN || "";
const MAX_BODY_BYTES = 8_000;
const MAX_CONCURRENCY = Math.max(1, Math.min(3, Number(process.env.MCV_WORKER_CONCURRENCY || 1)));
const REQUEST_TIMEOUT_MS = Math.max(10_000, Math.min(120_000, Number(process.env.MCV_WORKER_TIMEOUT_MS || 90_000)));
const E2E_READINESS_ENABLED = process.env.MCV_WORKER_E2E_READINESS === "1";

let activeRequests = 0;
let shuttingDown = false;

function log(level: "info" | "warn" | "error", message: string, data: Record<string, unknown> = {}) {
  const safeData = Object.fromEntries(
    Object.entries(data).filter(([key]) => !/token|authorization|secret|cookie/i.test(key))
  );
  console[level](JSON.stringify({ level, message, ...safeData, at: new Date().toISOString() }));
}

function sendJson(response: ServerResponse, status: number, body: unknown, correlationId: string) {
  response.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    "x-correlation-id": correlationId,
  });
  response.end(JSON.stringify(body));
}

function secureEqual(left: string, right: string) {
  const a = Buffer.from(left);
  const b = Buffer.from(right);
  return a.length === b.length && timingSafeEqual(a, b);
}

function authorized(request: IncomingMessage) {
  if (!TOKEN) return false;
  const header = request.headers.authorization || "";
  const value = Array.isArray(header) ? header[0] : header;
  return value.startsWith("Bearer ") && secureEqual(value.slice(7), TOKEN);
}

function clean(value: unknown, max = 120) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function validateCalculation(payload: Record<string, unknown>): McvCalculationRequest | { error: string } {
  const input = {
    manufacturer: clean(payload.manufacturer),
    model: clean(payload.model, 180),
    vehicleType: clean(payload.vehicleType, 120),
    firstRegistrationDate: clean(payload.firstRegistrationDate, 20),
    beneficiaryType: clean(payload.beneficiaryType, 10) as McvCalculationRequest["beneficiaryType"],
  };

  if (!input.manufacturer || !input.model) return { error: "Manufacturer and model are required." };
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(input.firstRegistrationDate)) {
    return { error: "First registration date must use DD/MM/YYYY." };
  }
  if (!["AUTRE", "MRE", "MRED", "PBS"].includes(input.beneficiaryType)) {
    return { error: "Unsupported beneficiary type." };
  }
  return input;
}

async function readJson(request: IncomingMessage) {
  let size = 0;
  const chunks: Buffer[] = [];
  for await (const chunk of request) {
    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    size += buffer.length;
    if (size > MAX_BODY_BYTES) throw new Error("BODY_TOO_LARGE");
    chunks.push(buffer);
  }
  return JSON.parse(Buffer.concat(chunks).toString("utf8")) as Record<string, unknown>;
}

function withTimeout<T>(work: Promise<T>) {
  let timeout: ReturnType<typeof setTimeout>;
  const timer = new Promise<never>((_, reject) => {
    timeout = setTimeout(() => reject(new Error("WORKER_TIMEOUT")), REQUEST_TIMEOUT_MS);
  });
  return Promise.race([work, timer]).finally(() => clearTimeout(timeout));
}

function resultStatus(result: { status?: string; code?: string }) {
  if (result.status === "success") return 200;
  if (result.code === "VALIDATION_ERROR") return 400;
  if (["AMBIGUOUS_MODEL", "AMBIGUOUS_TYPE", "VEHICLE_NOT_FOUND"].includes(result.code || "")) return 409;
  if (result.code === "CONCURRENCY_LIMIT") return 429;
  if (result.code === "MCV_UNAVAILABLE") return 503;
  return 502;
}

async function guarded<T>(correlationId: string, work: () => Promise<T>) {
  if (activeRequests >= MAX_CONCURRENCY) {
    return {
      status: 429,
      body: {
        status: "error",
        code: "CONCURRENCY_LIMIT",
        message: "The MCV worker is busy. Please try again shortly.",
      },
    };
  }

  activeRequests += 1;
  try {
    return { status: 200, body: await withTimeout(work()) };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    log("error", "worker request failed", { correlationId, error: message.slice(0, 500) });
    return {
      status: /TIMEOUT/i.test(message) ? 504 : 502,
      body: {
        status: "error",
        code: /TIMEOUT/i.test(message) ? "TIMEOUT" : "SIMULATION_FAILED",
        message: "The official MCV simulation could not be completed. No customs amount was generated.",
      },
    };
  } finally {
    activeRequests -= 1;
  }
}

async function handle(request: IncomingMessage, response: ServerResponse) {
  const correlationId = (request.headers["x-correlation-id"] as string | undefined) || randomUUID();
  const url = new URL(request.url || "/", `http://${request.headers.host || "localhost"}`);

  if (request.method === "GET" && url.pathname === "/healthz") {
    sendJson(response, 200, { status: "ok" }, correlationId);
    return;
  }

  if (request.method === "GET" && url.pathname === "/readyz") {
    sendJson(response, shuttingDown ? 503 : 200, {
      status: shuttingDown ? "shutting_down" : "ready",
      activeRequests,
      maxConcurrency: MAX_CONCURRENCY,
    }, correlationId);
    return;
  }

  if (!authorized(request)) {
    sendJson(response, 401, { status: "error", code: "UNAUTHORIZED", message: "Unauthorized." }, correlationId);
    return;
  }

  if (shuttingDown) {
    sendJson(response, 503, { status: "error", code: "MCV_UNAVAILABLE", message: "Worker is shutting down." }, correlationId);
    return;
  }

  if (request.method === "POST" && url.pathname === "/mcv/calculate") {
    let payload: Record<string, unknown>;
    try {
      payload = await readJson(request);
    } catch {
      sendJson(response, 400, { status: "error", code: "VALIDATION_ERROR", message: "Invalid request body." }, correlationId);
      return;
    }

    const input = validateCalculation(payload);
    if ("error" in input) {
      sendJson(response, 400, { status: "error", code: "VALIDATION_ERROR", message: input.error }, correlationId);
      return;
    }

    log("info", "mcv calculation started", { correlationId });
    const result = await guarded(correlationId, () => calculateMcv(input));
    sendJson(response, resultStatus(result.body as { status?: string; code?: string }), result.body, correlationId);
    return;
  }

  if (request.method === "POST" && url.pathname === "/mcv/readiness/live") {
    if (!E2E_READINESS_ENABLED) {
      sendJson(response, 403, {
        status: "error",
        code: "READINESS_DISABLED",
        message: "Live MCV readiness checks are disabled.",
      }, correlationId);
      return;
    }

    let payload: Record<string, unknown>;
    try {
      payload = await readJson(request);
    } catch {
      sendJson(response, 400, { status: "error", code: "VALIDATION_ERROR", message: "Invalid request body." }, correlationId);
      return;
    }

    const input = validateCalculation(payload);
    if ("error" in input) {
      sendJson(response, 400, { status: "error", code: "VALIDATION_ERROR", message: input.error }, correlationId);
      return;
    }

    log("info", "live mcv readiness started", { correlationId });
    const result = await guarded(correlationId, () => calculateMcv(input));
    sendJson(response, resultStatus(result.body as { status?: string; code?: string }), result.body, correlationId);
    return;
  }

  if (request.method === "GET" && url.pathname === "/mcv/options") {
    const input: McvOptionsRequest = {
      manufacturer: clean(url.searchParams.get("manufacturer"), 120) || undefined,
      modelQuery: clean(url.searchParams.get("modelQuery"), 180) || undefined,
    };
    const result = await guarded(correlationId, () => getMcvOptions(input));
    sendJson(response, result.status, result.body, correlationId);
    return;
  }

  sendJson(response, 404, { status: "error", code: "NOT_FOUND", message: "Not found." }, correlationId);
}

const server = http.createServer((request, response) => {
  handle(request, response).catch((error) => {
    const correlationId = (request.headers["x-correlation-id"] as string | undefined) || randomUUID();
    log("error", "unhandled request failure", { correlationId, error: error instanceof Error ? error.message : String(error) });
    sendJson(response, 500, {
      status: "error",
      code: "MCV_UNAVAILABLE",
      message: "The MCV worker failed unexpectedly. No customs amount was generated.",
    }, correlationId);
  });
});

function shutdown(signal: string) {
  shuttingDown = true;
  log("info", "worker shutting down", { signal });
  server.close(() => process.exit(0));
  setTimeout(() => process.exit(1), 10_000).unref();
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

server.listen(PORT, "0.0.0.0", () => {
  log("info", "mcv worker listening", { port: PORT, maxConcurrency: MAX_CONCURRENCY });
});
