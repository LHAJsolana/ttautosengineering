import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const root = process.cwd();

function source(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

test("MCV API routes fail closed without top-level Playwright loading", () => {
  const calculateRoute = source("src/app/api/mcv/calculate/route.ts");
  const optionsRoute = source("src/app/api/mcv/options/route.ts");

  assert.ok(!calculateRoute.includes('import { calculateMcv } from "@/lib/mcv/client"'));
  assert.ok(!optionsRoute.includes('import { getMcvOptions } from "@/lib/mcv/client"'));
  assert.match(calculateRoute, /await import\("@\/lib\/mcv\/client"\)/);
  assert.match(optionsRoute, /await import\("@\/lib\/mcv\/client"\)/);
  assert.match(calculateRoute, /calculateMcvWithWorker/);
  assert.match(optionsRoute, /getMcvOptionsWithWorker/);
  assert.match(calculateRoute, /No customs amount was generated/);
  assert.match(optionsRoute, /Cache-Control/);
  assert.match(optionsRoute, /Retry-After/);
});

test("MCV worker is authenticated and containerized", () => {
  const worker = source("worker/mcv-worker.ts");
  const dockerfile = source("Dockerfile.mcv-worker");
  const workerClient = source("src/lib/mcv/workerClient.ts");

  assert.match(worker, /MCV_WORKER_TOKEN/);
  assert.match(worker, /timingSafeEqual/);
  assert.match(worker, /MAX_CONCURRENCY/);
  assert.match(worker, /\/healthz/);
  assert.match(worker, /\/readyz/);
  assert.match(worker, /calculateMcv\(input\)/);
  assert.match(dockerfile, /mcr\.microsoft\.com\/playwright:v1\.64\.0-noble/);
  assert.match(workerClient, /MCV_WORKER_URL/);
  assert.match(workerClient, /Authorization: `Bearer \$\{config\.token\}`/);
});

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
