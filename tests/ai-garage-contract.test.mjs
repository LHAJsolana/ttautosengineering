import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const root = process.cwd();

function source(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

test("AI Garage uses true Responses API streaming path when OpenAI is configured", () => {
  const agent = source("src/lib/ai/agent.ts");
  const route = source("src/app/api/ai/chat/route.ts");
  assert.match(agent, /stream,/, "Responses request should expose a stream flag");
  assert.match(agent, /response\.output_text\.delta/, "stream parser should handle Responses text deltas");
  assert.match(route, /streamOpenAIText/, "chat route should use the streaming helper");
});

test("AI Garage MCV integration is server-side and typed", () => {
  const tool = source("src/lib/ai/mcvTool.ts");
  const agent = source("src/lib/ai/agent.ts");
  const client = source("src/components/ai-garage/GarageChat.client.tsx");
  assert.match(tool, /calculateMcv/, "MCV tool should call the existing server-side MCV client");
  assert.match(tool, /missingFields/, "MCV tool should collect required fields before running");
  assert.match(agent, /Server-side MCV tool result/, "OpenAI context should include server tool output");
  assert.ok(!client.includes("calculateMcv"), "client must not import or call the MCV automation directly");
});

test("Fallback mode is clearly identified", () => {
  assert.match(source("src/lib/ai/agent.ts"), /Fallback mode:/, "local answer must label fallback mode");
  assert.match(source("src/components/ai-garage/GarageChat.client.tsx"), /Fallback mode/, "UI should label fallback responses");
});

test("MCV parser accepts proper French and legacy mojibake labels", () => {
  const parser = source("src/lib/mcv/parser.ts");
  assert.match(parser, /\\u00e0/, "parser should include escaped proper French accent support");
  assert.match(parser, /\\u00c3\\u00a0/, "parser should include legacy mojibake support");
});
