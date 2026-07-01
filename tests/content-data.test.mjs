import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import matter from "gray-matter";
import ts from "typescript";

const root = process.cwd();
const locales = ["en", "nl", "ar"];
const contentTypes = ["blog", "insights"];

function source(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

function files(relativeDir, extension = ".mdx") {
  const dir = path.join(root, relativeDir);
  return fs.readdirSync(dir).filter((name) => name.endsWith(extension)).sort();
}

function literalProperties(relativePath, arrayName, propertyName) {
  const filePath = path.join(root, relativePath);
  const text = fs.readFileSync(filePath, "utf8");
  const ast = ts.createSourceFile(filePath, text, ts.ScriptTarget.Latest, true);
  const values = [];

  function visit(node) {
    if (
      ts.isVariableDeclaration(node) &&
      node.name.getText(ast) === arrayName &&
      node.initializer &&
      ts.isArrayLiteralExpression(node.initializer)
    ) {
      for (const element of node.initializer.elements) {
        if (!ts.isObjectLiteralExpression(element)) continue;
        const property = element.properties.find(
          (item) =>
            ts.isPropertyAssignment(item) &&
            item.name.getText(ast).replaceAll('"', "").replaceAll("'", "") === propertyName
        );
        if (property && ts.isPropertyAssignment(property) && ts.isStringLiteral(property.initializer)) {
          values.push(property.initializer.text);
        }
      }
    }
    ts.forEachChild(node, visit);
  }

  visit(ast);
  return values;
}

function assertUnique(values, label) {
  assert.equal(new Set(values).size, values.length, `${label} must be unique`);
}

test("all localized MDX has valid required frontmatter and translation parity", () => {
  for (const type of contentTypes) {
    const englishFiles = files(`src/content/en/${type}`);
    for (const locale of locales) {
      const localizedFiles = files(`src/content/${locale}/${type}`);
      assert.deepEqual(localizedFiles, englishFiles, `${locale}/${type} must match English slugs`);

      for (const filename of localizedFiles) {
        const raw = source(`src/content/${locale}/${type}/${filename}`);
        const { data, content } = matter(raw);
        assert.equal(typeof data.title, "string", `${locale}/${type}/${filename} needs title`);
        assert.ok(data.title.trim().length >= 10, `${locale}/${type}/${filename} title is too short`);
        assert.equal(typeof data.description, "string", `${locale}/${type}/${filename} needs description`);
        assert.ok(data.description.trim().length >= 40, `${locale}/${type}/${filename} description is too short`);
        assert.match(String(data.date), /^\d{4}-\d{2}-\d{2}$/, `${locale}/${type}/${filename} needs YYYY-MM-DD date`);
        assert.ok(!Number.isNaN(Date.parse(data.date)), `${locale}/${type}/${filename} has invalid date`);
        assert.ok(content.trim().length >= 400, `${locale}/${type}/${filename} content is too thin`);
        if (data.image?.startsWith("/")) {
          assert.ok(fs.existsSync(path.join(root, "public", data.image)), `${filename} image is missing`);
        }
      }
    }
  }
});

test("fault-code and comparison datasets are expanded and unique", () => {
  const codes = literalProperties("src/lib/faultCodes.ts", "faultCodes", "code");
  const comparisons = literalProperties("src/lib/comparisons.ts", "directComparisons", "slug");
  assert.ok(codes.length >= 73, `expected at least 73 fault codes, found ${codes.length}`);
  assert.ok(comparisons.length >= 24, `expected at least 24 comparisons, found ${comparisons.length}`);
  assertUnique(codes.map((code) => code.toUpperCase()), "fault codes");
  assertUnique(comparisons, "comparison slugs");
  for (const code of codes) assert.match(code, /^[A-Z][A-Z0-9]{3,6}$/);
});

test("model hero mappings are unique and local assets exist", () => {
  const text = source("src/lib/models.ts");
  const match = text.match(/const MODEL_HERO_IMAGES = \{([\s\S]*?)\} as const;/);
  assert.ok(match, "MODEL_HERO_IMAGES mapping not found");
  const mappings = [...match[1].matchAll(/"([^"]+)":\s*"([^"]+)"/g)].map((item) => ({
    slug: item[1],
    image: item[2],
  }));
  assert.ok(mappings.length >= 30, "expected model hero mappings");
  assertUnique(mappings.map((item) => item.image), "model hero images");
  for (const { slug, image } of mappings) {
    if (image.startsWith("/")) {
      assert.ok(fs.existsSync(path.join(root, "public", image)), `${slug} local hero is missing`);
    } else {
      assert.match(image, /^https:\/\//, `${slug} hero must be HTTPS or local`);
    }
  }
});

test("MDX internal links target a known route", () => {
  const staticRoutes = new Set([
    "/", "/about", "/blog", "/brands", "/buying-checklist", "/buying-guides",
    "/compare", "/contact", "/fault-codes", "/how-we-evaluate-used-cars", "/insights",
    "/maintenance-cost", "/models", "/model-years", "/parts-failure-map", "/powertrains",
    "/reliability-index", "/search", "/tools",
  ]);
  const dynamic = [
    ["/models/", literalProperties("src/lib/models.ts", "modelPages", "slug")],
    ["/compare/", literalProperties("src/lib/comparisons.ts", "directComparisons", "slug")],
    ["/fault-codes/", literalProperties("src/lib/faultCodes.ts", "faultCodes", "code").map((v) => v.toLowerCase())],
    ["/powertrains/", literalProperties("src/lib/powertrains.ts", "powertrains", "slug")],
    ["/model-years/", literalProperties("src/lib/modelYears.ts", "modelYears", "slug")],
    ["/parts-failure-map/", literalProperties("src/lib/partsFailureMap.ts", "partsFailureItems", "slug")],
  ];
  for (const [prefix, slugs] of dynamic) for (const slug of slugs) staticRoutes.add(`${prefix}${slug}`);
  for (const type of contentTypes) {
    for (const filename of files(`src/content/en/${type}`)) {
      const slug = filename.replace(/\.mdx$/, "");
      staticRoutes.add(`/${type}/${slug}`);
    }
  }

  for (const type of contentTypes) {
    for (const filename of files(`src/content/en/${type}`)) {
      const raw = source(`src/content/en/${type}/${filename}`);
      for (const match of raw.matchAll(/\[[^\]]+\]\((\/[^)\s#?]+)[^)]*\)/g)) {
        const target = match[1].replace(/\/$/, "") || "/";
        assert.ok(staticRoutes.has(target), `${type}/${filename} links to unknown route ${target}`);
      }
    }
  }
});
