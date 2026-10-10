# TT AUTO'S MCV Worker

Dedicated Node.js Playwright worker for the official Moroccan Customs MCV flow.

## Environment

- `PORT`: HTTP port, default `8787`.
- `MCV_WORKER_TOKEN`: required bearer token for `/mcv/*` endpoints.
- `MCV_WORKER_CONCURRENCY`: max concurrent browser jobs, default `1`, capped at `3`.
- `MCV_WORKER_TIMEOUT_MS`: request timeout, default `90000`, capped at `120000`.
- `MCV_MAX_ATTEMPTS`: existing MCV engine retry count, default `2`, capped at `3`.
- `MCV_DEBUG_FLOW`: set to `1` only during development to capture sanitized browser diagnostics under `.mcv-debug/`.
- `MCV_WORKER_E2E_READINESS`: set to `1` only during controlled preview diagnostics to enable the live readiness endpoint.

## Endpoints

- `GET /healthz`: liveness.
- `GET /readyz`: readiness and active request count.
- `POST /mcv/calculate`: authenticated calculation request.
- `GET /mcv/options`: authenticated official option lookup.
- `POST /mcv/readiness/live`: authenticated, disabled-by-default live end-to-end readiness check. This performs a real official MCV simulation and must not be used as a normal health check.

The worker only calls the existing official MCV flow hardcoded in `src/lib/mcv/types.ts`.
It does not accept arbitrary navigation URLs and never fabricates customs values.
