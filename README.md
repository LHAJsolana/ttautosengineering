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
npm run build
npm start
```

## Content

Blog and insight frontmatter require `title`, `description`, and `date`.
Optional fields include `updated`, `brand`, `image`, `category`, `platform`,
`risk`, `featured`, and `priority`.
