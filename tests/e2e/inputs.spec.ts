import { test, expect } from "./fixtures";

const open = async (page: import("@playwright/test").Page, id: string) => {
  await page.goto(`/#${id}`);
  const s = page.locator(`#${id}`);
  await s.scrollIntoViewIfNeeded();
  return s;
};

test.describe("NumberInput", () => {
  test("tlačítka, šipky, omezení min/max a zaokrouhlení", async ({ page }) => {
    const s = await open(page, "numberinput");
    const a = s.locator("input[role=spinbutton]").nth(0); // min 0, max 10, výchozí 2
    await s.locator("button[aria-label=Zvýšit]").nth(0).click();
    await expect(a).toHaveValue("3");
    await a.fill("15"); await a.blur();
    await expect(a).toHaveValue("10"); // omezení na max
    await a.focus(); await page.keyboard.press("ArrowDown");
    await expect(a).toHaveValue("9");
    await page.keyboard.press("Shift+ArrowDown"); // Shift = krok 10×
    await expect(a).toHaveValue("0"); // omezení na min
    await expect(s.locator("button[aria-label=Snížit]").nth(0)).toBeDisabled();
    const b = s.locator("input[role=spinbutton]").nth(1); // krok 0,1
    await b.fill("3,456"); await b.blur();
    await expect(b).toHaveValue("3,5"); // desetinná čárka a zaokrouhlení
    await a.fill("abc");
    await expect(a).not.toHaveValue("abc"); // písmena se nepřijmou
  });
});

test.describe("PasswordInput", () => {
  test("zobrazení hesla a chybová hláška", async ({ page }) => {
    const s = await open(page, "passwordinput");
    const pw = s.locator("input").first();
    await expect(pw).toHaveAttribute("type", "password");
    await s.locator(".cbb-pw__toggle").click();
    await expect(pw).toHaveAttribute("type", "text");
    await pw.fill("abc");
    await expect(s.locator(".cbb-field__error")).toHaveCount(1); // kratší než 8 znaků
  });
});

test.describe("Rating", () => {
  test("klik, zrušení, šipky, půlhvězdy, jen pro čtení", async ({ page }) => {
    const s = await open(page, "rating");
    const r = s.locator(".cbb-rating");
    const box = (await r.nth(0).boundingBox())!;
    await page.mouse.click(box.x + box.width * 0.9, box.y + box.height / 2);
    await expect(r.nth(0)).toHaveAttribute("aria-valuenow", "5");
    await page.mouse.click(box.x + box.width * 0.9, box.y + box.height / 2); // znovu na stejnou = zrušit
    await expect(r.nth(0)).toHaveAttribute("aria-valuenow", "0");
    await r.nth(0).focus();
    await page.keyboard.press("ArrowRight"); await page.keyboard.press("ArrowRight");
    await expect(r.nth(0)).toHaveAttribute("aria-valuenow", "2");
    const box2 = (await r.nth(1).boundingBox())!;
    await page.mouse.click(box2.x + box2.width * 0.5 - 3, box2.y + box2.height / 2);
    expect(["2", "2.5", "3"]).toContain(await r.nth(1).getAttribute("aria-valuenow"));
    await expect(r.nth(2)).toHaveAttribute("role", "img"); // readOnly není ovladatelný slider
  });
});

test.describe("MultiSelect", () => {
  test("výběr, filtr, Backspace, Esc a limity", async ({ page }) => {
    const s = await open(page, "multiselect");
    const ms = s.locator(".cbb-multi").nth(0);
    await ms.locator("input").click();
    await expect(page.locator(".cbb-multi__panel")).toHaveCount(1);
    await page.locator(".cbb-multi__opt", { hasText: "Docker" }).click();
    await expect(ms.locator(".cbb-multi__chip", { hasText: "Docker" })).toHaveCount(1);
    await expect(page.locator(".cbb-multi__panel")).toHaveCount(1); // panel zůstává otevřený
    await ms.locator("input").fill("pyth");
    await expect(page.locator(".cbb-multi__opt")).toHaveCount(1);
    await ms.locator("input").fill(""); await page.keyboard.press("Backspace");
    await expect(ms.locator(".cbb-multi__chip", { hasText: "Docker" })).toHaveCount(0); // odebere poslední
    await page.keyboard.press("Escape");
    await expect(page.locator(".cbb-multi__panel")).toHaveCount(0);
    const ms2 = s.locator(".cbb-multi").nth(1); // max 2, maxChips 1
    await ms2.locator("input").click();
    await page.locator(".cbb-multi__opt", { hasText: "Python" }).click();
    expect(await page.locator(".cbb-multi__opt[aria-disabled=true]").count()).toBeGreaterThanOrEqual(5);
    await expect(ms2.locator(".cbb-multi__chip.is-more")).toHaveText("+1");
  });
});

test.describe("hooky", () => {
  test("focus trap v dialogu drží Tab i Shift+Tab uvnitř", async ({ page }) => {
    const s = await open(page, "usedisclosure");
    await s.getByRole("button", { name: "Otevřít dialog" }).click();
    await expect(page.locator("[role=dialog][aria-modal=true]")).toBeVisible();
    const inside = () => page.evaluate(() => !!document.activeElement?.closest("[role=dialog][aria-modal=true]"));
    for (let i = 0; i < 8; i++) { await page.keyboard.press("Tab"); expect(await inside(), `Tab ${i + 1}`).toBe(true); }
    for (let i = 0; i < 5; i++) { await page.keyboard.press("Shift+Tab"); expect(await inside(), `Shift+Tab ${i + 1}`).toBe(true); }
    await page.keyboard.press("Escape");
    await expect(page.locator("[role=dialog][aria-modal=true]")).toHaveCount(0);
  });

  test("useLocalStorage přežije obnovení stránky", async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => localStorage.removeItem("cbb-demo-counter"));
    const s = await open(page, "uselocalstorage");
    const btn = s.getByRole("button", { name: /Kliknuto/ });
    await btn.click(); await btn.click();
    await page.reload();
    await s.scrollIntoViewIfNeeded();
    await expect(s.getByRole("button", { name: /Kliknuto/ })).toContainText("2");
  });

  test("useDebounce zpozdí hodnotu", async ({ page }) => {
    const s = await open(page, "usedebounce");
    await s.locator("input").fill("ahoj");
    await expect(s.locator(".demo-mono")).toContainText("po prodlevě: „“"); // hned po psaní ještě prázdné
    await expect(s.locator(".demo-mono")).toContainText("po prodlevě: „ahoj“"); // po prodlevě naplněné
  });
});
