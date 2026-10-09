import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const root = process.cwd();

function source(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

test("AI Garage keeps OpenAI secrets out of client components", () => {
  const clientFiles = [
    "src/components/ai-garage/GarageChat.client.tsx",
    "src/components/ai-garage/GarageFloatingWidget.client.tsx",
  ];

  for (const file of clientFiles) {
    assert.ok(!source(file).includes("OPENAI_API_KEY"), `${file} must not reference OPENAI_API_KEY`);
  }
});

test("AI Garage route is discoverable", () => {
  assert.ok(source("src/lib/search.ts").includes("/ai-garage"), "search index should include AI Garage");
  assert.ok(source("src/app/sitemap.ts").includes("/ai-garage"), "sitemap should include AI Garage");
  assert.ok(source("tests/content-data.test.mjs").includes("/ai-garage"), "route validation should include AI Garage");
});
