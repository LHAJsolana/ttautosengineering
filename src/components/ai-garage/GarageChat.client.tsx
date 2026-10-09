"use client";

import { FormEvent, useMemo, useRef, useState } from "react";
import type { Locale } from "@/lib/i18n";
import type { GarageAction, GarageCitation, GarageChatMessage, GarageVehicleContext, GarageAnswer } from "@/lib/ai/types";

type ChatMessage = GarageChatMessage & {
  citations?: GarageCitation[];
  actions?: GarageAction[];
  mode?: "openai" | "local";
  tools?: GarageAnswer["tools"];
};

const suggestions = [
  "Explain P0299 on a BMW B47 before I buy it",
  "Compare a Golf 7 GTI and Audi A3 2.0 TFSI",
  "What should I check on a Mercedes C220d W205?",
  "I want to import a 2022 BMW 320d to Morocco",
];

function blankVehicle(): GarageVehicleContext {
  return { brand: "", model: "", year: "", engine: "", mileage: "", market: "" };
}

export default function GarageChat({ locale, compact = false }: { locale: Locale; compact?: boolean }) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Tell me the car, engine, year, mileage, market, and what you are trying to decide or diagnose. I will ground the answer in TT AUTO'S content where possible.",
      mode: "local",
    },
  ]);
  const [input, setInput] = useState("");
  const [vehicle, setVehicle] = useState<GarageVehicleContext>(blankVehicle);
  const [isSending, setIsSending] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const visibleMessages = useMemo(() => messages.slice(-10), [messages]);

  async function sendMessage(text: string) {
    const trimmed = text.trim();
    if (!trimmed || isSending) return;

    const userMessage: ChatMessage = { role: "user", content: trimmed };
    const assistantIndex = messages.length + 1;
    const nextMessages = [...messages, userMessage, { role: "assistant" as const, content: "" }];
    setMessages(nextMessages);
    setInput("");
    setIsSending(true);
    abortRef.current?.abort();
    abortRef.current = new AbortController();

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          locale,
          vehicle,
          messages: [...messages, userMessage].map(({ role, content }) => ({ role, content })),
          pageContext: typeof document === "undefined" ? undefined : { title: document.title, pathname: location.pathname },
        }),
        signal: abortRef.current.signal,
      });

      if (!response.ok || !response.body) {
        throw new Error("AI Garage is unavailable right now.");
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
          const line = event.split("\n").find((item) => item.startsWith("data: "));
          if (!line) continue;
          const payload = JSON.parse(line.slice(6));
          if (payload.type === "delta") {
            setMessages((current) =>
              current.map((message, index) =>
                index === assistantIndex ? { ...message, content: `${message.content}${payload.text}` } : message
              )
            );
          }
          if (payload.type === "final") {
            setMessages((current) =>
              current.map((message, index) =>
                index === assistantIndex
                  ? { ...message, citations: payload.citations, actions: payload.actions, mode: payload.mode, tools: payload.tools }
                  : message
              )
            );
          }
          if (payload.type === "error") throw new Error(payload.message);
        }
      }
    } catch (error) {
      setMessages((current) =>
        current.map((message, index) =>
          index === assistantIndex
            ? {
                ...message,
                content: error instanceof Error ? error.message : "AI Garage could not answer this request.",
                mode: "local",
              }
            : message
        )
      );
    } finally {
      setIsSending(false);
    }
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void sendMessage(input);
  }

  return (
    <section className={compact ? "flex h-full flex-col" : "grid gap-5 lg:grid-cols-[0.75fr_1.25fr]"}>
      {!compact && (
        <aside className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-red-300">Vehicle context</h2>
          <div className="mt-4 grid gap-3">
            {(["brand", "model", "year", "engine", "mileage", "market"] as const).map((field) => (
              <label key={field} className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                {field}
                <input
                  className="mt-1 w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm normal-case text-white outline-none transition focus:border-red-400"
                  value={vehicle[field] ?? ""}
                  onChange={(event) => setVehicle((current) => ({ ...current, [field]: event.target.value }))}
                  placeholder={field === "market" ? "EU, Morocco, NL..." : ""}
                />
              </label>
            ))}
          </div>
        </aside>
      )}

      <div className="flex min-h-[520px] flex-col rounded-2xl border border-white/10 bg-[#0b1220]">
        <div className="border-b border-white/10 px-4 py-3">
          <div className="text-sm font-bold text-white">TT AUTO&apos;S AI Garage</div>
          <div className="text-xs text-gray-500">Text assistant with local TT AUTO&apos;S retrieval and optional OpenAI backend.</div>
        </div>

        <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
          {visibleMessages.map((message, index) => (
            <div key={`${message.role}-${index}`} className={message.role === "user" ? "ms-auto max-w-[88%]" : "me-auto max-w-[92%]"}>
              <div
                className={
                  message.role === "user"
                    ? "rounded-2xl bg-red-500 px-4 py-3 text-sm leading-6 text-white"
                    : "rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm leading-6 text-gray-200"
                }
              >
                <p className="whitespace-pre-wrap">{message.content || "Thinking..."}</p>
                {message.mode === "local" && message.role === "assistant" && (
                  <p className="mt-2 text-xs text-gray-500">Fallback mode</p>
                )}
              </div>
              {message.tools?.mcv?.status === "success" && (
                <div className="mt-2 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-xs text-emerald-50">
                  <div className="font-bold">Official MCV result: {message.tools.mcv.total.amountMad.toLocaleString("fr-MA")} MAD</div>
                  <div className="mt-1 text-emerald-100/80">
                    Source: {message.tools.mcv.sourceUrl} | {new Date(message.tools.mcv.calculatedAt).toLocaleString()}
                  </div>
                </div>
              )}
              {message.tools?.mcv?.status === "error" && (
                <div className="mt-2 rounded-2xl border border-amber-400/20 bg-amber-400/10 px-4 py-3 text-xs text-amber-50">
                  <div className="font-bold">MCV tool: {message.tools.mcv.code}</div>
                  <div className="mt-1 text-amber-100/80">{message.tools.mcv.message}</div>
                </div>
              )}
              {message.tools?.mcv?.status === "missing_fields" && (
                <div className="mt-2 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-xs text-gray-300">
                  {message.tools.mcv.message}
                </div>
              )}
              {!!message.actions?.length && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {message.actions.map((action) => (
                    <a key={action.href} className="rounded-full border border-red-400/40 px-3 py-1 text-xs font-bold text-red-200" href={action.href}>
                      {action.label}
                    </a>
                  ))}
                </div>
              )}
              {!!message.citations?.length && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {message.citations.map((citation) => (
                    <a key={citation.href} className="rounded-full border border-white/10 px-3 py-1 text-xs text-gray-400 hover:text-white" href={citation.href}>
                      {citation.title}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {!compact && (
          <div className="border-t border-white/10 px-4 py-3">
            <div className="flex flex-wrap gap-2">
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-gray-300 transition hover:border-red-400/60 hover:text-white"
                  type="button"
                  onClick={() => void sendMessage(suggestion)}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        <form className="flex gap-2 border-t border-white/10 p-3" onSubmit={onSubmit}>
          <input
            className="min-w-0 flex-1 rounded-xl border border-white/10 bg-black/30 px-3 py-3 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-red-400"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Ask about faults, reliability, buying decisions, imports..."
          />
          <button
            className="rounded-xl bg-white px-4 py-3 text-sm font-black text-gray-950 transition hover:bg-red-200 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={isSending}
            type="submit"
          >
            {isSending ? "..." : "Send"}
          </button>
        </form>
      </div>
    </section>
  );
}
