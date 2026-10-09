import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const root = process.cwd();

function source(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

test("AI Garage public launch is server controlled and defaults to pre-launch", () => {
  const env = source(".env.example");
  const access = source("src/lib/ai/access.ts");
  const route = source("src/app/api/ai/chat/route.ts");

  assert.match(env, /AI_GARAGE_PUBLIC_ENABLED=false/);
  assert.match(env, /AI_GARAGE_PREVIEW_TOKEN=/);
  assert.match(access, /process\.env\.AI_GARAGE_PUBLIC_ENABLED === "true"/);
  assert.match(access, /AI_GARAGE_PREVIEW_TOKEN/);
  assert.match(access, /authorization\.toLowerCase\(\)\.startsWith\("bearer "\)/);
  assert.match(access, /x-ai-garage-preview-token/);
  assert.match(access, /tt_ai_garage_preview/);
  assert.match(route, /canAccessAiGarage\(request\.headers\)/);
  assert.match(route, /status: "coming_soon"/);
  assert.match(route, /status: 403/);
});

test("public AI Garage route renders the Coming Soon experience while preserving preview chat", () => {
  const page = source("src/app/[locale]/ai-garage/page.tsx");
  const comingSoon = source("src/components/ai-garage/AIGarageComingSoon.tsx");
  const widget = source("src/components/ai-garage/GarageFloatingWidget.client.tsx");

  assert.match(page, /AIGarageComingSoon/);
  assert.match(page, /canAccessAiGarage/);
  assert.match(page, /GarageChat/);
  assert.match(comingSoon, /YOUR CAR\. A NEW INTELLIGENCE\./);
  assert.match(comingSoon, /Voice AI/);
  assert.match(comingSoon, /Mechanical diagnosis/);
  assert.match(comingSoon, /Fault-code assistance/);
  assert.match(comingSoon, /Photo understanding/);
  assert.match(comingSoon, /Vehicle comparisons/);
  assert.match(comingSoon, /Moroccan customs help/);
  assert.match(comingSoon, /morocco-customs/);
  assert.match(widget, /publicEnabled/);
  assert.match(widget, /Coming Soon/);
});

test("homepage, tools, footer, and search advertise AI Garage as coming soon", () => {
  const home = source("src/app/[locale]/page.tsx");
  const tools = source("src/app/[locale]/tools/page.tsx");
  const search = source("src/lib/search.ts");
  const chrome = source("src/components/LocaleChrome.tsx");

  assert.match(home, /TT AUTO'S AI GARAGE/);
  assert.match(home, /YOUR CAR\. A NEW INTELLIGENCE\./);
  assert.match(home, /Discover What's Coming/);
  assert.match(home, /Mechanical diagnostics/);
  assert.match(tools, /AI Garage Coming Soon/);
  assert.match(tools, /Coming Soon/);
  assert.match(search, /upcoming AI Garage product/);
  assert.match(search, /coming soon/);
  assert.match(chrome, /AI Garage Coming Soon/);
});

test("Coming Soon copy covers all supported locales", () => {
  const comingSoon = source("src/components/ai-garage/AIGarageComingSoon.tsx");
  for (const locale of ["en:", "fr:", "nl:", "ar:"]) {
    assert.ok(comingSoon.includes(locale), `missing ${locale} copy`);
  }
});
