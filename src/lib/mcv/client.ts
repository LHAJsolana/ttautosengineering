import fs from "node:fs/promises";
import path from "node:path";
import type { Browser, Page } from "playwright";
import { extractResultFromText } from "./parser";
import {
  MCV_OFFICIAL_URL,
  MCV_SOURCE_URL,
  type McvApiResult,
  type McvCalculationRequest,
  type McvDiagnosticEvent,
  type McvFailureResult,
  type McvOption,
  type McvOptionsRequest,
  type McvOptionsResult,
  type McvProgressStep,
} from "./types";

const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36";
const JOB_TIMEOUT_MS = Math.max(60_000, Math.min(110_000, Number(process.env.MCV_JOB_TIMEOUT_MS || 95_000)));
const RESULT_TIMEOUT_MS = Math.max(20_000, Math.min(60_000, Number(process.env.MCV_RESULT_TIMEOUT_MS || 45_000)));
const MAX_ATTEMPTS = Math.max(1, Math.min(3, Number(process.env.MCV_MAX_ATTEMPTS || 2)));
const DEBUG_FLOW = process.env.MCV_DEBUG_FLOW === "1";
const DEBUG_DIR = process.env.MCV_DEBUG_DIR || path.join(process.cwd(), ".mcv-debug");
let activeJobs = 0;
let chromiumLoader: Promise<typeof import("playwright")["chromium"]> | null = null;

function normalize(input: string) {
  return input
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[-_/]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toUpperCase();
}

function containsLoose(haystack: string, needle: string) {
  const h = normalize(haystack);
  const n = normalize(needle);
  return h === n || h.includes(n) || n.includes(h);
}

function fail(
  code: McvFailureResult["code"],
  message: string,
  options?: McvOption[],
  progress?: McvProgressStep,
  diagnostics?: McvDiagnosticEvent[]
): McvFailureResult {
  return { status: "error", code, message, options, progress, diagnostics };
}

function validateRequest(input: McvCalculationRequest): McvFailureResult | null {
  if (!input.manufacturer.trim() || !input.model.trim()) {
    return fail("VALIDATION_ERROR", "Manufacturer and model are required.");
  }
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(input.firstRegistrationDate)) {
    return fail("VALIDATION_ERROR", "First registration date must use DD/MM/YYYY.");
  }
  if (!["AUTRE", "MRE", "MRED", "PBS"].includes(input.beneficiaryType)) {
    return fail("VALIDATION_ERROR", "Unsupported beneficiary type.");
  }
  return null;
}

type McvRunContext = {
  attempt: number;
  startedAt: number;
  diagnostics: McvDiagnosticEvent[];
};

function record(context: McvRunContext, step: McvProgressStep, message: string) {
  context.diagnostics.push({
    attempt: context.attempt,
    step,
    message,
    elapsedMs: Date.now() - context.startedAt,
  });
}

function sanitizeDebugText(input: string, max = 700) {
  return input
    .replace(/Bearer\s+[A-Za-z0-9._~+/=-]+/gi, "Bearer [redacted]")
    .replace(/([?&](?:token|session|sid|jsessionid|auth|key)=)[^&\s]+/gi, "$1[redacted]")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);
}

function officialUrl(input: string) {
  try {
    const url = new URL(input);
    return url.hostname.endsWith("douane.gov.ma");
  } catch {
    return false;
  }
}

async function writeDebugArtifact(context: McvRunContext, name: string, extension: "html" | "png" | "txt", data: string | Buffer) {
  if (!DEBUG_FLOW) return;
  await fs.mkdir(DEBUG_DIR, { recursive: true }).catch(() => undefined);
  const file = `attempt-${context.attempt}-${String(Date.now() - context.startedAt).padStart(6, "0")}-${name}.${extension}`;
  const target = path.join(DEBUG_DIR, file);
  await fs.writeFile(target, data).catch(() => undefined);
  record(context, "running-simulation", `Debug artifact written: ${path.relative(process.cwd(), target)}`);
}

async function debugTimeout<T>(work: Promise<T>, timeoutMs: number, fallback: T): Promise<T> {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  try {
    return await Promise.race([
      work,
      new Promise<T>((resolve) => {
        timeout = setTimeout(() => resolve(fallback), timeoutMs);
      }),
    ]);
  } finally {
    if (timeout) clearTimeout(timeout);
  }
}

async function captureDebugPageState(page: Page, context: McvRunContext, label: string) {
  if (!DEBUG_FLOW) return;
  record(context, "running-simulation", `Debug capture starting: ${label}`);
  const url = sanitizeDebugText(page.url(), 500);
  const visibleText = await debugTimeout(
    page.locator("body").innerText({ timeout: 4_000 }).catch((error) => `body text unavailable: ${diagnosticMessage(error)}`),
    5_000,
    "body text timed out"
  );
  const html = await debugTimeout(
    page.locator("body").evaluate((body) => {
      const interestingText = [
        "Montant total des droits et des taxes",
        "Valeur taxable",
        "Droits d'importation",
        "INFORMATIONS SUR LE VÉHICULE",
        "INFORMATIONS SUR LE BENEFICIAIRE",
        "INFORMATIONS SUR LE BÉNÉFICIAIRE",
      ];
      const allElements = [...body.querySelectorAll("section, article, main, form, table, mat-card, .row, .container, div")];
      const resultElement = allElements.find((element) => {
        const text = element.textContent?.replace(/\s+/g, " ").trim() || "";
        return interestingText.some((needle) => text.includes(needle));
      });
      if (resultElement) return resultElement.outerHTML.slice(0, 20_000);

      const selectors = [
        ".mat-mdc-dialog-container",
        "mat-dialog-container",
        ".error",
        ".mat-mdc-form-field-error",
        ".mat-error",
        ".mat-mdc-card",
        "form",
        "body",
      ];
      for (const selector of selectors) {
        const element = body.querySelector(selector);
        if (element?.textContent?.trim()) return element.outerHTML.slice(0, 20_000);
      }
      return body.outerHTML.slice(0, 20_000);
    }).catch((error) => `html unavailable: ${diagnosticMessage(error)}`),
    5_000,
    "html capture timed out"
  );
  const formState = await debugTimeout(
    page.evaluate(() => {
      const inputs = [...document.querySelectorAll("input")].map((input) => ({
        id: input.id,
        name: input.getAttribute("name"),
        type: input.type,
        value: input.type === "radio" || input.type === "checkbox" ? String(input.checked) : input.value,
        disabled: input.disabled,
        ariaInvalid: input.getAttribute("aria-invalid"),
      }));
      const buttons = [...document.querySelectorAll("button")].map((button) => ({
        text: button.textContent?.replace(/\s+/g, " ").trim().slice(0, 80),
        disabled: button.disabled,
        type: button.type,
      }));
      return { inputs, buttons };
    }).catch((error) => ({ error: diagnosticMessage(error) })),
    5_000,
    { error: "form capture timed out" }
  );

  record(context, "running-simulation", `Debug ${label}: url=${url}; visible="${sanitizeDebugText(visibleText)}"`);
  record(context, "running-simulation", `Debug ${label}: form=${sanitizeDebugText(JSON.stringify(formState), 900)}`);
  await writeDebugArtifact(context, label, "html", sanitizeDebugText(html, 20_000));
  const screenshot = await debugTimeout(page.screenshot({ fullPage: false }).catch(() => null), 6_000, null);
  if (screenshot) await writeDebugArtifact(context, label, "png", screenshot);
  record(context, "running-simulation", `Debug capture finished: ${label}`);
}

async function waitForMcvCompletion(page: Page, context: McvRunContext, submitUrl: string) {
  const resultText = page.getByText("Montant total des droits et des taxes");
  const knownValidation = page.getByText(/(obligatoire|erreur|invalide|required|veuillez|aucun|indisponible)/i);
  const dialog = page.locator("mat-dialog-container, .mat-mdc-dialog-container").first();

  const outcome = await Promise.race([
    resultText.waitFor({ timeout: RESULT_TIMEOUT_MS }).then(() => "result"),
    knownValidation.waitFor({ timeout: RESULT_TIMEOUT_MS }).then(() => "validation"),
    dialog.waitFor({ state: "visible", timeout: RESULT_TIMEOUT_MS }).then(() => "dialog"),
    page.waitForURL((url) => url.href !== submitUrl, { timeout: RESULT_TIMEOUT_MS }).then(() => "url-change"),
  ]).catch(() => "timeout");

  record(context, "running-simulation", `Post-submit completion signal: ${outcome}; url=${sanitizeDebugText(page.url(), 500)}`);
  return outcome;
}

function attachDebugListeners(page: Page, context: McvRunContext) {
  if (!DEBUG_FLOW) return;
  const networkEvents: string[] = [];
  const pushNetwork = (message: string) => {
    networkEvents.push(message);
    if (networkEvents.length > 40) networkEvents.shift();
  };

  page.on("console", (message) => {
    const type = message.type();
    if (["error", "warning"].includes(type)) {
      record(context, "running-simulation", `Console ${type}: ${sanitizeDebugText(message.text(), 500)}`);
    }
  });
  page.on("pageerror", (error) => {
    record(context, "running-simulation", `Page error: ${sanitizeDebugText(error.message, 500)}`);
  });
  page.on("dialog", async (dialog) => {
    record(context, "running-simulation", `Dialog ${dialog.type()}: ${sanitizeDebugText(dialog.message(), 500)}`);
    await dialog.dismiss().catch(() => undefined);
  });
  page.on("popup", (popup) => {
    record(context, "running-simulation", `Popup opened: ${sanitizeDebugText(popup.url(), 500)}`);
  });
  page.on("framenavigated", (frame) => {
    if (frame === page.mainFrame()) record(context, "running-simulation", `Navigation: ${sanitizeDebugText(frame.url(), 500)}`);
  });
  page.on("requestfailed", (request) => {
    const url = request.url();
    if (officialUrl(url)) pushNetwork(`FAILED ${request.method()} ${sanitizeDebugText(url, 500)} ${request.failure()?.errorText || ""}`);
  });
  page.on("response", (response) => {
    const url = response.url();
    if (officialUrl(url)) pushNetwork(`${response.status()} ${response.request().method()} ${sanitizeDebugText(url, 500)}`);
  });
  page.once("close", () => {
    if (networkEvents.length) {
      record(context, "running-simulation", `Recent official network: ${sanitizeDebugText(networkEvents.join(" | "), 1800)}`);
    }
  });
}

async function getChromium() {
  if (process.env.VERCEL && !process.env.PLAYWRIGHT_BROWSERS_PATH) {
    process.env.PLAYWRIGHT_BROWSERS_PATH = "0";
  }
  chromiumLoader ??= import("playwright").then((mod) => mod.chromium);
  return chromiumLoader;
}

function diagnosticMessage(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  return message
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(0, 3)
    .join(" | ")
    .slice(0, 600);
}

async function withBrowser<T>(context: McvRunContext, work: (page: Page) => Promise<T>): Promise<T> {
  let browser: Browser | null = null;
  let timeout: ReturnType<typeof setTimeout> | null = null;
  try {
    const chromium = await getChromium();
    record(context, "connecting", "Launching browser");
    const executablePath = chromium.executablePath();
    record(context, "connecting", `Chromium executable path: ${executablePath}`);
    try {
      browser = await chromium.launch({
        headless: true,
        executablePath,
        args: [
          "--no-sandbox",
          "--disable-setuid-sandbox",
          "--disable-dev-shm-usage",
        ],
      });
    } catch (error) {
      record(context, "connecting", `Browser launch failed: ${diagnosticMessage(error)}`);
      throw error;
    }
    const page = await browser.newPage({
      viewport: { width: 1365, height: 1000 },
      userAgent: USER_AGENT,
      locale: "fr-FR",
    });
    attachDebugListeners(page, context);
    page.setDefaultTimeout(20_000);
    return await Promise.race([
      work(page),
      new Promise<never>((_, reject) => {
        timeout = setTimeout(() => {
          record(context, "running-simulation", "Closing browser after MCV timeout");
          void browser?.close().catch(() => undefined);
          reject(new Error("MCV_TIMEOUT"));
        }, JOB_TIMEOUT_MS);
      }),
    ]);
  } finally {
    if (timeout) clearTimeout(timeout);
    await browser?.close().catch(() => undefined);
  }
}

async function openCalculator(page: Page, context: McvRunContext) {
  record(context, "connecting", "Opening official MCV page");
  await page.goto(MCV_OFFICIAL_URL, {
    waitUntil: "domcontentloaded",
    timeout: 45_000,
  });
  const calculateLink = page.getByText("CALCUL DES DROITS ET TAXES", { exact: true });
  await calculateLink.waitFor({ state: "visible", timeout: 30_000 });
  await calculateLink.click();
  record(context, "loading-selection", "Waiting for vehicle selection controls");
  await page.waitForSelector("#type2", { state: "attached" });
}

async function chooseAutomobile(page: Page, context: McvRunContext) {
  record(context, "loading-selection", "Selecting automobile category");
  await page.locator("#type2").check({ force: true });
  await page.waitForSelector("mat-select", { state: "attached" });
  await page.locator("mat-select").nth(1).waitFor({ state: "visible", timeout: 20_000 });
}

async function readOptions(page: Page) {
  return page.locator("mat-option").allInnerTexts();
}

async function openSelect(page: Page, index: number) {
  const select = page.locator("mat-select").nth(index);
  await select.waitFor({ state: "visible", timeout: 20_000 });
  await select.click();
  await page.waitForSelector("mat-option", { state: "attached" });
}

async function selectOption(page: Page, label: string) {
  await page.getByText(label, { exact: true }).click();
  await page.waitForLoadState("networkidle", { timeout: 8_000 }).catch(() => undefined);
  await page.waitForTimeout(700);
}

async function fillDateInput(page: Page, date: string) {
  const input = page.locator("#mat-input-0");
  await input.waitFor({ state: "visible", timeout: 20_000 });
  await input.scrollIntoViewIfNeeded();
  await input.evaluate((element, value) => {
    const inputElement = element as HTMLInputElement;
    const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value")?.set;
    setter?.call(inputElement, value);
    inputElement.dispatchEvent(new Event("input", { bubbles: true }));
    inputElement.dispatchEvent(new Event("change", { bubbles: true }));
    inputElement.dispatchEvent(new Event("blur", { bubbles: true }));
  }, date);
  await page.waitForTimeout(300);
  const actual = await input.inputValue().catch(() => "");
  if (actual.trim() !== date) {
    throw new Error(`MCV_DATE_NOT_SET:${actual}`);
  }
}

async function selectBeneficiary(page: Page, beneficiaryType: McvCalculationRequest["beneficiaryType"]) {
  const labels: Record<McvCalculationRequest["beneficiaryType"], RegExp> = {
    MRE: /MRE.*60 ans/i,
    MRED: /MRE.*retournant/i,
    PBS: /PBS.*besoins/i,
    AUTRE: /Autre.*D[ée]douanement/i,
  };
  const byValue = page.locator(`input[value="${beneficiaryType}"]`);
  if ((await byValue.count().catch(() => 0)) > 0) {
    await byValue.first().check({ force: true });
    return;
  }
  await page.getByText(labels[beneficiaryType]).click();
  await page.waitForTimeout(300);
}

async function getVisibleOptions(page: Page, selectIndex: number) {
  await openSelect(page, selectIndex);
  const labels = await readOptions(page);
  await page.keyboard.press("Escape").catch(() => undefined);
  return labels.map((label) => ({ label: label.trim() })).filter((item) => item.label);
}

async function matchOne(
  page: Page,
  selectIndex: number,
  query: string,
  notFoundCode: McvFailureResult["code"],
  ambiguousCode: McvFailureResult["code"],
  progress: McvProgressStep
): Promise<string | McvFailureResult> {
  await openSelect(page, selectIndex);
  const labels = (await readOptions(page)).map((label) => label.trim()).filter(Boolean);
  const exact = labels.find((label) => normalize(label) === normalize(query));
  const loose = exact ? [exact] : labels.filter((label) => containsLoose(label, query));
  const unique = [...new Set(loose)];

  if (!unique.length) {
    await page.keyboard.press("Escape").catch(() => undefined);
    return fail(notFoundCode, `No official MCV option matched "${query}".`, undefined, progress);
  }
  if (unique.length > 1) {
    await page.keyboard.press("Escape").catch(() => undefined);
    return fail(
      ambiguousCode,
      `Multiple official MCV options match "${query}". Please choose the exact official option.`,
      unique.slice(0, 30).map((label) => ({ label })),
      progress
    );
  }

  await selectOption(page, unique[0]);
  return unique[0];
}

export async function getMcvOptions(input: McvOptionsRequest): Promise<McvOptionsResult> {
  const context: McvRunContext = { attempt: 1, startedAt: Date.now(), diagnostics: [] };
  return withBrowser(context, async (page) => {
    await openCalculator(page, context);
    await chooseAutomobile(page, context);
    const manufacturers = await getVisibleOptions(page, 1);
    let models: McvOption[] = [];
    let vehicleTypes: McvOption[] = [];

    if (input.manufacturer) {
      const manufacturer = await matchOne(
        page,
        1,
        input.manufacturer,
        "VEHICLE_NOT_FOUND",
        "AMBIGUOUS_MODEL",
        "matching-configuration"
      );
      if (typeof manufacturer === "string") {
        const allModels = await getVisibleOptions(page, 2);
        models = input.modelQuery
          ? allModels.filter((item) => containsLoose(item.label, input.modelQuery ?? ""))
          : allModels.slice(0, 80);
        if (models.length === 1) {
          await openSelect(page, 2);
          await selectOption(page, models[0].label);
          vehicleTypes = await getVisibleOptions(page, 3);
        }
      }
    }

    return { manufacturers, models: models.slice(0, 80), vehicleTypes };
  });
}

export async function calculateMcv(input: McvCalculationRequest): Promise<McvApiResult> {
  const validation = validateRequest(input);
  if (validation) return validation;
  if (activeJobs >= 1) {
    return fail(
      "CONCURRENCY_LIMIT",
      "Another live MCV calculation is already running. Please try again shortly.",
      undefined,
      "connecting"
    );
  }

  activeJobs += 1;
  try {
    const diagnostics: McvDiagnosticEvent[] = [];
    let lastRetryable: McvFailureResult | null = null;

    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
      const context: McvRunContext = { attempt, startedAt: Date.now(), diagnostics };
      try {
        const result = await withBrowser(context, async (page) => {
          await openCalculator(page, context);
          await chooseAutomobile(page, context);

          const manufacturer = await matchOne(
            page,
            1,
            input.manufacturer,
            "VEHICLE_NOT_FOUND",
            "AMBIGUOUS_MODEL",
            "matching-configuration"
          );
          if (typeof manufacturer !== "string") return { ...manufacturer, diagnostics };

          const model = await matchOne(
            page,
            2,
            input.model,
            "VEHICLE_NOT_FOUND",
            "AMBIGUOUS_MODEL",
            "matching-configuration"
          );
          if (typeof model !== "string") return { ...model, diagnostics };

          const typeOptions = await getVisibleOptions(page, 3);
          let selectedVehicleType = "";
          if (!input.vehicleType?.trim()) {
            if (typeOptions.length !== 1) {
              return fail(
                "AMBIGUOUS_TYPE",
                "The official MCV simulator requires an exact vehicle type for this model.",
                typeOptions.slice(0, 30),
                "matching-configuration",
                diagnostics
              );
            }
            await openSelect(page, 3);
            await selectOption(page, typeOptions[0].label);
            selectedVehicleType = typeOptions[0].label;
          } else {
            const vehicleType = await matchOne(
              page,
              3,
              input.vehicleType,
              "VEHICLE_NOT_FOUND",
              "AMBIGUOUS_TYPE",
              "matching-configuration"
            );
            if (typeof vehicleType !== "string") return { ...vehicleType, diagnostics };
            selectedVehicleType = vehicleType;
          }

          record(context, "running-simulation", "Preparing official MCV simulation form");
          await captureDebugPageState(page, context, "before-form-fill");
          record(context, "running-simulation", "Filling first registration date");
          await fillDateInput(page, input.firstRegistrationDate);
          record(context, "running-simulation", "First registration date filled");
          record(context, "running-simulation", `Selecting beneficiary type ${input.beneficiaryType}`);
          await selectBeneficiary(page, input.beneficiaryType);
          record(context, "running-simulation", "Beneficiary type selected");
          await captureDebugPageState(page, context, "before-submit");
          const submitStartedAt = Date.now();
          const submitUrl = page.url();
          record(context, "running-simulation", `Clicking Valider at ${new Date(submitStartedAt).toISOString()}; url=${sanitizeDebugText(submitUrl, 500)}`);
          await page.getByRole("button", { name: /Valider/i }).click();
          record(context, "running-simulation", `Clicked Valider in ${Date.now() - submitStartedAt}ms; url=${sanitizeDebugText(page.url(), 500)}`);
          await page.waitForTimeout(1_500);
          await captureDebugPageState(page, context, "after-submit");
          try {
            const outcome = await waitForMcvCompletion(page, context, submitUrl);
            if (outcome !== "result") {
              await captureDebugPageState(page, context, `completion-${outcome}`);
              throw new Error(`MCV_COMPLETION_${outcome.toUpperCase()}`);
            }
          } catch (error) {
            const bodyText = await page.locator("body").innerText({ timeout: 5_000 }).catch(() => "");
            const snippet = bodyText.replace(/\s+/g, " ").trim().slice(0, 300);
            record(
              context,
              "running-simulation",
              `Result text did not appear within ${RESULT_TIMEOUT_MS}ms${snippet ? `; page text: ${snippet}` : ""}`
            );
            await captureDebugPageState(page, context, "timeout");
            throw error;
          }
          record(context, "extracting-results", "Extracting official result text");
          const text = await page.locator("body").innerText();
          const extracted = extractResultFromText(text, {
            manufacturer,
            model,
            vehicleType: selectedVehicleType,
            firstRegistrationDate: input.firstRegistrationDate,
            beneficiaryType: input.beneficiaryType,
          });
          record(context, "validating-amounts", "Validated official MCV amount");
          return { ...extracted, diagnostics };
        });

        if (result.status === "success") return result;
        if (!["TIMEOUT", "SIMULATION_FAILED", "MCV_UNAVAILABLE"].includes(result.code)) return result;
        lastRetryable = result;
      } catch (error) {
        const message = diagnosticMessage(error);
        const code = /MCV_TIMEOUT|Timeout/i.test(message) ? "TIMEOUT" : "SIMULATION_FAILED";
        lastRetryable = fail(
          code,
          "The official MCV simulation could not be completed. No customs amount was generated.",
          undefined,
          code === "TIMEOUT" ? "running-simulation" : "connecting",
          diagnostics
        );
      }

      if (attempt < MAX_ATTEMPTS) {
        await new Promise((resolve) => setTimeout(resolve, 1_200 * attempt));
      }
    }

    return (
      lastRetryable ??
      fail("SIMULATION_FAILED", "The official MCV simulation could not be completed.", undefined, "running-simulation", diagnostics)
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return fail(
      /Timeout/i.test(message) ? "TIMEOUT" : "SIMULATION_FAILED",
      "The official MCV simulation could not be completed. No customs amount was generated.",
      undefined,
      "running-simulation"
    );
  } finally {
    activeJobs -= 1;
  }
}

export { MCV_SOURCE_URL };

