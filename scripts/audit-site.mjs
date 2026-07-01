import fs from "node:fs/promises";
import path from "node:path";

const baseUrl = process.env.AUDIT_BASE_URL ?? "http://127.0.0.1:3000";
const cdpEndpoint = process.env.AUDIT_CDP_URL ?? "http://127.0.0.1:9223/json";
const screenshotDirectory = process.env.AUDIT_SCREENSHOT_DIR;

async function getSocketUrl() {
  const targets = await fetch(cdpEndpoint).then((response) => response.json());
  const page = targets.find((target) => target.type === "page");
  if (!page?.webSocketDebuggerUrl) throw new Error("No Chrome page target is available");
  return page.webSocketDebuggerUrl;
}

async function connectCdp() {
  const socket = new WebSocket(await getSocketUrl());
  const pending = new Map();
  let id = 0;
  await new Promise((resolve, reject) => {
    socket.addEventListener("open", resolve, { once: true });
    socket.addEventListener("error", reject, { once: true });
  });
  socket.addEventListener("message", (event) => {
    const message = JSON.parse(event.data);
    if (!message.id || !pending.has(message.id)) return;
    const { resolve, reject } = pending.get(message.id);
    pending.delete(message.id);
    if (message.error) reject(new Error(message.error.message));
    else resolve(message.result);
  });

  function call(method, params = {}) {
    const requestId = ++id;
    socket.send(JSON.stringify({ id: requestId, method, params }));
    return new Promise((resolve, reject) => pending.set(requestId, { resolve, reject }));
  }

  return { socket, call };
}

async function renderedAudit() {
  const { socket, call } = await connectCdp();
  await call("Page.enable");
  await call("Runtime.enable");

  const pages = [
    "/en",
    "/ar",
    "/en/fault-codes/p2563",
    "/en/compare/bmw-x5-vs-audi-q7",
    "/en/blog/dsg-vs-torque-converter-used-buying",
    "/en/models/mercedes-gla",
  ];
  const viewports = [
    { label: "mobile", width: 390, height: 844, mobile: true },
    { label: "desktop", width: 1440, height: 1000, mobile: false },
  ];
  const results = [];

  async function waitForPage() {
    for (let attempt = 0; attempt < 60; attempt += 1) {
      const state = await call("Runtime.evaluate", {
        returnByValue: true,
        expression: "({ ready: document.readyState, hasHeading: Boolean(document.querySelector('h1')) })",
      });
      if (state.result.value.ready === "complete" && state.result.value.hasHeading) return;
      await new Promise((resolve) => setTimeout(resolve, 250));
    }
    throw new Error("Timed out waiting for the rendered page");
  }

  for (const viewport of viewports) {
    await call("Emulation.setDeviceMetricsOverride", {
      width: viewport.width,
      height: viewport.height,
      deviceScaleFactor: 1,
      mobile: viewport.mobile,
    });

    for (const pathname of pages) {
      await call("Page.navigate", { url: `${baseUrl}${pathname}` });
      await waitForPage();
      const evaluation = await call("Runtime.evaluate", {
        returnByValue: true,
        expression: `(() => {
          const root = document.documentElement;
          const overflowing = [...document.querySelectorAll('body *')]
            .map((element) => ({
              tag: element.tagName.toLowerCase(),
              className: typeof element.className === 'string' ? element.className.slice(0, 160) : '',
              left: Math.round(element.getBoundingClientRect().left),
              right: Math.round(element.getBoundingClientRect().right),
              width: Math.round(element.getBoundingClientRect().width),
            }))
            .filter((item) => item.right > root.clientWidth + 2 || item.left < -2)
            .slice(0, 8);
          return {
            title: document.title,
            lang: root.lang,
            dir: root.dir,
            clientWidth: root.clientWidth,
            scrollWidth: root.scrollWidth,
            h1: document.querySelector('h1')?.textContent?.trim() ?? '',
            canonical: document.querySelector('link[rel="canonical"]')?.href ?? '',
            description: document.querySelector('meta[name="description"]')?.content ?? '',
            ogImage: document.querySelector('meta[property="og:image"]')?.content ?? '',
            overflowing,
          };
        })()`,
      });
      let screenshot;
      if (
        screenshotDirectory &&
        ((viewport.label === "mobile" && ["/en", "/ar"].includes(pathname)) ||
          (viewport.label === "desktop" && pathname === "/en"))
      ) {
        await fs.mkdir(screenshotDirectory, { recursive: true });
        const filename = `${viewport.label}-${pathname.slice(1)}.png`;
        const capture = await call("Page.captureScreenshot", { format: "png", fromSurface: true });
        screenshot = path.resolve(screenshotDirectory, filename);
        await fs.writeFile(screenshot, Buffer.from(capture.data, "base64"));
      }
      results.push({ viewport: viewport.label, pathname, screenshot, ...evaluation.result.value });
    }
  }

  socket.close();
  return results;
}

async function sitemapAudit() {
  const xml = await fetch(`${baseUrl}/sitemap.xml`).then(async (response) => {
    if (!response.ok) throw new Error(`Sitemap returned ${response.status}`);
    return response.text();
  });
  const productionUrls = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);
  const localUrls = productionUrls.map((url) => {
    const pathname = new URL(url).pathname;
    return `${baseUrl}${pathname}`;
  });
  const failures = [];
  let cursor = 0;

  async function worker() {
    while (cursor < localUrls.length) {
      const url = localUrls[cursor++];
      try {
        const response = await fetch(url, { redirect: "manual" });
        if (response.status >= 400) failures.push({ url, status: response.status });
      } catch (error) {
        failures.push({ url, error: error instanceof Error ? error.message : String(error) });
      }
    }
  }

  await Promise.all(Array.from({ length: 10 }, worker));
  return { checked: localUrls.length, failures };
}

const [rendered, sitemap] = await Promise.all([renderedAudit(), sitemapAudit()]);
console.log(JSON.stringify({ rendered, sitemap }, null, 2));
if (sitemap.failures.length || rendered.some((page) => page.scrollWidth > page.clientWidth + 2)) {
  process.exitCode = 1;
}
