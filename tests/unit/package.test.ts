import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { createRequire } from "node:module";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { describe, expect, it } from "vitest";
import * as srcExports from "../../src";

/**
 * Tyto testy kontrolují SESTAVENOU knihovnu ve složce dist (to, co se publikuje na npm).
 * Spouštějí se až po `npm run build` (to zajišťuje skript `npm test`).
 */
const root = join(__dirname, "../..");
const pkg = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));
const read = (p: string) => readFileSync(join(root, p), "utf8");

const targets = (v: unknown): string[] =>
  typeof v === "string" ? [v] : v && typeof v === "object" ? Object.values(v).flatMap(targets) : [];

describe("package.json", () => {
  it("každý soubor uvedený v exports, main, module a types existuje", () => {
    const all = [...targets(pkg.exports), pkg.main, pkg.module, pkg.types].filter((p) => typeof p === "string" && p !== "./package.json");
    expect(all.length).toBeGreaterThan(4);
    for (const p of all) expect(existsSync(join(root, p)), p).toBe(true);
  });
  it("každá položka v files existuje", () => {
    for (const f of pkg.files) expect(existsSync(join(root, f)), f).toBe(true);
  });
  it("react a react-dom jsou peer závislosti, ne běžné závislosti", () => {
    expect(pkg.peerDependencies.react).toBeTruthy();
    expect(pkg.dependencies ?? {}).toEqual({});
  });
});

describe("sestavená knihovna (dist)", () => {
  it("ESM i CJS balíček má na prvním řádku \"use client\"", () => {
    for (const f of ["dist/index.js", "dist/index.cjs"]) expect(read(f).trimStart().startsWith('"use client"'), f).toBe(true);
  });

  it("ESM a CJS vystavují stejné názvy jako zdroj (src/index.ts)", async () => {
    const esm = await import(pathToFileURL(join(root, "dist/index.js")).href);
    const cjs = createRequire(import.meta.url)(join(root, "dist/index.cjs"));
    const want = Object.keys(srcExports).sort();
    expect(Object.keys(esm).sort()).toEqual(want);
    expect(Object.keys(cjs).filter((k) => k !== "default" && k !== "__esModule").sort()).toEqual(want);
  });

  it("typové deklarace obsahují nové komponenty", () => {
    const d = read("dist/index.d.ts");
    for (const n of ["MarkdownEditor", "TableEditor", "CommandPalette", "ThemeToggle", "useTheme", "TableData"]) expect(d, n).toContain(n);
  });
});

describe("styles.css", () => {
  const css = () => read("dist/styles.css");
  it("má vyvážené složené závorky", () => {
    const c = css().replace(/\/\*[\s\S]*?\*\//g, "");
    expect(c.split("{").length).toBe(c.split("}").length);
  });
  it("obsahuje světlé i tmavé téma a nepoužívá Tailwind", () => {
    expect(css()).toContain('[data-theme="light"]');
    expect(css()).toContain('[data-theme="dark"]');
    expect(css()).not.toMatch(/@tailwind|@apply/);
  });
  it("všechny barevné tokeny, které se používají, jsou definované", () => {
    const c = css();
    const used = new Set([...c.matchAll(/var\((--cbb-[a-z0-9-]+)/g)].map((m) => m[1]));
    const defined = new Set([...c.matchAll(/(--cbb-[a-z0-9-]+)\s*:/g)].map((m) => m[1]));
    // Tokeny nastavované jen za běhu (z JavaScriptu nebo lokálně na prvku) se tu nehlídají.
    const runtime = /^--cbb-(px|py|o|fill|rating-size|seek|spin-|marquee|tilt|ms-|i$|d$|n$|t$|x$|y$|w$|h$)/;
    const missing = [...used].filter((t) => !defined.has(t) && !runtime.test(t));
    expect(missing).toEqual([]);
  });
  // Třídy, které záměrně nemají vlastní pravidlo: stylují se přes rodiče (např. `.cbb-toast button`,
  // `.cbb-cmd kbd`) nebo slouží jen jako kotva pro uživatelovo CSS. Nová třída sem nepatří – dostala by pravidlo.
  const HOOK_ONLY = new Set([
    "cbb-alertbar__text", "cbb-chip__text", "cbb-code__line", "cbb-cmd__esc", "cbb-cmd__kbd", "cbb-filterbar__search",
    "cbb-flip__front", "cbb-info__text", "cbb-heading__text", "cbb-heading__action", "cbb-skill__level", "cbb-spin__label", "cbb-toast__close",
    "cbb-fp__seek", "cbb-pq__section",
    // není třída, ale výchozí klíč v localStorage:
    "cbb-player-volume",
  ]);
  it("každá třída cbb-… zapsaná přímo v komponentě má pravidlo v CSS", () => {
    const walk = (d: string): string[] => readdirSync(d).flatMap((f) => (statSync(join(d, f)).isDirectory() ? walk(join(d, f)) : f.endsWith(".tsx") ? [join(d, f)] : []));
    const css = read("dist/styles.css");
    const missing = new Set<string>();
    for (const file of walk(join(root, "src"))) {
      for (const m of readFileSync(file, "utf8").matchAll(/["'`\s]((?:cbb-)[a-z0-9_-]+)(?=["'`\s])/g)) {
        if (!css.includes("." + m[1]) && !HOOK_ONLY.has(m[1])) missing.add(`${file.replace(root + "/", "")}: ${m[1]}`);
      }
    }
    expect([...missing]).toEqual([]);
  });
});
