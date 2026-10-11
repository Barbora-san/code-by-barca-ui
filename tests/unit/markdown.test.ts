import { describe, expect, it } from "vitest";
import { markdownToHtml } from "../../src/lib/markdown";

describe("markdownToHtml – formátování", () => {
  it("převede nadpisy, tučné, kurzívu a obojí", () => {
    expect(markdownToHtml("## N")).toBe("<h2>N</h2>");
    expect(markdownToHtml("**a** *b* ***c***")).toBe("<p><strong>a</strong> <em>b</em> <strong><em>c</em></strong></p>");
  });
  it("převede horní a dolní index a kód", () => {
    expect(markdownToHtml("H~2~O x^2^ `k`")).toBe("<p>H<sub>2</sub>O x<sup>2</sup> <code>k</code></p>");
  });
  it("hvězdičky obklopené mezerami nejsou kurzíva (2 * 3 * 4)", () => {
    expect(markdownToHtml("2 * 3 * 4")).toBe("<p>2 * 3 * 4</p>");
  });
  it("seskupí odrážky a číslované položky do jednoho seznamu", () => {
    expect(markdownToHtml("- a\n- b")).toBe("<ul><li>a</li><li>b</li></ul>");
    expect(markdownToHtml("1. a\n2. b")).toBe("<ol><li>a</li><li>b</li></ol>");
  });
  it("změna typu seznamu začne nový seznam", () => {
    expect(markdownToHtml("- a\n1. b")).toBe("<ul><li>a</li></ul><ol><li>b</li></ol>");
  });
  it("citace a odstavce se zalomením", () => {
    expect(markdownToHtml("> c")).toBe("<blockquote><p>c</p></blockquote>");
    expect(markdownToHtml("a\nb\n\nc")).toBe("<p>a<br />b</p><p>c</p>");
  });
  it("obrázek se nezamění za odkaz", () => {
    expect(markdownToHtml("![popis](https://x.cz/a.png)")).toContain('<img src="https://x.cz/a.png" alt="popis"');
    expect(markdownToHtml("![popis](https://x.cz/a.png)")).not.toContain("<a ");
  });
  it("značky uvnitř kódu se nezpracují", () => {
    expect(markdownToHtml("`**a**`")).toBe("<p><code>**a**</code></p>");
  });
  it("prázdný vstup vrátí prázdný řetězec", () => {
    expect(markdownToHtml("")).toBe("");
    expect(markdownToHtml("\n\n")).toBe("");
  });
});

describe("markdownToHtml – bezpečnost", () => {
  it("HTML ve vstupu se escapuje", () => {
    const html = markdownToHtml("<script>alert(1)</script> <img src=x onerror=alert(1)>");
    expect(html).not.toContain("<script");
    expect(html).not.toContain("<img");
    expect(html).toContain("&lt;script&gt;");
  });
  it.each(["javascript:alert(1)", "JaVaScRiPt:alert(1)", "data:text/html;base64,AAAA", "vbscript:x"])(
    "odkaz s nebezpečným schématem %s se nevykreslí jako odkaz",
    (url) => {
      const html = markdownToHtml(`[x](${url})`);
      expect(html).not.toContain("<a ");
      expect(html).not.toContain("href=");
    }
  );
  it("obrázek s nebezpečným schématem se nevykreslí", () => {
    expect(markdownToHtml("![x](javascript:alert(1))")).not.toContain("<img");
  });
  it("uvozovka v adrese nemůže vyskočit z atributu", () => {
    const html = markdownToHtml('[x](https://a.cz/"onmouseover="alert(1))');
    // Atribut href musí zůstat jeden uzavřený řetězec, za ním smí být jen target a rel.
    expect(html).toMatch(/^<p><a href="[^"]*"( target="_blank" rel="noopener noreferrer")?>x<\/a>/);
    expect(html).not.toContain('" onmouseover');
    expect(html).toContain("&quot;");
  });
  it("& v adrese se escapuje právě jednou", () => {
    expect(markdownToHtml("[t](https://a.cz/?a=1&b=2)")).toContain('href="https://a.cz/?a=1&amp;b=2"');
  });
  it("povolí http, https, mailto, tel, relativní a kotvy", () => {
    for (const u of ["https://a.cz", "http://a.cz", "mailto:a@b.cz", "tel:+420123", "/cesta", "#kotva", "./x", "x/y"]) {
      expect(markdownToHtml(`[t](${u})`), u).toContain("<a href=");
    }
  });
  it("externí odkaz má rel noopener noreferrer, interní ne", () => {
    expect(markdownToHtml("[t](https://a.cz)")).toContain('rel="noopener noreferrer"');
    expect(markdownToHtml("[t](/a)")).not.toContain("rel=");
  });
});
