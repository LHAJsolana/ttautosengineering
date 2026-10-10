import type { Browser, Page } from "playwright";
import { extractResultFromText } from "@/lib/mcv/parser";
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
} from "@/lib/mcv/types";

const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36";
const JOB_TIMEOUT_MS = 70_000;
const MAX_ATTEMPTS = Math.max(1, Math.min(3, Number(process.env.MCV_MAX_ATTEMPTS || 2)));
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

          record(context, "running-simulation", "Submitting official MCV simulation");
          await page.locator("#mat-input-0").fill(input.firstRegistrationDate);
          await page.locator(`input[value="${input.beneficiaryType}"]`).check({ force: true });
          await page.getByRole("button", { name: /Valider/i }).click();
          await page.getByText("Montant total des droits et des taxes").waitFor({ timeout: 25_000 });
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

