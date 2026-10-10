# TT AUTO'S Engineering Production Readiness

Audit date: 2026-10-10

Status: NO-GO for production promotion. GO only for a protected preview deployment after explicit authorization and confirmed Vercel project access.

## Protected Preview Recovery Update

### Deployment Identity

Confirmed:

- Local development repository: `https://github.com/LHAJsolana/ttautosengineering.git`.
- Local development branch: `master`.
- Local development HEAD during recovery: `b3c50d5eb3ba15cae0aa7818e7e53f98f4aac200`.
- Production-connected repository: `https://github.com/LHAJsolana/ttautos.engineering.git`.
- Production-connected branch: `main`.
- Production branch commit used as the protected-preview base: `e638acbc8c5f5fd0c0dc054c1e077f6b4b1d46f8`.
- Isolated local preview branch prepared from production `main`: `codex/mcv-preview-recovery`.

Access checks:

- GitHub read access to both repositories is available.
- Dry-run push checks to both repositories succeeded; no branch was created and no code was pushed.
- No Git remote was changed.
- No production branch configuration was changed.
- Local recovery commit prepared: `52cf6fc Harden MCV API for preview recovery`.
- Current recovery branch: `codex/mcv-preview-recovery`.

Vercel access blocker:

- Current Vercel CLI account: `rafaitaha614-1881`.
- Visible CLI team: `tt-18c2`.
- Production project appears in the browser under `lhajtt/ttautos.engineering`.
- `vercel project ls --scope lhajtt` fails because this CLI session cannot see that scope.
- `vercel logs` and `vercel inspect` cannot access the production deployment from the current CLI context.
- A supported Vercel device-login flow was started from the CLI, but the authorization was not completed in the browser during this run. The waiting CLI process was stopped so no auth session was left hanging.

Minimum permission needed:

- Sign the Vercel CLI into the account/team that owns `lhajtt/ttautos.engineering`, or add the current CLI user to that project/team with deployment and function-log access.

### Confirmed Production Failure

Observed against `https://www.ttautosengineering.com`:

- `GET /api/mcv/options` returns a generic Vercel/Next 500 HTML page.
- `POST /api/mcv/calculate` with invalid input returns a generic Vercel/Next 500 HTML page.
- `POST /api/mcv/calculate` with the Mercedes C220d test request also returns HTTP 500.
- The response is not the application's structured JSON error payload.

Confirmed source risk in deployed commit `e638acb`:

- `src/app/api/mcv/calculate/route.ts` top-level imports `@/lib/mcv/client`.
- `src/app/api/mcv/options/route.ts` top-level imports `@/lib/mcv/client`.
- `src/lib/mcv/client.ts` top-level imports Playwright Chromium.

Conclusion:

- Production logs confirm route/module initialization failure before request validation.
- Confirmed error from Vercel runtime logs:
  - `Failed to load external module playwright-9b51c99ca474dcf1`
  - `Cannot find module '/var/task/node_modules/playwright-core/browsers.json'`
  - Require stack includes `/var/task/node_modules/playwright-core/lib/coreBundle.js`
- The root cause is missing Playwright metadata in the Vercel serverless function bundle due to file tracing not including `node_modules/playwright-core/browsers.json`.
- First protected preview fixed the generic HTTP 500 and proved the next failure stage:
  - Playwright loaded successfully.
  - Chromium executable was missing from the runtime cache.
  - Error: executable did not exist under `/home/sbx_user.../.cache/ms-playwright/.../chrome-headless-shell`.
- Second protected preview installed Chromium hermetically during Vercel build and traced `.local-browsers`.
  - Build downloaded Chromium and headless shell into `/vercel/path0/node_modules/playwright-core/.local-browsers`.
  - Runtime found the browser in `/var/task/node_modules/playwright-core/.local-browsers`.
  - Chromium still launched and immediately closed in Vercel, returning structured `SIMULATION_FAILED` instead of generic 500.
  - The exact browser stderr beyond the launch line remains limited by the sanitized diagnostic response; next step is to verify whether Vercel's function runtime lacks required Chromium shared libraries or needs a serverless Chromium build.
- Final Vercel-only attempts added serverless launch flags and then forced Playwright to use the full Chromium executable path instead of the headless-shell path.
  - Both attempts still failed at browser launch with `Target page, context or browser has been closed`.
  - Therefore the current full Playwright Chromium bundle is not reliable in this Vercel Function runtime.

Open hypotheses after this fix:

- Missing Linux shared libraries for the full Playwright Chromium/headless-shell build.
- Vercel serverless runtime incompatibility with bundled Playwright browser despite hermetic install.
- Need for a serverless Chromium package or a dedicated Playwright worker.

### Local Protected-Preview Patch

Files changed on `codex/mcv-preview-recovery`:

- `.github/workflows/ci.yml`
- `src/app/api/mcv/calculate/route.ts`
- `src/app/api/mcv/options/route.ts`
- `tests/mcv-ux-static.test.mjs`
- `docs/PRODUCTION_READINESS.md`

Implemented:

- MCV API routes no longer top-level import the Playwright-backed client.
- Calculation route validates basic bad input before importing Playwright code.
- Calculation route returns structured `503 MCV_UNAVAILABLE` if the automation runtime cannot load.
- Option route returns structured `503` if official options cannot be loaded.
- Option route now has bounded process-local throttling and structured `429`.
- MCV API responses use `Cache-Control: no-store`.
- `next.config.ts` explicitly includes `./node_modules/playwright-core/browsers.json` in the traced server bundle for `/api/mcv/calculate` and `/api/mcv/options`.
- `next.config.ts` also traces `./node_modules/playwright-core/.local-browsers/**/*`.
- Vercel builds run `scripts/ensure-playwright-browsers.mjs`, which installs Chromium with `PLAYWRIGHT_BROWSERS_PATH=0` only when `VERCEL` is set.
- MCV client sets `PLAYWRIGHT_BROWSERS_PATH=0` before dynamically importing Playwright in Vercel.
- MCV browser launch includes serverless-safe Chromium flags: `--no-sandbox`, `--disable-setuid-sandbox`, and `--disable-dev-shm-usage`.
- MCV diagnostics now include sanitized executable-path and launch-failure messages.
- CI now runs on both `master` and `main`.
- Static regression test prevents reintroducing top-level MCV client imports in API routes.

Not implemented:

- No shared Redis/KV production rate limit.
- No global distributed browser concurrency lock.
- No dedicated Playwright worker.
- No production deploy.
- No production deploy.

### Verification Plan

Before preview deployment:

1. `npm run lint`: PASS on the isolated production-based branch after the tracing fix.
2. `npm run test`: PASS, including 17 application tests after the tracing fix.
3. `npm run build`: PASS after the tracing fix.
4. Local invalid MCV request: PASS, structured HTTP `400 VALIDATION_ERROR`.
5. Local public AI request: PASS, HTTP `403 coming_soon`.
6. Local `/en/ai-garage`: PASS, Coming Soon page renders.
7. Confirm `AI_GARAGE_PUBLIC_ENABLED=false` in the target Vercel preview environment before any preview test.
8. Confirm no secrets are exposed in client code.

Protected preview deployment procedure, after explicit user approval:

1. Use the correct Vercel account/team for `lhajtt/ttautos.engineering`.
2. Push the isolated branch to the production-connected GitHub repository as a non-production branch.
3. Let Vercel create a protected preview deployment under the actual production project.
4. Do not promote the preview to production.
5. Inspect logs for `/api/mcv/options` and `/api/mcv/calculate`.

Preview tests:

- Invalid MCV calculation request returns structured `400`.
- Browser-runtime failure returns structured `503`, not generic HTML 500.
- Public `/api/ai/chat` remains blocked with Coming Soon behavior.
- Public AI Garage page remains Coming Soon.
- Existing site routes load.
- Moroccan Customs page loads.
- One controlled official MCV simulation is attempted only after the preview is protected and logs are available.

Controlled live MCV test vehicle:

- Mercedes C220d AMG Line 4MATIC.
- Vehicle type `AF0EB`.
- First registration `01/01/2022`.
- Beneficiary `AUTRE`.

Validation rule:

- Do not use or assert a predetermined customs amount. The only acceptable success result is the live official amount returned by the official MCV website with source URL and timestamp.

### Protected Preview Results

Preview 1:

- URL: `https://ttautosengineering-mp89d6p82-lhajtt.vercel.app`
- Deployment ID: `dpl_BEPHE3URTKk1w4odWpJYj4gm4vAu`
- Status: Ready, protected by Vercel Authentication.
- Result: generic HTTP 500 resolved for invalid requests; options and calculation return structured JSON.
- Live Mercedes simulation: failed at browser launch because Playwright browser executable was missing from runtime cache.

Preview 2:

- URL: `https://ttautosengineering-m4qdr3swn-lhajtt.vercel.app`
- Deployment ID: not promoted to production.
- Status: Ready, protected by Vercel Authentication.
- Result: diagnostics added; confirmed missing Playwright headless-shell executable.

Preview 3:

- URL: `https://ttautosengineering-13vpcljyg-lhajtt.vercel.app`
- Deployment ID: `dpl_CJAuEUB78ooEgDN5U5Rme5NpYquW`
- Status: Ready, protected by Vercel Authentication.
- Build evidence: Vercel downloaded Chromium/headless-shell into `node_modules/playwright-core/.local-browsers`.
- Safe checks:
  - public unauthenticated preview access: blocked by Vercel Authentication
  - `/api/mcv/calculate` invalid request: structured `VALIDATION_ERROR`
  - `/api/ai/chat` public request: `coming_soon`
  - `/en/ai-garage`: HTTP 200 behind protection
  - `/en/morocco-customs`: HTTP 200 behind protection
- Live Mercedes simulation: failed at browser launch after the executable was present. No customs amount was generated or invented.

Preview 4:

- URL: `https://ttautosengineering-is2qco7wi-lhajtt.vercel.app`
- Deployment ID: `dpl_DgxgaGhzHRt8koWpaCQqMkTa1VFy`
- Status: Ready, protected by Vercel Authentication.
- Purpose: test serverless-safe Chromium launch flags.
- Live Mercedes simulation: failed at browser launch after executable was present. No customs amount was generated or invented.

Preview 5:

- URL: `https://ttautosengineering-f0bg7b0dc-lhajtt.vercel.app`
- Deployment ID: `dpl_2DzmsrtNn4yyiLZ1abGssMUCm1eq`
- Status: Ready, protected by Vercel Authentication.
- Purpose: force Playwright to use the full Chromium executable path (`chromium-1248/chrome-linux64/chrome`) instead of `chromium_headless_shell-1248`.
- Live Mercedes simulation: failed at browser launch with `Target page, context or browser has been closed`. No customs amount was generated or invented.

Current GO/NO-GO:

- Production: NO-GO.
- Vercel-only architecture with the full Playwright Chromium bundle: NO-GO.
- Recommended next architecture: dedicated Node.js Playwright worker, or a separate serverless-compatible Chromium implementation, without changing production until verified.

### Architecture Recommendation

Option A: keep automation on Vercel.

- Use only if a protected preview proves Chromium launches and completes the official MCV simulation reliably inside the actual Vercel runtime.
- Lowest operational cost.
- Higher runtime fragility for browser automation unless packaging and concurrency are proven.

Option B: dedicated Node.js Playwright worker.

- Prefer if Vercel logs confirm browser packaging/runtime incompatibility or unreliable execution.
- Worker must require server-to-server authentication, hardcode the official MCV destination, validate requests, bound concurrency, use limited retries, clean up browser resources, return structured errors, and never invent customs values.
- Expected recurring cost: a small container or managed browser service, depending on provider and traffic. Approval is required before provisioning.

### GO/NO-GO

- Production promotion: NO-GO.
- Protected preview preparation: GO.
- Protected preview deployment: BLOCKED pending explicit user approval and access to the correct Vercel project/team.
- Full MCV launch: NO-GO until one deployed live official simulation succeeds and logs confirm stable browser cleanup.
