// src/lib/taxonomy.ts
export function slugifyTaxonomy(input: string) {
  return input
    .trim()
    .toLowerCase()
    .replace(/['\u2019]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function unslugifyTaxonomy(slug: string) {
  // Keep it simple: "timing-chain" -> "Timing Chain"
  return slug
    .split("-")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export function matchesTaxonomy(value: string | undefined, slug: string) {
  if (!value) return false;
  return slugifyTaxonomy(value) === slug;
}
