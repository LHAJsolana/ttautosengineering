import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const root = process.cwd();

function source(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

test("homepage promotes Morocco Customs with localized CTA labels", () => {
  const home = source("src/app/[locale]/page.tsx");
  assert.match(home, /Importing a car to Morocco\?/);
  assert.match(home, /Calculate Morocco Customs Fees/);
  assert.match(home, /Calculer mes frais de dedouanement/);
  assert.match(home, /Bereken je invoerkosten voor Marokko/);
  assert.match(home, /احسب رسوم جمركة سيارتك/);
  assert.match(home, /href="\/morocco-customs"/);
});

test("Morocco Customs calculator uses guided workflow and official-option UI", () => {
  const component = source("src/components/MoroccoCustomsCalculator.client.tsx");
  assert.match(component, /Select vehicle/);
  assert.match(component, /Confirm details/);
  assert.match(component, /Official result/);
  assert.match(component, /Load official MCV options/);
  assert.match(component, /datalist id="mcv-manufacturers"/);
  assert.match(component, /datalist id="mcv-models"/);
  assert.match(component, /datalist id="mcv-vehicle-types"/);
});

test("Morocco Customs UX preserves official-source safeguards and recovery actions", () => {
  const component = source("src/components/MoroccoCustomsCalculator.client.tsx");
  assert.match(component, /never stores or invents customs values/i);
  assert.match(component, /Retry/);
  assert.match(component, /Start another calculation/);
  assert.match(component, /Copy summary/);
  assert.match(component, /Print \/ save PDF/);
  assert.match(component, /No customs amount was generated/);
  assert.match(component, /DD\/MM\/YYYY/);
});

test("Morocco Customs calculator includes Arabic RTL-facing copy", () => {
  const component = source("src/components/MoroccoCustomsCalculator.client.tsx");
  assert.match(component, /اختيار السيارة/);
  assert.match(component, /تشغيل المحاكاة الرسمية/);
  assert.match(component, /تاريخ أول تسجيل/);
});
