import { NextRequest, NextResponse } from "next/server";
import { appendFile, mkdir } from "node:fs/promises";
import { dirname } from "node:path";

type LeadPayload = {
  source?: unknown;
  brand?: unknown;
  model?: unknown;
  year?: unknown;
  engine?: unknown;
  mileage?: unknown;
  gearbox?: unknown;
  market?: unknown;
  vin?: unknown;
  question?: unknown;
  contact?: unknown;
  consent?: unknown;
  company?: unknown;
  locale?: unknown;
  "cf-turnstile-response"?: unknown;
};

const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const RATE_LIMIT_MAX = 5;
const MAX_BODY_BYTES = 20_000;
const rateLimits = new Map<string, { count: number; resetAt: number }>();

const limits = {
  source: 80,
  brand: 40,
  model: 100,
  year: 10,
  engine: 100,
  mileage: 50,
  gearbox: 60,
  market: 100,
  vin: 24,
  question: 1500,
  contact: 200,
  locale: 5,
} as const;

function clean(value: unknown, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function normalizeLead(payload: LeadPayload) {
  return Object.fromEntries(
    Object.entries(limits).map(([key, max]) => [
      key,
      clean(payload[key as keyof LeadPayload], max),
    ])
  ) as Record<keyof typeof limits, string>;
}

function clientIp(request: NextRequest) {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";
}

function isRateLimited(key: string) {
  const now = Date.now();
  const current = rateLimits.get(key);
  if (!current || current.resetAt <= now) {
    rateLimits.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }
  current.count += 1;
  return current.count > RATE_LIMIT_MAX;
}

function isValidLead(lead: ReturnType<typeof normalizeLead>) {
  const year = lead.year ? Number(lead.year) : undefined;
  const validYear = year === undefined || (Number.isInteger(year) && year >= 1980 && year <= new Date().getFullYear() + 1);
  const validVin = !lead.vin || /^[A-HJ-NPR-Z0-9]{11,17}$/i.test(lead.vin);
  const validContact = lead.contact.length >= 5 && /[@+\d]/.test(lead.contact);
  return validYear && validVin && validContact;
}

async function verifyTurnstile(token: unknown, ip: string) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true;
  if (typeof token !== "string" || !token) return false;

  const body = new URLSearchParams({ secret, response: token, remoteip: ip });
  const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    body,
  });
  if (!response.ok) return false;
  const result = (await response.json()) as { success?: boolean };
  return result.success === true;
}

function leadText(lead: ReturnType<typeof normalizeLead>) {
  return [
    "New used-car risk review request",
    "",
    `Source: ${lead.source || "site"}`,
    `Locale: ${lead.locale || "en"}`,
    `Vehicle: ${lead.brand} ${lead.model}`,
    `Year: ${lead.year || "Not supplied"}`,
    `Engine: ${lead.engine || "Not supplied"}`,
    `Mileage: ${lead.mileage || "Not supplied"}`,
    `Gearbox: ${lead.gearbox || "Not supplied"}`,
    `Market: ${lead.market || "Not supplied"}`,
    `VIN: ${lead.vin || "Not supplied"}`,
    `Contact: ${lead.contact}`,
    "",
    "Question:",
    lead.question || "No question supplied",
  ].join("\n");
}

async function sendWithResend(lead: ReturnType<typeof normalizeLead>) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.LEAD_TO_EMAIL;
  if (!apiKey || !to) return false;

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.LEAD_FROM_EMAIL ?? "TT AUTO'S Leads <leads@ttautosengineering.com>",
      to: [to],
      subject: `Used-car review: ${lead.brand} ${lead.model}`,
      text: leadText(lead),
      reply_to: lead.contact.includes("@") ? lead.contact : undefined,
    }),
  });

  if (!response.ok) throw new Error(`Resend rejected the lead (${response.status})`);
  return true;
}

async function sendToWebhook(lead: ReturnType<typeof normalizeLead>) {
  const url = process.env.LEAD_WEBHOOK_URL;
  if (!url) return false;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(process.env.LEAD_WEBHOOK_SECRET
        ? { Authorization: `Bearer ${process.env.LEAD_WEBHOOK_SECRET}` }
        : {}),
    },
    body: JSON.stringify({ type: "used_car_risk_review", submittedAt: new Date().toISOString(), ...lead }),
  });

  if (!response.ok) throw new Error(`Lead webhook rejected the request (${response.status})`);
  return true;
}

async function storeLead(lead: ReturnType<typeof normalizeLead>) {
  const storagePath = process.env.LEAD_STORAGE_PATH;
  if (!storagePath) return false;

  await mkdir(dirname(storagePath), { recursive: true, mode: 0o700 });
  await appendFile(
    storagePath,
    `${JSON.stringify({
      id: crypto.randomUUID(),
      submittedAt: new Date().toISOString(),
      ...lead,
    })}\n`,
    { encoding: "utf8", mode: 0o600 }
  );
  return true;
}

export async function POST(request: NextRequest) {
  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > MAX_BODY_BYTES) {
    return NextResponse.json({ error: "Request body is too large." }, { status: 413 });
  }

  const origin = request.headers.get("origin");
  if (origin) {
    try {
      const requestHost = request.headers.get("x-forwarded-host") ??
        request.headers.get("host") ??
        request.nextUrl.host;
      if (new URL(origin).host !== requestHost) {
        return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
      }
    } catch {
      return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
    }
  }

  const ip = clientIp(request);
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many requests. Please wait before trying again." },
      { status: 429, headers: { "Retry-After": "900" } }
    );
  }

  let payload: LeadPayload;
  try {
    payload = (await request.json()) as LeadPayload;
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (clean(payload.company, 100)) return NextResponse.json({ ok: true });
  const lead = normalizeLead(payload);

  if (!lead.brand || !lead.model || !lead.contact || payload.consent !== "yes") {
    return NextResponse.json(
      { error: "Brand, model, contact method, and consent are required." },
      { status: 400 }
    );
  }

  if (!isValidLead(lead)) {
    return NextResponse.json(
      { error: "Please check the year, VIN, and contact details." },
      { status: 400 }
    );
  }

  if (!(await verifyTurnstile(payload["cf-turnstile-response"], ip))) {
    return NextResponse.json({ error: "Security check failed. Please try again." }, { status: 403 });
  }

  try {
    const delivered = (await sendWithResend(lead)) ||
      (await sendToWebhook(lead)) ||
      (await storeLead(lead));
    if (!delivered) {
      return NextResponse.json(
        { error: "Lead delivery is not configured yet. Please email contact@ttautosengineering.com." },
        { status: 503 }
      );
    }
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "The request could not be delivered. Please try again or contact us by email." },
      { status: 502 }
    );
  }
}
