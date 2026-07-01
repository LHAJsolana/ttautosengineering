# TT AUTO'S Engineering

Engineering-led reliability analysis, buying guides, model pages, and technical
articles for BMW, Mercedes-Benz, Audi, and Volkswagen.

## Stack

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS 4
- MDX content through `next-mdx-remote`

## Locales

The public route tree uses a required locale prefix:

- `/en`
- `/nl`
- `/ar`

Unprefixed routes redirect according to the saved locale or the browser's
`Accept-Language` header. Arabic uses RTL document direction.

Translated MDX belongs in:

```text
src/content/en/blog
src/content/en/insights
src/content/nl/blog
src/content/nl/insights
src/content/ar/blog
src/content/ar/insights
```

Dutch and Arabic files should reuse the English filename/slug. When a localized
file is missing, the content loader falls back to English.

## Commands

```bash
npm run dev
npm run lint
npm run validate
npm run build
npm start
```

`npm run check` runs linting, content/data validation, and a production build.

## Lead delivery

The risk-review form posts to `/api/leads`. Copy `.env.example` to `.env.local`
and configure either Resend (`RESEND_API_KEY`, `LEAD_TO_EMAIL`) or
`LEAD_WEBHOOK_URL`. Never expose these values through `NEXT_PUBLIC_` variables.
For production abuse protection, configure both Cloudflare Turnstile values from
`.env.example`. The endpoint also applies validation, same-origin checks, a
honeypot, request-size limits, and best-effort per-instance rate limiting.

## Deployment

The GitHub Actions workflow runs lint, validation, and a production build on
every pull request and push to `master`. Connect the repository to Vercel and
configure the lead-delivery environment variables in the Vercel project.

For a source-only handoff archive, run:

```powershell
powershell -ExecutionPolicy Bypass -File scripts/create-release.ps1
```

The generated archive is written to ignored `dist/`; dependencies, build output,
environment files, and old workspace archives are not included.

## Content

Blog and insight frontmatter require `title`, `description`, and `date`.
Optional fields include `updated`, `brand`, `image`, `category`, `platform`,
`risk`, `featured`, and `priority`.
