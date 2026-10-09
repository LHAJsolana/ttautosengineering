import { defaultLocale, isLocale, type Locale } from "@/lib/i18n";
import { aiConfig } from "@/lib/ai/config";
import { runMcvTool, type GarageMcvToolResult } from "@/lib/ai/mcvTool";
import { retrieveGarageContext } from "@/lib/ai/retrieve";
import type { GarageAnswer, GarageChatMessage, GarageChatRequest, GarageCitation, GarageAction } from "@/lib/ai/types";

function cleanText(value: unknown, limit: number) {
  return String(value ?? "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, limit);
}

export function normalizeGarageRequest(input: GarageChatRequest) {
  const locale: Locale = input.locale && isLocale(input.locale) ? input.locale : defaultLocale;
  const messages = Array.isArray(input.messages)
    ? input.messages
        .filter((message): message is GarageChatMessage => {
          return (
            message &&
            (message.role === "user" || message.role === "assistant") &&
            typeof message.content === "string" &&
            message.content.trim().length > 0
          );
        })
        .slice(-8)
        .map((message) => ({
          role: message.role,
          content: cleanText(message.content, 1400),
        }))
    : [];

  return {
    locale,
    messages,
    vehicle: input.vehicle,
    pageContext: input.pageContext,
  };
}

function lastUserMessage(messages: GarageChatMessage[]) {
  return [...messages].reverse().find((message) => message.role === "user")?.content ?? "";
}

function mcvToolText(mcv: GarageMcvToolResult | undefined) {
  if (!mcv) return "";
  if (mcv.status === "missing_fields") {
    return `MCV tool status: missing required fields. ${mcv.message}`;
  }
  if (mcv.status === "error") {
    const options = mcv.options?.length ? ` Options: ${mcv.options.map((option) => option.label).slice(0, 12).join("; ")}.` : "";
    return `MCV tool status: ${mcv.code}. ${mcv.message}${options}`;
  }
  return [
    "MCV tool status: success.",
    `Official total: ${mcv.total.amountMad.toLocaleString("fr-MA")} MAD (${mcv.total.raw}).`,
    `Official source: ${mcv.sourceUrl}.`,
    `Calculated at: ${mcv.calculatedAt}.`,
    `Vehicle: ${mcv.vehicle.manufacturer} ${mcv.vehicle.model}, type ${mcv.vehicle.vehicleType}, first registration ${mcv.vehicle.firstRegistrationDate}, beneficiary ${mcv.vehicle.beneficiaryType}.`,
  ].join(" ");
}

function localAnswer(query: string, retrieval: ReturnType<typeof retrieveGarageContext>, mcv?: GarageMcvToolResult): string {
  const lines = [
    retrieval.safetyNotice,
    "Fallback mode: I can help with a grounded first pass from TT AUTO'S Engineering content, but this is not a live OpenAI response.",
    mcvToolText(mcv),
    retrieval.context
      ? "Based on the closest site references, focus on the matching fault pattern, service history, symptoms under load, and whether the repair risk matches the vehicle price."
      : "I do not have a close local match yet. Share the brand, model, year, engine, mileage, market, symptoms, and any fault codes so I can narrow it down.",
  ].filter(Boolean);

  if (/morocco|maroc|douane|customs|import|mcv/i.test(query) && !mcv) {
    lines.push(
      "For Moroccan import duties, use the live MCV calculator because the official values depend on exact vehicle type, first registration date, and beneficiary profile."
    );
  }

  if (retrieval.citations.length) {
    lines.push(`Useful next references: ${retrieval.citations.map((item) => item.title).join("; ")}.`);
  }

  return lines.join("\n\n");
}

function buildOpenAIRequest(
  messages: GarageChatMessage[],
  query: string,
  retrieval: ReturnType<typeof retrieveGarageContext>,
  mcv: GarageMcvToolResult | undefined,
  stream: boolean
) {
  const conversation = messages
    .map((message) => `${message.role.toUpperCase()}: ${message.content}`)
    .join("\n")
    .slice(-aiConfig.maxInputChars);

  const instructions = [
    "You are TT AUTO'S AI Garage, a multilingual automotive engineering assistant.",
    "Give concise, practical used-car buying, diagnosis, reliability, maintenance, and import guidance.",
    "Ground answers in the provided TT AUTO'S context when it is relevant.",
    "Never invent official customs values. If MCV tool output is present, report it exactly with source and timestamp. If fields are missing or ambiguous, ask for the exact official values.",
    "For safety-critical symptoms, advise stopping driving and getting professional inspection.",
    "Ask for missing vehicle details when needed: brand, model, year, engine, mileage, market, symptoms, fault codes, service history.",
  ].join("\n");

  return {
    model: aiConfig.textModel,
    instructions,
    input: [
      {
        role: "user",
        content: [
          {
            type: "input_text",
            text: [
              `Conversation:\n${conversation}`,
              `Current question:\n${query}`,
              `TT AUTO'S retrieval context:\n${retrieval.context || "No close local match."}`,
              mcv ? `Server-side MCV tool result:\n${mcvToolText(mcv)}` : "",
              retrieval.safetyNotice ? `Safety notice:\n${retrieval.safetyNotice}` : "",
            ]
              .filter(Boolean)
              .join("\n\n"),
          },
        ],
      },
    ],
    max_output_tokens: aiConfig.maxOutputTokens,
    stream,
    store: false,
  };
}

async function callOpenAI(
  messages: GarageChatMessage[],
  query: string,
  retrieval: ReturnType<typeof retrieveGarageContext>,
  mcv?: GarageMcvToolResult
) {
  if (!aiConfig.openAiApiKey) return undefined;

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${aiConfig.openAiApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(buildOpenAIRequest(messages, query, retrieval, mcv, false)),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(`OpenAI request failed (${response.status}): ${detail.slice(0, 240)}`);
  }

  const data = await response.json();
  if (typeof data.output_text === "string" && data.output_text.trim()) {
    return data.output_text.trim();
  }

  const chunks: string[] = [];
  for (const item of data.output ?? []) {
    for (const content of item.content ?? []) {
      if (typeof content.text === "string") chunks.push(content.text);
    }
  }
  return chunks.join("\n").trim() || undefined;
}

export async function* streamOpenAIText(
  messages: GarageChatMessage[],
  query: string,
  retrieval: ReturnType<typeof retrieveGarageContext>,
  mcv?: GarageMcvToolResult
) {
  if (!aiConfig.openAiApiKey) return;

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${aiConfig.openAiApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(buildOpenAIRequest(messages, query, retrieval, mcv, true)),
  });

  if (!response.ok || !response.body) {
    const detail = await response.text().catch(() => "");
    throw new Error(`OpenAI streaming request failed (${response.status}): ${detail.slice(0, 240)}`);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  for (;;) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const events = buffer.split("\n\n");
    buffer = events.pop() ?? "";
    for (const event of events) {
      const dataLine = event.split("\n").find((line) => line.startsWith("data: "));
      if (!dataLine) continue;
      const raw = dataLine.slice(6).trim();
      if (!raw || raw === "[DONE]") continue;
      const payload = JSON.parse(raw);
      if (payload.type === "response.output_text.delta" && typeof payload.delta === "string") {
        yield payload.delta;
      }
      if (payload.type === "response.failed") {
        throw new Error(payload.response?.error?.message || "OpenAI response failed.");
      }
    }
  }
}

export async function prepareGarageAnswer(request: GarageChatRequest) {
  const normalized = normalizeGarageRequest(request);
  const query = lastUserMessage(normalized.messages);

  if (!aiConfig.enabled) {
    return {
      normalized,
      query,
      retrieval: retrieveGarageContext("", normalized.locale, normalized.vehicle),
      mcv: undefined,
      disabled: true,
    };
  }

  const retrieval = retrieveGarageContext(query, normalized.locale, normalized.vehicle);
  const mcv = await runMcvTool(request);
  return { normalized, query, retrieval, mcv, disabled: false };
}

export async function answerGarageChat(request: GarageChatRequest): Promise<GarageAnswer> {
  const prepared = await prepareGarageAnswer(request);
  const { normalized, query, retrieval, mcv } = prepared;

  if (prepared.disabled) {
    return {
      text: "TT AUTO'S AI Garage is currently disabled by configuration.",
      citations: [],
      actions: [],
      mode: "local",
    };
  }

  if (!query) {
    return {
      text: "Tell me the car, engine, year, mileage, market, and what you want to decide or diagnose.",
      citations: [],
      actions: [],
      mode: "local",
    };
  }

  const openAiText = await callOpenAI(normalized.messages, query, retrieval, mcv);
  const actions: GarageAction[] = [...retrieval.actions];
  const citations: GarageCitation[] = [...retrieval.citations];
  if (mcv?.status === "success") {
    citations.unshift({ title: "Official Moroccan Customs MCV result", href: mcv.sourceUrl, type: "Official Source" });
  }

  return {
    text: openAiText || localAnswer(query, retrieval, mcv),
    citations,
    actions,
    mode: openAiText ? "openai" : "local",
    tools: mcv ? { mcv } : undefined,
  };
}
