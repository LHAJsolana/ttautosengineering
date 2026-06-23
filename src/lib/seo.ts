// src/lib/seo.ts
export const site = {
  name: "TT AUTO'S Engineering",
  domain: "ttautosengineering.com",
  url: "https://ttautosengineering.com",
  ogImage: "/og.png", // optional fallback
  twitter: undefined,
};

export function absoluteUrl(path: string) {
  if (!path.startsWith("/")) path = `/${path}`;
  return `${site.url}${path}`;
}

export function buildBreadcrumbs(items: Array<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: it.name,
      item: absoluteUrl(it.path),
    })),
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.name,
    url: site.url,
    logo: absoluteUrl("/favicon.ico"),
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site.name,
    url: site.url,
  };
}

export function articleJsonLd(input: {
  title: string;
  description: string;
  path: string;
  datePublished?: string;
  dateModified?: string;
  image?: string;
  authorName?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: input.title,
    description: input.description,
    mainEntityOfPage: absoluteUrl(input.path),
    url: absoluteUrl(input.path),
    datePublished: input.datePublished,
    dateModified: input.dateModified ?? input.datePublished,
    image: input.image ? absoluteUrl(input.image) : undefined,
    author: input.authorName ? { "@type": "Person", name: input.authorName } : undefined,
    publisher: {
      "@type": "Organization",
      name: site.name,
      logo: { "@type": "ImageObject", url: absoluteUrl("/favicon.ico") },
    },
  };
}

export function collectionPageJsonLd(input: {
  title: string;
  description: string;
  path: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: input.title,
    description: input.description,
    url: absoluteUrl(input.path),
  };
}
