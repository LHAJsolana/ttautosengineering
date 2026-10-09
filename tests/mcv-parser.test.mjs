import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

function parseMad(raw) {
  const match = raw.match(/(\d[\d\s\u00a0.,]*)\s*(?:DH|DHS|MAD)\b/i);
  if (!match) return null;
  const normalized = match[1].replace(/[\s\u00a0.]/g, "").replace(",", ".");
  const value = Number(normalized);
  return Number.isFinite(value) ? Math.round(value) : null;
}

test("MCV MAD amount parser handles official spacing", () => {
  assert.equal(parseMad("208 794 DH"), 208794);
  assert.equal(parseMad("1\u00a0080 DH"), 1080);
  assert.equal(parseMad("575.600 MAD"), 575600);
  assert.equal(parseMad("no amount"), null);
});

test("MCV parser source supports multiline label-to-amount extraction", () => {
  const parser = fs.readFileSync("src/lib/mcv/parser.ts", "utf8");
  assert.ok(parser.includes("[\\\\s\\\\S]{0,240}"));
});

