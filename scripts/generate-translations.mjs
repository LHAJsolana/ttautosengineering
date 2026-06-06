import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import ts from "typescript";

const ROOT = process.cwd();
const SOURCE_LOCALE = "en";
const TARGETS = ["nl", "ar"];
const CONTENT_TYPES = ["blog", "insights"];
const CACHE_PATH = path.join(ROOT, "scripts", ".translation-cache.json");
const PHRASE_DIR = path.join(ROOT, "src", "translations");

const protectedTerms = [
  "TT AUTO'S Engineering",
  "TT AUTO’S Engineering",
  "BMW",
  "Mercedes-Benz",
  "Audi",
  "Volkswagen",
  "AdBlue",
  "Haldex",
  "DSG",
  "TFSI",
  "TDI",
  "NOx",
  "DPF",
  "EGR",
  "SCR",
  "OBD",
  "N47",
  "B47",
  "B48",
  "N52",
  "OM651",
  "OM654",
  "EA888",
  "ZF 8HP",
];

let cache = {};
try {
  cache = JSON.parse(await fs.readFile(CACHE_PATH, "utf8"));
} catch {
  cache = {};
}

function protect(text) {
  const values = [];
  let output = text;
  const patterns = [
    /https?:\/\/[^\s)]+/g,
    /`[^`]+`/g,
    ...protectedTerms.map(
      (term) => new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g")
    ),
  ];

  for (const pattern of patterns) {
    output = output.replace(pattern, (value) => {
      const token = `TTTOKEN${values.length}END`;
      values.push(value);
      return token;
    });
  }

  return { output, values };
}

function restore(text, values) {
  const restored = values.reduce(
    (output, value, index) =>
      output.replaceAll(`TTTOKEN${index}END`, value),
    text
  );
  return restored.replace(/[\u200B-\u200D\uFEFF]/g, "");
}

async function translate(text, target) {
  const input = text.trim();
  if (!input || target === SOURCE_LOCALE) return text;

  const key = `${target}:${input}`;
  if (cache[key]) {
    const cleaned = cache[key].replace(/[\u200B-\u200D\uFEFF]/g, "");
    cache[key] = cleaned;
    return preserveOuterWhitespace(text, cleaned);
  }

  const { output, values } = protect(input);
  const url = new URL("https://translate.googleapis.com/translate_a/single");
  url.searchParams.set("client", "gtx");
  url.searchParams.set("sl", SOURCE_LOCALE);
  url.searchParams.set("tl", target);
  url.searchParams.set("dt", "t");
  url.searchParams.set("q", output);

  let lastError;
  for (let attempt = 0; attempt < 4; attempt += 1) {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const payload = await response.json();
      const translated = restore(
        payload[0].map((part) => part[0]).join(""),
        values
      );
      cache[key] = translated;
      return preserveOuterWhitespace(text, translated);
    } catch (error) {
      lastError = error;
      await new Promise((resolve) => setTimeout(resolve, 500 * (attempt + 1)));
    }
  }

  throw new Error(`Translation failed for ${target}: ${input}\n${lastError}`);
}

function preserveOuterWhitespace(original, translated) {
  const leading = original.match(/^\s*/)?.[0] ?? "";
  const trailing = original.match(/\s*$/)?.[0] ?? "";
  return `${leading}${translated.trim()}${trailing}`;
}

async function mapConcurrent(items, worker, concurrency = 6) {
  const results = new Array(items.length);
  let cursor = 0;

  async function run() {
    while (cursor < items.length) {
      const index = cursor;
      cursor += 1;
      results[index] = await worker(items[index], index);
    }
  }

  await Promise.all(Array.from({ length: concurrency }, run));
  return results;
}

function translatableBodyLine(line) {
  const trimmed = line.trim();
  if (!trimmed) return null;

  const callout = line.match(/^(\s*<Callout[^>]*title=")([^"]+)("[^>]*>\s*)$/);
  if (callout) {
    return { prefix: callout[1], text: callout[2], suffix: callout[3] };
  }

  if (/^<\/?[A-Z][^>]*>$/.test(trimmed)) return null;
  if (/^<!--/.test(trimmed)) return null;

  const markdown = line.match(
    /^(\s*(?:#{1,6}\s+|[-*+]\s+|\d+\.\s+|>\s+)?)(.*?)(\s*)$/
  );
  if (!markdown?.[2] || /^<\/?[A-Za-z]/.test(markdown[2])) return null;
  return { prefix: markdown[1], text: markdown[2], suffix: markdown[3] };
}

async function translateMdxFile(sourcePath, targetPath, target) {
  const raw = await fs.readFile(sourcePath, "utf8");
  const parsed = matter(raw);
  const data = { ...parsed.data };

  for (const key of ["title", "description", "category"]) {
    if (typeof data[key] === "string") data[key] = await translate(data[key], target);
  }

  if (Array.isArray(data.risk)) {
    data.risk = await mapConcurrent(data.risk, (value) => translate(value, target));
  }

  const lines = parsed.content.split(/\r?\n/);
  const candidates = lines
    .map((line, index) => ({ index, parsed: translatableBodyLine(line) }))
    .filter((item) => item.parsed);

  const translated = await mapConcurrent(candidates, async ({ index, parsed }) => ({
    index,
    value: `${parsed.prefix}${await translate(parsed.text, target)}${parsed.suffix}`,
  }));

  for (const item of translated) lines[item.index] = item.value;
  await fs.mkdir(path.dirname(targetPath), { recursive: true });
  await fs.writeFile(targetPath, matter.stringify(lines.join("\n"), data), "utf8");
}

function looksLikeUtilityClasses(value) {
  const tokens = value.split(/\s+/);
  return (
    tokens.length > 2 &&
    tokens.every((token) =>
      /^(?:[a-z]+:)*[-a-z0-9_[\]#/.:%]+$/i.test(token)
    ) &&
    tokens.some((token) => token.includes("-"))
  );
}

function shouldTranslatePhrase(value) {
  const text = value.replace(/\s+/g, " ").trim();
  if (text.length < 2 || text.length > 500) return false;
  if (!/[A-Za-z]/.test(text)) return false;
  if (/^(?:https?:|\/|@\/|[.#])/.test(text)) return false;
  if (/^[A-Z0-9_-]+$/.test(text) && !text.includes(" ")) return false;
  if (looksLikeUtilityClasses(text)) return false;
  return true;
}

async function sourceFiles(dir) {
  const output = [];
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) output.push(...(await sourceFiles(fullPath)));
    else if (/\.(?:ts|tsx)$/.test(entry.name)) output.push(fullPath);
  }
  return output;
}

async function collectSourcePhrases() {
  const phrases = new Set();
  const files = [
    ...(await sourceFiles(path.join(ROOT, "src", "app", "[locale]"))),
    ...(await sourceFiles(path.join(ROOT, "src", "components"))),
    path.join(ROOT, "src", "lib", "models.ts"),
    path.join(ROOT, "src", "lib", "powertrains.ts"),
    path.join(ROOT, "src", "lib", "search.ts"),
  ];

  for (const filePath of files) {
    const source = await fs.readFile(filePath, "utf8");
    const file = ts.createSourceFile(
      filePath,
      source,
      ts.ScriptTarget.Latest,
      true,
      filePath.endsWith("x") ? ts.ScriptKind.TSX : ts.ScriptKind.TS
    );

    function visit(node) {
      if (ts.isJsxText(node)) {
        const value = node.getText(file).replace(/\s+/g, " ").trim();
        if (shouldTranslatePhrase(value)) phrases.add(value);
      }

      if (
        ts.isStringLiteral(node) ||
        ts.isNoSubstitutionTemplateLiteral(node)
      ) {
        const parent = node.parent;
        const isImport =
          ts.isImportDeclaration(parent) ||
          ts.isExportDeclaration(parent) ||
          ts.isModuleSpecifier?.(parent);
        const propName =
          ts.isJsxAttribute(parent) && parent.name
            ? parent.name.getText(file)
            : ts.isPropertyAssignment(parent)
              ? parent.name.getText(file).replace(/['"]/g, "")
              : "";
        const excludedProps = new Set([
          "className",
          "href",
          "src",
          "sizes",
          "path",
          "slug",
          "heroImage",
          "image",
        ]);

        if (!isImport && !excludedProps.has(propName) && shouldTranslatePhrase(node.text)) {
          phrases.add(node.text.replace(/\s+/g, " ").trim());
        }
      }

      ts.forEachChild(node, visit);
    }

    visit(file);
  }

  return [...phrases].sort((a, b) => a.localeCompare(b));
}

async function generatePhraseCatalog(target) {
  const phrases = await collectSourcePhrases();
  const translations = await mapConcurrent(
    phrases,
    async (phrase) => [phrase, await translate(phrase, target)],
    8
  );
  await fs.mkdir(PHRASE_DIR, { recursive: true });
  await fs.writeFile(
    path.join(PHRASE_DIR, `${target}.json`),
    `${JSON.stringify(Object.fromEntries(translations), null, 2)}\n`,
    "utf8"
  );
  console.log(`${target}: ${translations.length} UI phrases`);
}

for (const target of TARGETS) {
  for (const type of CONTENT_TYPES) {
    const sourceDir = path.join(ROOT, "src", "content", SOURCE_LOCALE, type);
    const targetDir = path.join(ROOT, "src", "content", target, type);
    const files = (await fs.readdir(sourceDir)).filter((file) => /\.mdx?$/.test(file));

    for (const file of files) {
      await translateMdxFile(
        path.join(sourceDir, file),
        path.join(targetDir, file),
        target
      );
      console.log(`${target}/${type}/${file}`);
    }
  }

  await generatePhraseCatalog(target);
}

await fs.writeFile(CACHE_PATH, `${JSON.stringify(cache, null, 2)}\n`, "utf8");
console.log("Translation generation complete.");
