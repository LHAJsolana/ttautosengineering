"use client";

import { useEffect } from "react";
import nl from "@/translations/nl.json";
import ar from "@/translations/ar.json";
import type { Locale } from "@/lib/i18n";

const catalogs = {
  nl: nl as Record<string, string>,
  ar: ar as Record<string, string>,
};

const translatedNodes = new WeakMap<Node, string>();
const translatedAttributes = new WeakMap<Element, Map<string, string>>();

function translateText(value: string, catalog: Record<string, string>) {
  const leading = value.match(/^\s*/)?.[0] ?? "";
  const trailing = value.match(/\s*$/)?.[0] ?? "";
  const key = value.replace(/\s+/g, " ").trim();
  const translated = catalog[key];
  return translated ? `${leading}${translated}${trailing}` : value;
}

function translateElement(root: ParentNode, catalog: Record<string, string>) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let node = walker.nextNode();

  while (node) {
    const parent = node.parentElement;
    if (
      parent &&
      !["SCRIPT", "STYLE", "CODE", "PRE", "NOSCRIPT"].includes(parent.tagName)
    ) {
      const original = translatedNodes.get(node) ?? node.nodeValue ?? "";
      const translated = translateText(original, catalog);
      translatedNodes.set(node, original);
      if (translated !== node.nodeValue) node.nodeValue = translated;
    }
    node = walker.nextNode();
  }

  root.querySelectorAll?.("[placeholder], [title], [aria-label]").forEach((element) => {
    const originals = translatedAttributes.get(element) ?? new Map<string, string>();
    for (const attribute of ["placeholder", "title", "aria-label"]) {
      const value = element.getAttribute(attribute);
      if (!value) continue;
      const original = originals.get(attribute) ?? value;
      originals.set(attribute, original);
      const translated = translateText(original, catalog);
      if (translated !== value) element.setAttribute(attribute, translated);
    }
    translatedAttributes.set(element, originals);
  });
}

function restoreElement(root: ParentNode) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let node = walker.nextNode();

  while (node) {
    const original = translatedNodes.get(node);
    if (original !== undefined && node.nodeValue !== original) node.nodeValue = original;
    node = walker.nextNode();
  }

  root.querySelectorAll?.("[placeholder], [title], [aria-label]").forEach((element) => {
    const originals = translatedAttributes.get(element);
    if (!originals) return;
    originals.forEach((value, attribute) => element.setAttribute(attribute, value));
  });
}

export default function ContentTranslator({
  locale,
  children,
}: {
  locale: Locale;
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (locale === "en") {
      restoreElement(document.body);
      return;
    }
    const catalog = catalogs[locale];
    if (!catalog) return;

    translateElement(document.body, catalog);
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.TEXT_NODE && node.parentNode) {
            translateElement(node.parentNode, catalog);
          } else if (node instanceof Element) {
            translateElement(node, catalog);
          }
        });
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [locale]);

  return children;
}
