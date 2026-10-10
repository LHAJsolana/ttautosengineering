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

## Dedicated Playwright Worker Update

Implemented on `codex/mcv-preview-recovery` after the Vercel-only attempts:

- Added a container-oriented Node.js worker at `worker/mcv-worker.ts`.
- Added `src/lib/mcv/workerClient.ts` so the Next.js API routes can call the worker through server-to-server HTTP when `MCV_WORKER_URL` and `MCV_WORKER_TOKEN` are configured.
- Preserved the existing in-process MCV client as a local fallback when no worker is configured.
- Added `Dockerfile.mcv-worker` using the official Playwright container base image.
- Added `worker/README.md` with deployment and configuration notes.
- Added `worker:dev` and `worker:start` scripts.
- Kept `AI_GARAGE_PUBLIC_ENABLED=false`; no AI Garage public launch behavior was changed.

Worker security and reliability properties:

- `/mcv/calculate` and `/mcv/options` require `Authorization: Bearer <MCV_WORKER_TOKEN>`.
- `/healthz` and `/readyz` are unauthenticated health endpoints only.
- Request bodies are size-limited.
- Vehicle simulation inputs are validated before browser work starts.
- Browser concurrency is bounded with `MCV_WORKER_CONCURRENCY`, default `1`, capped at `3`.
- Worker request timeout is bounded with `MCV_WORKER_TIMEOUT_MS`, capped at `120000`.
- MCV engine attempts remain bounded with `MCV_MAX_ATTEMPTS`, capped at `3`.
- The result wait and overall browser job timeout are configurable through `MCV_RESULT_TIMEOUT_MS` and `MCV_JOB_TIMEOUT_MS`, both capped.
- Responses are structured JSON with `Cache-Control: no-store` and correlation IDs.
- Logs are JSON and redact token/authorization-like fields.

Local worker verification:

- `GET http://127.0.0.1:8787/healthz`: PASS, HTTP `200`.
- `GET http://127.0.0.1:8787/readyz`: PASS, HTTP `200`.
- Unauthenticated `GET /mcv/options`: PASS, HTTP `401 UNAUTHORIZED`.
- Invalid authenticated `POST /mcv/calculate`: PASS, HTTP `400 VALIDATION_ERROR`.
- Next.js API route with `MCV_WORKER_URL=http://127.0.0.1:8787`: PASS, invalid calculation returns structured `400`.
- Next.js `/api/mcv/options?manufacturer=MERCEDES&modelQuery=C%20220D` through the worker: PASS, HTTP `200`, official options returned.
- Public `/api/ai/chat`: PASS, HTTP `403` with `coming_soon`.
- Local `/en/ai-garage`: PASS, HTTP `200`.
- Local `/en/morocco-customs`: PASS, HTTP `200`.

Initial controlled live Mercedes simulation from the local worker, before the deep-debug fix:

- Request:
  - Manufacturer: `MERCEDES`
  - Model: `C 220D /AMG LINE/ 4MATIC (TYPE AF)`
  - Vehicle type: `AF0EB`
  - First registration: `01/01/2022`
  - Beneficiary: `AUTRE`
- Result: NO-GO. The worker successfully launched Chromium, opened the official MCV site, selected the vehicle flow, and submitted the official simulation, but no official customs amount was returned before the bounded timeout.
- No customs amount was generated, cached, guessed, or fabricated.
- Latest structured result: HTTP `502`, code `TIMEOUT`, progress `running-simulation`.
- Confirmed diagnostic sequence: browser launch, official page open, selection controls loaded, automobile category selected, official simulation submitted.
- Superseded by the deep-debug update below. The later investigation found the flow was actually blocked while filling the Angular Material date field, before a reliable submit click.

Container verification:

- Docker CLI is installed: `Docker version 29.5.3`.
- Docker build was attempted with `docker build -f Dockerfile.mcv-worker -t ttautos-mcv-worker:preview .`.
- Blocker: Docker Desktop Linux engine is not running on this Windows machine.
- Attempting to start `com.docker.service` from this shell failed with `Cannot open com.docker.service service on computer '.'`.
- Therefore the container image has been authored but not locally built or run in Docker from this environment.

Checks after the worker implementation:

- `npm run lint`: PASS.
- `npm run test`: PASS, 18 tests.
- `npm run build`: PASS.

Recommended hosting architecture:

- Keep Vercel for the TT AUTO'S Next.js website.
- Host the MCV worker as a private container service with no public browser UI and no direct frontend access.
- Configure Vercel environment variables only after the worker is deployed:
  - `MCV_WORKER_URL`
  - `MCV_WORKER_TOKEN`
  - optionally `MCV_WORKER_TIMEOUT_MS`
- Keep a low worker concurrency limit until the official MCV site behavior is proven under preview traffic.
- Add a shared distributed throttle in front of `/api/mcv/options` and `/api/mcv/calculate` before public launch; the current process-local limiter is not enough for multi-instance production.

Provider notes, checked on 2026-10-10:

- Fly.io can run small container Machines and lists the smallest always-on app at about `$2.19/month`, with larger memory sizes such as `shared-cpu-1x` 1GB around `$6.70/month`; browser automation will likely need at least 1GB RAM in practice. Source: [Fly.io Resource Pricing](https://docs.fly.io/about/pricing).
- Railway supports usage-based container hosting. The Hobby plan is `$5/month` and includes usage credit; resource usage is billed on top of plan rules. Source: [Railway Pricing Plans](https://docs.railway.com/pricing/plans).
- Google Cloud Run supports container scale-to-zero and pay-per-use. Google lists a request-based serverless example at `$7.25/month` for 10M very small requests, and a single always-running worker-pool example at `$11.61/month`; real Playwright cost depends on CPU, memory, region, cold starts, and request volume. Source: [Cloud Run pricing](https://cloud.google.com/run/pricing).
- Render supports Docker web services, private services, background workers, and preview environments, but exact compute pricing should be confirmed in the dashboard before provisioning. Source: [Render pricing](https://render.com/pricing).

Current worker GO/NO-GO:

- Worker implementation: GO for protected preview and container-host testing.
- Local official options retrieval through the worker: GO.
- Local official customs calculation result: GO as of the deep-debug update below; a real official amount was returned and parsed.
- Docker image verification: BLOCKED by local Docker service permissions.
- Production launch: NO-GO.

## MCV Live Simulation Deep Debug Update

Date: 2026-10-10.

Scope:

- Continued on `codex/mcv-preview-recovery`.
- No production deployment.
- No production settings changed.
- No paid infrastructure provisioned.
- AI Garage remained in pre-launch mode.

Instrumentation added:

- Development-only browser diagnostics behind `MCV_DEBUG_FLOW=1`.
- Sanitized diagnostic output for:
  - page URL snapshots,
  - navigation events,
  - official-domain network response status summaries,
  - failed official-domain requests,
  - browser console warnings/errors,
  - JavaScript page errors,
  - dialogs,
  - popups,
  - visible DOM text snippets,
  - form state snapshots,
  - sanitized HTML artifacts,
  - screenshots around the form and submit flow.
- Debug artifacts are written under `.mcv-debug/`, which is ignored by Git.
- Diagnostic text redacts bearer tokens and token/session-like URL parameters.

Exact failure cause:

- The earlier timeout was mislabeled as a post-submit timeout because the diagnostic message said `Submitting official MCV simulation` before the code actually filled the remaining required form fields.
- The real blocking point was the Angular Material first-registration-date input `#mat-input-0`.
- Playwright's normal `locator("#mat-input-0").fill("01/01/2022")` did not complete reliably in this official page state.
- Because date entry did not finish, the worker never reliably reached beneficiary selection or the `Valider` click in the failing run.

Observed page behavior before the fix:

- Chromium launched successfully.
- Official MCV page loaded.
- The app navigated from `pageId=4` to `pageId=2`.
- Vehicle flow and official options loaded.
- The visible page showed:
  - genre `Tourisme non hybride`,
  - marque `MERCEDES`,
  - modèle `C 220D /AMG LINE/ 4MATIC (TYPE AF)`,
  - type `AF0EB`,
  - an empty visible date field,
  - beneficiary `Autre` already selected.
- Screenshot artifact: `.mcv-debug/attempt-1-014757-before-form-fill.png`.

Network and DOM evidence:

- Captured official-domain network events before the failing form-fill step returned HTTP `200` for the MCV app shell, scripts, styles, language resources, UI page/section resources, and reference-data endpoints.
- No browser dialog, popup, or page-level JavaScript exception was observed in the captured failure diagnostics.
- DOM form-state snapshot confirmed `#mat-input-0` existed, was visible, enabled, and empty before the failing step.
- The old HTML snapshot heuristic captured the warning alert first; this was improved to prefer actual form/result containers containing labels such as `Montant total des droits et des taxes`, `Valeur taxable`, and `Droits d'importation`.

Fix implemented:

- Replaced the fragile date `fill()` operation with an Angular-friendly native input value setter that dispatches `input`, `change`, and `blur` events.
- Added verification that the input value equals the requested first registration date before continuing.
- Replaced beneficiary selection by raw `input[value=...]` as the only path with a fallback that clicks the visible official beneficiary label.
- Split diagnostics into accurate steps:
  - preparing form,
  - filling first registration date,
  - selecting beneficiary type,
  - clicking `Valider`,
  - waiting for result signal,
  - extracting result,
  - validating amount.
- Added a separate authenticated live readiness endpoint:
  - `POST /mcv/readiness/live`,
  - disabled by default unless `MCV_WORKER_E2E_READINESS=1`,
  - not used by `/healthz` or `/readyz`,
  - performs a real official simulation only when explicitly enabled.

Parser findings:

- The existing parser successfully parsed the real official output after the date-entry fix.
- It handled French labels, DH currency, spaces as thousands separators, multiline text, and the total label.
- No parser change was needed based on the observed successful official result.

Controlled live simulation result:

- Request:
  - Manufacturer: `MERCEDES`
  - Model: `C 220D /AMG LINE/ 4MATIC (TYPE AF)`
  - Vehicle type: `AF0EB`
  - First registration: `01/01/2022`
  - Beneficiary: `AUTRE`
- Result: SUCCESS from the local dedicated worker.
- Source URL: `https://www.douane.gov.ma/mcv/#/view?pageId=2`.
- Worker timestamp: `2026-10-10T18:28:33.910Z`.
- Official consultation label: `Consultation du 10/10/2026 à 08:28`.
- Parsed official fields:
  - `Valeur a l'etat neuf`: `575 600 DH`
  - `Valeur taxable`: `431 700 DH`
  - `Droits d'importation`: `75 548 DH`
  - `TVA`: `106 749 DH`
  - `Taxe parafiscale`: `1 080 DH`
  - `Droit de timbre proportionnel`: `25 417 DH`
  - `Montant total des droits et des taxes`: `208 794 DH`
- No amount was fabricated or reused; the amount above came from the live official simulation response.

Readiness distinction:

- Process liveness: `/healthz`.
- Lightweight worker readiness and concurrency state: `/readyz`.
- Chromium launchability: proven locally by the live worker run.
- Official website reachability: proven locally by official option lookup and live simulation.
- Complete MCV simulation success: proven locally by the Mercedes C220d simulation returning `208 794 DH`.
- Deployed worker/container readiness: not yet proven because Docker Desktop's Linux engine could not be started in this environment and no external worker host was provisioned.

Additional verification after the fix:

- `npm run lint`: PASS.
- `npm run test`: PASS, 19 tests.
- `npm run build`: PASS.
- `POST /mcv/readiness/live` without `MCV_WORKER_E2E_READINESS=1`: PASS, HTTP `403 READINESS_DISABLED`.

Remaining blockers:

- The Docker worker image still needs to be built and run in an environment where Docker Linux containers are available.
- The worker still needs a protected deployed preview on an approved container host.
- Vercel preview must then be configured with `MCV_WORKER_URL` and `MCV_WORKER_TOKEN` and tested against the deployed worker.
- Production remains NO-GO until the deployed worker, not only the local worker, completes a live official simulation and cleanup is verified from logs.

### GO/NO-GO

- Production promotion: NO-GO.
- Protected preview preparation: GO.
- Protected preview deployment: GO only for protected preview, not production, after the worker branch is pushed and a worker host is selected.
- Full MCV launch: NO-GO until one deployed live official simulation succeeds through the protected preview and logs confirm stable browser cleanup.
