import type { McvApiResult, McvCalculationRequest, McvOptionsRequest, McvOptionsResult } from "./types";

const DEFAULT_TIMEOUT_MS = 85_000;

type WorkerResponse<T> = {
  status: number;
  body: T;
};

function workerConfig() {
  const url = process.env.MCV_WORKER_URL?.trim();
  const token = process.env.MCV_WORKER_TOKEN?.trim();
  if (!url || !token) return null;

  let baseUrl: URL;
  try {
    baseUrl = new URL(url);
  } catch {
    return null;
  }

  if (!["http:", "https:"].includes(baseUrl.protocol)) return null;
  baseUrl.pathname = baseUrl.pathname.replace(/\/+$/, "");
  return {
    baseUrl: baseUrl.toString().replace(/\/$/, ""),
    token,
    timeoutMs: Math.max(5_000, Math.min(120_000, Number(process.env.MCV_WORKER_TIMEOUT_MS || DEFAULT_TIMEOUT_MS))),
  };
}

function correlationId() {
  return `mcv_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

async function requestWorker<T>(path: string, init: RequestInit): Promise<WorkerResponse<T> | null> {
  const config = workerConfig();
  if (!config) return null;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), config.timeoutMs);
  try {
    const response = await fetch(`${config.baseUrl}${path}`, {
      ...init,
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.token}`,
        "x-correlation-id": correlationId(),
        ...(init.headers || {}),
      },
      cache: "no-store",
    });

    const body = (await response.json().catch(() => ({
      status: "error",
      code: "MCV_UNAVAILABLE",
      message: "The MCV worker returned an unreadable response. No customs amount was generated.",
    }))) as T;

    return { status: response.status, body };
  } catch {
    return {
      status: 503,
      body: {
        status: "error",
        code: "MCV_UNAVAILABLE",
        message: "The MCV worker is unavailable. No customs amount was generated.",
      } as T,
    };
  } finally {
    clearTimeout(timeout);
  }
}

export async function calculateMcvWithWorker(input: McvCalculationRequest) {
  return requestWorker<McvApiResult>("/mcv/calculate", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function getMcvOptionsWithWorker(input: McvOptionsRequest) {
  const params = new URLSearchParams();
  if (input.manufacturer) params.set("manufacturer", input.manufacturer);
  if (input.modelQuery) params.set("modelQuery", input.modelQuery);
  const query = params.toString();
  return requestWorker<McvOptionsResult & { error?: string }>(`/mcv/options${query ? `?${query}` : ""}`, {
    method: "GET",
  });
}
