import { NextResponse } from "next/server";
import { answerGarageChat, prepareGarageAnswer, streamOpenAIText } from "@/lib/ai/agent";
import { aiConfig } from "@/lib/ai/config";
import type { GarageChatRequest } from "@/lib/ai/types";

export const runtime = "nodejs";

const ipHits = new Map<string, { count: number; resetAt: number }>();

function clientIp(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || request.headers.get("x-real-ip") || "unknown";
}

function rateLimited(ip: string) {
  const now = Date.now();
  const current = ipHits.get(ip);
  if (!current || current.resetAt <= now) {
    ipHits.set(ip, { count: 1, resetAt: now + aiConfig.rateLimitWindowMs });
    return false;
  }
  current.count += 1;
  return current.count > aiConfig.maxRequestsPerWindow;
}

function sse(payload: unknown) {
  return `data: ${JSON.stringify(payload)}\n\n`;
}

export async function POST(request: Request) {
  if (rateLimited(clientIp(request))) {
    return NextResponse.json({ error: "Too many AI Garage requests. Please try again soon." }, { status: 429 });
  }

  const raw = await request.text();
  if (raw.length > aiConfig.maxInputChars + 4000) {
    return NextResponse.json({ error: "Request is too large." }, { status: 413 });
  }

  let body: GarageChatRequest;
  try {
    body = JSON.parse(raw) as GarageChatRequest;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      try {
        if (aiConfig.openAiApiKey) {
          const prepared = await prepareGarageAnswer(body);
          if (!prepared.query || prepared.disabled) {
            const answer = await answerGarageChat(body);
            const parts = answer.text.match(/.{1,180}(\s|$)/g) ?? [answer.text];
            for (const part of parts) controller.enqueue(encoder.encode(sse({ type: "delta", text: part })));
            controller.enqueue(
              encoder.encode(
                sse({
                  type: "final",
                  citations: answer.citations,
                  actions: answer.actions,
                  mode: answer.mode,
                  tools: answer.tools,
                })
              )
            );
            return;
          }

          const citations = [...prepared.retrieval.citations];
          if (prepared.mcv?.status === "success") {
            citations.unshift({
              title: "Official Moroccan Customs MCV result",
              href: prepared.mcv.sourceUrl,
              type: "Official Source",
            });
          }

          for await (const delta of streamOpenAIText(
            prepared.normalized.messages,
            prepared.query,
            prepared.retrieval,
            prepared.mcv
          )) {
            controller.enqueue(encoder.encode(sse({ type: "delta", text: delta })));
          }
          controller.enqueue(
            encoder.encode(
              sse({
                type: "final",
                citations,
                actions: prepared.retrieval.actions,
                mode: "openai",
                tools: prepared.mcv ? { mcv: prepared.mcv } : undefined,
              })
            )
          );
          return;
        }

        const answer = await answerGarageChat(body);
        const parts = answer.text.match(/.{1,180}(\s|$)/g) ?? [answer.text];
        for (const part of parts) controller.enqueue(encoder.encode(sse({ type: "delta", text: part })));
        controller.enqueue(
          encoder.encode(
            sse({
              type: "final",
              citations: answer.citations,
              actions: answer.actions,
              mode: answer.mode,
              tools: answer.tools,
            })
          )
        );
      } catch (error) {
        controller.enqueue(
          encoder.encode(
            sse({
              type: "error",
              message: error instanceof Error ? error.message : "AI Garage failed to answer.",
            })
          )
        );
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-store",
      Connection: "keep-alive",
    },
  });
}
