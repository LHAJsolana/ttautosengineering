# TT AUTO'S Engineering Project Report

This report is meant to be pasted into ChatGPT before asking it to add a new section to the site.

## 1. Project Summary

TT AUTO'S Engineering is a multilingual Next.js website for engineering-led used German car reliability analysis. It covers BMW, Mercedes-Benz, Audi, and Volkswagen with:

- reliability and buying guides
- technical insights
- blog posts
- model pages
- powertrain pages
- comparison pages
- OBD fault-code library
- model-year guides
- parts and failure map
- ownership cost and buyer checklist tools
- live Morocco customs calculator
- TT AUTO'S AI Garage text assistant with local retrieval and optional OpenAI backend
- lead capture for used-car risk review requests
- carVertical vehicle-history affiliate funnel

The real application lives in:

```text
ttautosengineering/
```

The parent folder also contains a standalone `favicon.ico` and the `.git` folder.

## 2. Stack

From `package.json`:

- Next.js `16.1.6`
- React `19.2.3`
- TypeScript `^5`
- Tailwind CSS `^4`
- MDX rendering via `next-mdx-remote`
- Frontmatter parsing via `gray-matter`
- ESLint 9 with `eslint-config-next`

Scripts:

```bash
npm run dev        # local dev server
npm run lint       # ESLint
npm run validate   # node --test tests/content-data.test.mjs
npm run audit:site # browser/CDP site audit script
npm run test       # validate + AI static checks
npm run build      # production build
npm run check      # lint + validate + build
```

## 3. File Inventory

The project contains 512 source/assets files according to `rg --files`.

File type counts:

```text
.mdx          236
.svg           84
.tsx           78
.png           51
.ts            35
.json           6
.mjs            7
.md             4
.webp           3
.ico            2
.js             1
.css            1
.ps1            1
.txt            1
.webmanifest    1
.example        1
```

Main folders:

```text
src/app                 Next.js App Router pages, metadata, sitemap, API
src/components          Shared server/client UI components
src/components/ai-garage AI Garage chat and floating widget components
src/components/carvertical carVertical affiliate UI components
src/lib                 Data registries, loaders, SEO, search, translation helpers
src/lib/ai              AI Garage config, retrieval, request normalization, OpenAI orchestration
src/content             MDX blog and insight content by locale
src/translations        Generated UI phrase catalogs for nl/fr/ar
public                  Favicons, logos, model/blog images, brand SVGs
scripts                 Translation, favicon, audit, release helper scripts
tests                   Content/data validation tests
```

## 4. Internationalization

Supported locales are defined in `src/lib/i18n.ts`:

```ts
export const locales = ["en", "nl", "fr", "ar"] as const;
export const defaultLocale = "en";
```

Public routes always use a locale prefix:

```text
/en
/nl
/fr
/ar
```

Unprefixed routes are handled by `src/proxy.ts`. The proxy:

- skips `_next`, `/api`, common public files, `robots.txt`, `sitemap.xml`, `/opengraph-image`
- reads saved `tt-locale` cookie
- checks `Accept-Language`
- redirects unprefixed paths to the preferred locale
- sets canonical/alternate `Link` headers for localized routes

Arabic uses `dir="rtl"` in the locale layout. Important note: some shell output shows Arabic text as mojibake; verify actual files in an UTF-8 editor before assuming source corruption.

Translations are handled in two ways:

- `src/lib/i18n.ts` contains core nav/footer UI labels.
- `src/lib/translate.ts` and `src/components/ContentTranslator.client.tsx` use generated phrase catalogs from:

```text
src/translations/nl.json
src/translations/fr.json
src/translations/ar.json
```

Localized MDX content is stored in:

```text
src/content/en/blog
src/content/en/insights
src/content/nl/blog
src/content/nl/insights
src/content/fr/blog
src/content/fr/insights
src/content/ar/blog
src/content/ar/insights
```

Current MDX content count:

```text
en/blog       40
en/insights   19
nl/blog       40
nl/insights   19
fr/blog       40
fr/insights   19
ar/blog       40
ar/insights   19
```

The tests require localized MDX slug parity with English.

## 5. App Router Pages

All user-facing pages are under `src/app/[locale]/`.

Static/top-level pages:

```text
src/app/[locale]/page.tsx
src/app/[locale]/about/page.tsx
src/app/[locale]/ai-garage/page.tsx
src/app/[locale]/affiliate-disclosure/page.tsx
src/app/[locale]/blog/page.tsx
src/app/[locale]/brands/page.tsx
src/app/[locale]/buying-checklist/page.tsx
src/app/[locale]/buying-guides/page.tsx
src/app/[locale]/buying-hub/page.tsx
src/app/[locale]/compare/page.tsx
src/app/[locale]/contact/page.tsx
src/app/[locale]/disclaimer/page.tsx
src/app/[locale]/fault-codes/page.tsx
src/app/[locale]/how-we-evaluate-used-cars/page.tsx
src/app/[locale]/insights/page.tsx
src/app/[locale]/maintenance-cost/page.tsx
src/app/[locale]/models/page.tsx
src/app/[locale]/model-years/page.tsx
src/app/[locale]/parts-failure-map/page.tsx
src/app/[locale]/powertrains/page.tsx
src/app/[locale]/privacy-policy/page.tsx
src/app/[locale]/reliability-index/page.tsx
src/app/[locale]/search/page.tsx
src/app/[locale]/terms/page.tsx
src/app/[locale]/tools/page.tsx
src/app/[locale]/vehicle-history/page.tsx
src/app/[locale]/vin-history/page.tsx
```

Dynamic pages:

```text
src/app/[locale]/blog/[slug]/page.tsx
src/app/[locale]/brands/[brand]/page.tsx
src/app/[locale]/compare/[slug]/page.tsx
src/app/[locale]/fault-codes/[code]/page.tsx
src/app/[locale]/insights/[slug]/page.tsx
src/app/[locale]/insights/category/[category]/page.tsx
src/app/[locale]/insights/platform/[platform]/page.tsx
src/app/[locale]/models/[slug]/page.tsx
src/app/[locale]/model-years/[slug]/page.tsx
src/app/[locale]/parts-failure-map/[slug]/page.tsx
src/app/[locale]/powertrains/[slug]/page.tsx
src/app/[locale]/research/[slug]/page.tsx
```

Specific brand shortcut pages:

```text
src/app/[locale]/brands/audi/page.tsx
src/app/[locale]/brands/bmw/page.tsx
src/app/[locale]/brands/mercedes-benz/page.tsx
src/app/[locale]/brands/volkswagen/page.tsx
```

Global app files:

```text
src/app/[locale]/layout.tsx        locale layout, metadata, GA, JSON-LD, nav/footer wrapper
src/app/globals.css                global Tailwind/CSS
src/app/error.tsx                  error boundary
src/app/not-found.tsx              404 page
src/app/robots.ts                  robots.txt generator
src/app/sitemap.ts                 sitemap generator
src/app/opengraph-image/route.ts   OG image route
src/app/api/leads/route.ts         lead capture API
src/app/api/ai/chat/route.ts       AI Garage text chat API
src/app/api/mcv/calculate/route.ts live Morocco MCV calculation API
src/app/api/mcv/options/route.ts   live Morocco MCV option lookup API
src/app/5f0b7d8e9c2a41f6b3d4e5a6c7b8d9e0.txt/route.ts verification text route
```

## 6. Layout, Metadata, SEO

`src/app/[locale]/layout.tsx`:

- validates locale
- sets `<html lang>` and RTL/LTR direction
- loads Geist fonts
- sets global metadata, icons, manifest, Google verification
- injects Google Analytics ID `G-32JMN5G1JK`
- injects Organization, WebSite, and Service JSON-LD
- wraps all pages in `LocaleProvider` and `LocaleChrome`

`src/lib/site.ts`:

- `SITE_URL = "https://ttautosengineering.com"`
- builds canonical URLs
- builds localized alternate URLs
- creates localized page metadata with Open Graph/Twitter metadata

`src/app/sitemap.ts` builds sitemap entries for:

- static pages
- brand pages
- model pages
- powertrain pages
- comparisons
- research landing pages
- parts failure items
- fault codes
- model years
- non-fallback insights
- non-fallback blog posts

`src/app/robots.ts` allows the site and blocks `/api/`, `/_next/`, `/static/`.

## 7. Core Data Libraries

Important files in `src/lib/`:

```text
blog.ts              Loads blog MDX, validates frontmatter, computes excerpts/reading time, supports locale fallback
insights.ts          Loads insight MDX, validates frontmatter/taxonomy, computes excerpts/reading time, supports locale fallback
brands.ts            Brand registry for BMW, Mercedes-Benz, Audi, Volkswagen
models.ts            Model page registry and hero image mapping
modelYears.ts        Model-year guide dataset
powertrains.ts       Engine/gearbox dataset
comparisons.ts       Direct comparison dataset
faultCodes.ts        OBD fault-code dataset
partsFailureMap.ts   Parts/failure map dataset
seoLandingPages.ts   Research landing page dataset
search.ts            Site search index and scoring
ai/config.ts         AI Garage server config from env
ai/agent.ts          AI Garage request normalization, local fallback, OpenAI Responses call
ai/retrieve.ts       Local RAG-style retrieval over search and fault-code data
ai/types.ts          Shared AI Garage request/response types
mcv/client.ts        Browser-backed official Moroccan customs/MCV client
mcv/parser.ts        Official customs HTML/result parser
mcv/types.ts         MCV request/result types
carVertical.ts       carVertical affiliate copy/URLs
seo.ts               SEO helpers
site.ts              Site URL and localized metadata helpers
i18n.ts              Locales, locale paths, nav/footer UI copy
translate.ts         Translation catalog lookup
taxonomy.ts          Category/platform slug helpers
toolCopy.ts          Copy for tools pages and client tools
opengraph-image.tsx  Open Graph image generation helper
```

Data-driven route relationships:

- `/blog` and `/blog/[slug]` use `src/lib/blog.ts` and MDX in `src/content/*/blog`.
- `/insights` and `/insights/[slug]` use `src/lib/insights.ts` and MDX in `src/content/*/insights`.
- `/brands` and `/brands/[brand]` use `src/lib/brands.ts`.
- `/models` and `/models/[slug]` use `src/lib/models.ts`.
- `/powertrains` and `/powertrains/[slug]` use `src/lib/powertrains.ts`.
- `/compare` and `/compare/[slug]` use `src/lib/comparisons.ts`.
- `/fault-codes` and `/fault-codes/[code]` use `src/lib/faultCodes.ts`.
- `/model-years` and `/model-years/[slug]` use `src/lib/modelYears.ts`.
- `/parts-failure-map` and `/parts-failure-map/[slug]` use `src/lib/partsFailureMap.ts`.
- `/research/[slug]` uses `src/lib/seoLandingPages.ts`.
- `/search` uses `src/lib/search.ts`.
- `/ai-garage` uses `src/lib/ai/*` plus `src/lib/search.ts` for local retrieval.
- `/morocco-customs` uses `src/lib/mcv/*` and the official MCV web flow through server API routes.

Known dataset examples:

- Powertrains include BMW N47, BMW B47, BMW B48, Mercedes OM651, VAG EA888, VAG DQ250 DSG, ZF 8HP, Mercedes 9G-Tronic.
- Parts failure map includes N47 timing chain, B47 EGR cooler, B48 cooling system, ZF 8HP, Mercedes OM651 chain, OM654 AdBlue, 9G-Tronic, NOx sensors, air suspension, Audi EA888 water pump/thermostat, Audi S tronic, VW DSG, VW 2.0 TDI DPF/EGR, and more.
- Comparisons include BMW B47 vs B48, BMW N47 vs B47, Mercedes OM651 vs OM654, Audi 2.0 TDI vs BMW B47, VW Golf vs Audi A3, BMW 3 Series vs Mercedes C-Class, Audi A4 vs BMW 3 Series, BMW X1 vs Audi Q3, Audi Q5 vs BMW X3, Mercedes GLE vs BMW X5, Volkswagen Passat vs Arteon, etc.
- Tests expect at least 73 fault codes and at least 24 comparisons.

## 8. Components

Shared components:

```text
ai-garage/GarageChat.client.tsx
ai-garage/GarageFloatingWidget.client.tsx
BrandHubPage.tsx
Breadcrumbs.tsx
BuyingChecklistTool.client.tsx
ContentTranslator.client.tsx
FaultCodeLibrary.client.tsx
InsightsGrid.client.tsx
JsonLd.tsx
LanguageSwitcher.tsx
LeadCaptureCTA.client.tsx
LocaleChrome.tsx
LocaleProvider.tsx
LocalizedLink.tsx
mdx.tsx
ModelHubPage.tsx
ModelYearExplorer.client.tsx
MoroccoCustomsCalculator.client.tsx
Navbar.tsx
OwnershipCostCalculator.client.tsx
PowertrainHubPage.tsx
RelatedResearch.tsx
ToolPageHero.tsx
VehicleComparisonTool.client.tsx
VinHistoryCTA.client.tsx
```

carVertical components:

```text
src/components/carvertical/CarVerticalBanner.tsx
src/components/carvertical/CarVerticalCard.tsx
src/components/carvertical/CarVerticalCTA.tsx
src/components/carvertical/CarVerticalInline.tsx
src/components/carvertical/CarVerticalSteps.tsx
```

Key behavior:

- `LocalizedLink.tsx` automatically prefixes internal links with the active locale.
- `LocaleChrome.tsx` renders the navbar, page content, translator, and footer.
- `GarageFloatingWidget.client.tsx` is rendered from `LocaleChrome.tsx` on every locale page.
- `Navbar.tsx` contains the main navigation links. Add new top-level sections here if they need global navigation.
- `LocaleChrome.tsx` footer contains footer links. Add new important sections there too.
- `ToolPageHero.tsx` is reused by tool-like pages.
- `LeadCaptureCTA.client.tsx` is a full client form that posts to `/api/leads`.
- `JsonLd.tsx` injects JSON-LD script tags.

## 9. Homepage

`src/app/[locale]/page.tsx` is a large homepage composed of local helper components:

- `Pill`
- `SectionHeading`
- `FeatureCard`
- `ScoreRow`
- `TopicCard`

It imports:

- `brands` from `src/lib/brands.ts`
- blog posts from `src/lib/blog.ts`
- direct comparisons from `src/lib/comparisons.ts`
- insights from `src/lib/insights.ts`
- model guides from `src/lib/models.ts`
- `LeadCaptureCTA`
- `CarVerticalBanner`

Homepage sections include:

- hero with Unsplash background image
- stats for blog/insights/comparisons/model guides
- carVertical banner
- buyer shortcut
- lead capture CTA
- “Start here” feature cards
- direct comparisons
- featured insight
- latest insights
- reliability signal board
- technical topics
- latest blog posts
- brand hubs
- contact CTA

If adding a new major section, this homepage usually needs a new `Feature` item or a dedicated block.

## 10. Lead Capture

API route:

```text
src/app/api/leads/route.ts
```

Client form:

```text
src/components/LeadCaptureCTA.client.tsx
```

Environment variables from `.env.example`:

```text
RESEND_API_KEY=
LEAD_TO_EMAIL=contact@ttautosengineering.com
LEAD_FROM_EMAIL=TT AUTO'S Leads <leads@ttautosengineering.com>
LEAD_WEBHOOK_URL=
LEAD_WEBHOOK_SECRET=
LEAD_STORAGE_PATH=
NEXT_PUBLIC_TURNSTILE_SITE_KEY=
TURNSTILE_SECRET_KEY=
NEXT_PUBLIC_CARVERTICAL_VIN_URL=
NEXT_PUBLIC_CARVERTICAL_GENERAL_URL=
AI_GARAGE_ENABLED=true
OPENAI_API_KEY=
OPENAI_TEXT_MODEL=gpt-4.1-mini
AI_MAX_INPUT_CHARS=6000
AI_MAX_OUTPUT_TOKENS=900
AI_MAX_REQUESTS_PER_WINDOW=30
AI_RATE_LIMIT_WINDOW_MS=900000
MCV_MAX_ATTEMPTS=2
```

API protections:

- max body size 20 KB
- same-origin check
- honeypot field named `company`
- in-memory rate limit: 5 submissions per 15 minutes per IP
- required brand, model, contact, consent
- year validation
- VIN validation
- Turnstile validation when secret is configured
- delivery through Resend, webhook, or JSONL fallback

## 11. Content Rules

Blog and insight MDX frontmatter must include:

```yaml
title: "..."
description: "..."
date: "YYYY-MM-DD"
```

Optional frontmatter:

```yaml
updated: "YYYY-MM-DD"
author: "..."
category: "..."
brand: "BMW"
image: "/images/..."
featured: true
priority: 10
platform: "B47"
risk:
  - "High"
  - "Costly"
```

The loaders normalize brand names like BMW, Audi, Volkswagen/VW, Mercedes-Benz.

If an MDX `image` starts with `/`, tests check that the file exists under `public/`.

## 12. Tests and Validation

Main test file:

```text
tests/content-data.test.mjs
tests/ai-static.test.mjs
```

It checks:

- every locale has the same blog and insight MDX filenames as English
- required frontmatter exists
- titles and descriptions have minimum length
- dates are valid `YYYY-MM-DD`
- MDX body is not too thin
- referenced local images exist
- fault code and comparison datasets are unique and large enough
- model hero mappings are unique and point to valid assets
- English MDX internal links target known routes

Important: if adding a new static page and linking to it from MDX, update the test’s `staticRoutes` set or the validation test may fail.

## 12A. TT AUTO'S AI Garage

Implemented route:

```text
src/app/[locale]/ai-garage/page.tsx
```

Implemented API:

```text
src/app/api/ai/chat/route.ts
```

The chat API accepts recent messages, locale, vehicle context, and minimal page context. It enforces request-size limits, rate-limits by IP in memory, retrieves relevant TT AUTO'S sources through `src/lib/search.ts`, adds direct fault-code context from `src/lib/faultCodes.ts`, calls OpenAI Responses API with streaming only when `OPENAI_API_KEY` is configured, falls back to a deterministic local answer when no key is present, and returns Server-Sent Events for progressive UI rendering.

Important implementation files:

```text
src/lib/ai/config.ts
src/lib/ai/types.ts
src/lib/ai/retrieve.ts
src/lib/ai/agent.ts
src/lib/ai/mcvTool.ts
src/components/ai-garage/GarageChat.client.tsx
src/components/ai-garage/GarageFloatingWidget.client.tsx
docs/AI_GARAGE_ARCHITECTURE.md
```

Current limits:

- no persistent conversation database yet
- no embeddings/vector database yet
- no voice/Realtime implementation yet
- no image diagnosis yet
- live OpenAI mode needs a configured `OPENAI_API_KEY` to verify against the real API
- customs amounts are not invented; the AI can call the existing typed MCV tool only after required official fields are present
- MCV official-site automation remains an external dependency and should use a production worker/queue for higher traffic

## 13. Scripts

```text
scripts/generate-translations.mjs  Machine-translates MDX and UI phrase catalogs from English to nl/fr/ar
scripts/generate-favicons.mjs      Favicon generation helper
scripts/audit-site.mjs             CDP/browser audit for selected pages and sitemap URLs
scripts/create-release.ps1         Creates source-only release archive in ignored dist/
```

`generate-translations.mjs` protects brand/mechanical terms during translation and writes `src/translations/*.json`.

## 14. Public Assets

Important public files:

```text
public/logo.png
public/logo-transparent.png
public/favicon.ico
public/favicon-16x16.png
public/favicon-32x32.png
public/apple-touch-icon.png
public/android-chrome-192x192.png
public/android-chrome-512x512.png
public/site.webmanifest
public/audi.svg
public/bmw.svg
public/mercedes.svg
public/volkswagen.svg
```

Image folders:

```text
public/images/blog                  SVG blog hero images
public/images/photos/blog           PNG blog photos
public/images/models                a few WEBP model images
public/images/models/generated      generated SVG model images
public/images/photos/models         PNG model photos
```

There are also default Next/Vercel template SVGs still present:

```text
public/file.svg
public/globe.svg
public/next.svg
public/vercel.svg
public/window.svg
```

## 15. Current Navigation

Main nav is in `src/components/Navbar.tsx`.

Current nav items:

- Insights
- Blog
- Search
- Brands
- Models
- Powertrains
- Buying Hub
- Tools
- Vehicle History
- Buying Guides
- Parts Map
- Checklist
- Reliability Index
- About

Footer links are in `src/components/LocaleChrome.tsx`.

If adding a new section, decide whether it belongs in:

- main nav
- footer Explore
- footer Company
- footer Trust
- homepage feature cards
- `/tools`
- `/buying-hub`
- `/search` index
- sitemap static paths

## 16. How To Add A New Section

For a new static section, usually do this:

1. Create a page:

```text
src/app/[locale]/new-section/page.tsx
```

2. In that page:

- read `params`
- validate `locale` with `isLocale`
- call `localizedPageMetadata`
- use `LocalizedLink` for internal links
- use existing design patterns from nearby pages
- add JSON-LD if the page is important for SEO

3. Add the path to:

```text
src/app/sitemap.ts       staticPaths
src/components/Navbar.tsx if it needs global nav
src/components/LocaleChrome.tsx if it needs footer nav
src/lib/search.ts        staticItems if it should appear in search
src/app/[locale]/page.tsx homepage features if it should be promoted
tests/content-data.test.mjs staticRoutes if MDX will link to it
```

4. Add translation handling:

- add direct copy to `src/lib/i18n.ts` only if it is core nav/footer UI
- otherwise use English copy and let `ContentTranslator`/phrase catalogs translate it
- for fully polished copy, update `src/translations/*.json` or run `npm run` script manually with care

5. Run:

```bash
npm run lint
npm run validate
npm run build
```

For a new MDX blog or insight article:

1. Add English MDX first:

```text
src/content/en/blog/my-slug.mdx
src/content/en/insights/my-slug.mdx
```

2. Add matching slug files for `nl`, `fr`, and `ar`.

3. Include required frontmatter.

4. If using a local image, place it in `public/images/...` and reference it with a leading slash.

5. If the article links to a new route, update validation route lists.

For a new data-driven collection:

1. Add a registry in `src/lib/newRegistry.ts`.
2. Add index and detail routes under `src/app/[locale]/new-section`.
3. Add `generateStaticParams` for detail pages.
4. Add localized metadata.
5. Add sitemap entries.
6. Add search entries.
7. Add tests for unique slugs and valid links if the dataset is important.

## 17. Things To Be Careful About

- This site is locale-prefixed; internal links should usually be unprefixed and use `LocalizedLink`.
- `src/app/[locale]` paths require `-LiteralPath` in PowerShell because `[locale]` is treated like a wildcard.
- MDX translation parity is required by tests.
- Adding an MDX link to a new route can fail validation unless `tests/content-data.test.mjs` knows the route.
- `sitemap.ts` must be updated for new important route groups.
- `Navbar.tsx` has some hardcoded English labels such as `Parts Map`; localize if adding similar labels.
- The shell showed mojibake for Arabic text in several files; inspect with UTF-8-aware tooling before editing Arabic copy.
- `LeadCaptureCTA.client.tsx` has its own copy object and only explicit `nl` and `ar`; French currently falls back through `translateValue(locale, copy.en)`.
- `generate-translations.mjs` uses an unofficial Google Translate endpoint and writes many files; run intentionally.
- There are both `/vehicle-history` and `/vin-history` routes. Vehicle history is the polished funnel; VIN history is also present and uses lead capture.

## 18. Best Prompt To Send ChatGPT

Paste this report, then ask:

```text
I want to add a new section called "[SECTION NAME]" to this Next.js App Router project.

Please implement it following the existing architecture:
- locale-prefixed route under src/app/[locale]
- localized metadata via src/lib/site.ts
- internal links via LocalizedLink
- update sitemap.ts
- update Navbar/Footer/Homepage/Search if appropriate
- update tests if a new route is linked from MDX
- keep the existing dark automotive design style
- run npm run lint, npm run validate, and npm run build

The section should contain:
[describe content, cards, tools, CTAs, SEO goals, data sources, and where it should appear]
```

