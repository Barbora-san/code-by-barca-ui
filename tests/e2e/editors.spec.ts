import { test, expect } from "./fixtures";

test.describe("MarkdownEditor", () => {
  const setup = async (page: import("@playwright/test").Page) => {
    await page.goto("/#markdowneditor");
    const s = page.locator("#markdowneditor");
    const ta = s.locator("textarea");
    await ta.scrollIntoViewIfNeeded();
    const select = (a: number, b: number) => ta.evaluate((el: HTMLTextAreaElement, [x, y]) => { el.focus(); el.setSelectionRange(x, y); }, [a, b]);
    return { s, ta, select };
  };

  test("tučné, kurzíva a odkaz obalí výběr a druhé kliknutí značky odebere", async ({ page }) => {
    const { s, ta, select } = await setup(page);
    await ta.fill("slovo"); await select(0, 5);
    await s.getByRole("button", { name: /Tučné/ }).click();
    await expect(ta).toHaveValue("**slovo**");
    await s.getByRole("button", { name: /Tučné/ }).click();
    await expect(ta).toHaveValue("slovo");
    await select(0, 5); await page.keyboard.press("Control+i");
    await expect(ta).toHaveValue("*slovo*");
    await ta.fill("a"); await select(1, 1);
    await s.getByRole("button", { name: "Odkaz (Ctrl+K)" }).click();
    await expect(ta).toHaveValue("a[text odkazu](https://)");
    expect(await ta.evaluate((el: HTMLTextAreaElement) => el.value.slice(el.selectionStart, el.selectionEnd))).toBe("https://"); // URL je označená k přepsání
  });

  test("seznamy a nadpisy se aplikují na všechny vybrané řádky a přepínají", async ({ page }) => {
    const { s, ta, select } = await setup(page);
    await ta.fill("r1\nr2"); await select(0, 5);
    await s.getByRole("button", { name: "Odrážky" }).click();
    await expect(ta).toHaveValue("- r1\n- r2");
    await s.getByRole("button", { name: "Odrážky" }).click();
    await expect(ta).toHaveValue("r1\nr2");
    await s.getByRole("button", { name: "Číslovaný seznam" }).click();
    await expect(ta).toHaveValue("1. r1\n2. r2");
    await s.getByRole("button", { name: "Nadpis 2" }).click(); // nahradí předchozí předponu
    await expect(ta).toHaveValue("## r1\n## r2");
  });

  test("Enter v seznamu pokračuje, na prázdné položce seznam ukončí", async ({ page }) => {
    const { ta, select } = await setup(page);
    await ta.fill("- a"); await select(3, 3);
    await page.keyboard.press("Enter");
    await expect(ta).toHaveValue("- a\n- ");
    await page.keyboard.press("Enter");
    await expect(ta).toHaveValue("- a\n");
    await ta.fill("1. a"); await select(4, 4);
    await page.keyboard.press("Enter");
    await expect(ta).toHaveValue("1. a\n2. ");
  });

  test("náhled je bezpečný, lišta se v něm vypne a text se zachová", async ({ page }) => {
    const { s, ta } = await setup(page);
    await ta.fill("Ahoj **svět** <script>alert(1)</script> [x](javascript:alert(1)) *k* H~2~O");
    await s.getByRole("tab", { name: "Náhled" }).click();
    const html = await s.locator(".cbb-md").innerHTML();
    expect(html).toContain("<strong>svět</strong>");
    expect(html).toContain("<em>k</em>");
    expect(html).toContain("<sub>2</sub>");
    expect(html).not.toContain("<script");
    expect(html).not.toMatch(/href="javascript/i);
    await expect(s.getByRole("button", { name: /Tučné/ })).toBeDisabled();
    await s.getByRole("tab", { name: "Psát" }).click();
    expect(await ta.inputValue()).toContain("Ahoj **svět**");
  });
});

test("MarkdownView: ukázka s nebezpečným vstupem nic nespustí a externí odkaz je zabezpečený", async ({ page }) => {
  await page.goto("/#markdownview");
  const html = await page.locator("#markdownview .demo-preview").innerHTML();
  expect(html).not.toMatch(/<script|<img[^>]*onerror/i);
  expect(html).toContain('rel="noopener noreferrer"');
  expect(html).toContain("<ul>");
  expect(html).toContain("<blockquote>");
});

test.describe("TableEditor", () => {
  const setup = async (page: import("@playwright/test").Page) => {
    await page.goto("/#tableeditor");
    const s = page.locator("#tableeditor");
    await s.scrollIntoViewIfNeeded();
    const cell = (r: number, c: number) => s.locator(`[data-r="${r}"][data-c="${c}"]`);
    const json = async () => JSON.parse(await s.locator("pre.demo-mono").innerText()) as { headers: string[]; rows: string[][] };
    const at = () => page.evaluate(() => [Number((document.activeElement as HTMLElement).dataset.r), Number((document.activeElement as HTMLElement).dataset.c)]);
    return { s, cell, json, at };
  };

  test("úprava buněk a záhlaví", async ({ page }) => {
    const { cell, json } = await setup(page);
    await cell(0, 0).fill("Vue");
    expect((await json()).rows[0][0]).toBe("Vue");
    await cell(-1, 2).fill("Let");
    expect((await json()).headers[2]).toBe("Let");
  });

  test("šipky a Enter se pohybují po řádcích, Enter na posledním řádku přidá nový", async ({ page }) => {
    const { cell, json, at } = await setup(page);
    await cell(0, 1).focus(); await page.keyboard.press("ArrowDown");
    expect(await at()).toEqual([1, 1]);
    await page.keyboard.press("ArrowUp"); await page.keyboard.press("ArrowUp");
    expect(await at()).toEqual([-1, 1]); // až do záhlaví
    await cell(2, 2).focus(); await page.keyboard.press("Enter");
    await expect.poll(async () => (await json()).rows.length).toBe(4);
    expect(await at()).toEqual([3, 2]);
  });

  test("přidání a odebrání sloupce i řádku drží tabulku pravidelnou", async ({ page }) => {
    const { s, json, at } = await setup(page);
    await s.getByRole("button", { name: "Sloupec", exact: true }).click();
    let j = await json();
    expect(j.headers).toHaveLength(4);
    expect(j.rows.every((r) => r.length === 4)).toBe(true);
    expect(await at()).toEqual([-1, 3]); // fokus na názvu nového sloupce
    await s.getByRole("button", { name: /Odebrat sloupec: Roky/ }).click();
    j = await json();
    expect(j.headers).toHaveLength(3);
    expect(j.rows.every((r) => r.length === 3)).toBe(true);
    await s.getByRole("button", { name: "Odebrat řádek 3" }).click();
    expect((await json()).rows).toHaveLength(2);
  });

  test("vložení z Excelu rozšíří tabulku a názvy sloupců se neopakují", async ({ page }) => {
    const { s, cell, json } = await setup(page);
    await cell(1, 1).focus();
    await page.evaluate(() => {
      const dt = new DataTransfer();
      dt.setData("text/plain", "a\tb\tc\nd\te\tf\ng\th\ti\nj\tk\tl\n");
      document.activeElement!.dispatchEvent(new ClipboardEvent("paste", { clipboardData: dt, bubbles: true, cancelable: true }));
    });
    await expect.poll(async () => (await json()).rows.length).toBe(5); // řádek 1 + 4 vložené řádky
    const j = await json();
    expect(j.headers).toHaveLength(4); // 3 původní + 1 nový (vložení začíná ve 2. sloupci)
    expect(new Set(j.headers).size).toBe(4);
    expect(j.rows[1].slice(1)).toEqual(["a", "b", "c"]);
    expect(j.rows[4].slice(1)).toEqual(["j", "k", "l"]);
    await expect(s.locator("pre.demo-mono")).toBeVisible();
  });
});
