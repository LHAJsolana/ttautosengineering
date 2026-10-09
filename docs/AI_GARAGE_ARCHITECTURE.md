# TT AUTO'S AI Garage Architecture

## Phase 1 Audit

The site already has a strong structured knowledge base:

- `src/lib/search.ts` combines MDX insights, blog posts, brands, model years, powertrains, fault codes, static tools, and vehicle-history copy.
- `src/lib/faultCodes.ts`, `src/lib/models.ts`, `src/lib/modelYears.ts`, `src/lib/powertrains.ts`, and `src/lib/partsFailureMap.ts` expose typed automotive data.
- `src/app/api/leads/route.ts` already demonstrates request-size checks, validation, rate limiting, bot protection, and server-only secrets.
- The locale system is centralized in `src/lib/i18n.ts` and page routes follow the `src/app/[locale]/...` pattern.
- The live Moroccan customs feature lives behind server API routes in `src/app/api/mcv/...` and should be treated as an external official-site dependency.

The current project does not have persistent chat storage, embeddings, a vector database, account-level user identity, or a durable job queue. Phase 2 therefore uses server-side retrieval over the existing local index first, with OpenAI enabled only when `OPENAI_API_KEY` is configured.

## Implemented Scope

- Dedicated page: `src/app/[locale]/ai-garage/page.tsx`
- Sitewide launcher: `src/components/ai-garage/GarageFloatingWidget.client.tsx`
- Shared chat UI: `src/components/ai-garage/GarageChat.client.tsx`
- Secure API: `src/app/api/ai/chat/route.ts`
- AI orchestration: `src/lib/ai/agent.ts`
- Local retrieval: `src/lib/ai/retrieve.ts`
- Server config: `src/lib/ai/config.ts`
- Public discovery: homepage feature card, tools page, footer, search index, sitemap, and validation tests.

## Runtime Flow

1. The browser sends locale, recent messages, vehicle context, and minimal page context to `/api/ai/chat`.
2. The API enforces body size and in-memory IP rate limiting.
3. `answerGarageChat()` normalizes the request and retrieves relevant TT AUTO'S sources using the existing local search index.
4. If the user asks for Moroccan customs and provides every required official field, the server runs the typed MCV tool against the existing MCV automation client.
5. If `OPENAI_API_KEY` is set, the server calls the OpenAI Responses API with `stream: true` and relays `response.output_text.delta` events to the UI.
6. If no key is configured, the API returns a deterministic fallback answer with citations, useful next actions, and an explicit fallback label.

## Safety And Limits

- `OPENAI_API_KEY` is read only in server code.
- The client never sends full page HTML or secrets.
- The assistant does not invent Moroccan customs amounts. Customs questions are routed toward the live MCV calculator unless exact official output is available.
- The AI-to-MCV tool only reports amounts from the official simulator result object. Missing fields and official ambiguity are returned as tool state, not guessed values.
- Safety-critical language around brakes, steering, fire, smoke, overheating, and oil pressure triggers a stop-driving warning.
- Rate limiting is in memory, which is acceptable for a first deployment but should become durable for multi-instance hosting.
- MCV automation uses one active job per server instance, bounded retries, diagnostics, and browser cleanup on timeout.

## Environment

```bash
AI_GARAGE_ENABLED=true
OPENAI_API_KEY=
OPENAI_TEXT_MODEL=gpt-4.1-mini
AI_MAX_INPUT_CHARS=6000
AI_MAX_OUTPUT_TOKENS=900
AI_MAX_REQUESTS_PER_WINDOW=30
AI_RATE_LIMIT_WINDOW_MS=900000
MCV_MAX_ATTEMPTS=2
```

## Verification Notes

- Local fallback chat was verified through `/api/ai/chat`.
- AI-to-MCV was verified through `/api/ai/chat` with Mercedes `C 220D /AMG LINE/ 4MATIC (TYPE AF)`, type `AF0EB`, first registration `01/01/2022`, beneficiary `AUTRE`; the official result returned `178 294 DH` from `https://www.douane.gov.ma/mcv/#/view?pageId=2` at `2026-10-09T14:35:10.893Z`.
- Retrieval smoke checks were run for OM654/OM651, BMW N47/B47, P0299, and VW Golf/Audi A3 DSG-style questions.
- Live OpenAI mode was not verified in this workspace because `.env.local` does not contain a configured `OPENAI_API_KEY`.

## Next Phases

- Add persistent conversation memory with explicit retention controls.
- Add embeddings and a vector database if local search quality becomes insufficient.
- Add a durable queue and monitoring around the official MCV dependency.
- Add Realtime voice only after a server endpoint for ephemeral Realtime client secrets is configured.
- Add image triage only with clear disclaimers and no safety-critical diagnosis from photos alone.
