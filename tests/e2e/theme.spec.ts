import { test, expect } from "./fixtures";

const theme = (page: import("@playwright/test").Page) => page.evaluate(() => document.documentElement.getAttribute("data-theme"));

test.describe("ThemeToggle a useTheme", () => {
  test("výchozí režim sleduje systém a tlačítko cykluje system → light → dark → system", async ({ page }) => {
    await page.goto("/#uvod");
    await expect.poll(() => theme(page)).toBe("dark"); // systém je tmavý
    const btn = page.locator(".demo-topbar .cbb-theme-btn");
    await btn.click(); await expect.poll(() => theme(page)).toBe("light");
    await btn.click(); await expect.poll(() => theme(page)).toBe("dark");
    await btn.click();
    expect(await page.evaluate(() => localStorage.getItem("cbb-theme"))).toBe("system");
  });

  test("volba přežije obnovení stránky", async ({ page }) => {
    await page.goto("/#uvod");
    await page.evaluate(() => localStorage.setItem("cbb-theme", "light"));
    await page.reload();
    await expect.poll(() => theme(page)).toBe("light");
  });

  test("režim „system“ reaguje na změnu systémového nastavení za běhu", async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem("cbb-theme", "system"));
    await page.emulateMedia({ colorScheme: "light" });
    await page.goto("/#uvod");
    await expect.poll(() => theme(page)).toBe("light");
    await page.emulateMedia({ colorScheme: "dark" });
    await expect.poll(() => theme(page)).toBe("dark");
  });

  test("režim opravdu změní barvy (pozadí je světlé a tmavé)", async ({ page }) => {
    const bg = () => page.evaluate(() => getComputedStyle(document.querySelector(".demo-root")!).backgroundColor);
    await page.addInitScript(() => { if (!localStorage.getItem("cbb-theme")) localStorage.setItem("cbb-theme", "light"); });
    await page.goto("/#uvod");
    expect(await bg()).toBe("rgb(250, 250, 249)");
    await page.evaluate(() => localStorage.setItem("cbb-theme", "dark"));
    await page.reload();
    expect(await bg()).toBe("rgb(10, 10, 10)");
  });
});

test.describe("CommandPalette", () => {
  const openPalette = async (page: import("@playwright/test").Page) => {
    await page.goto("/#commandpalette");
    const s = page.locator("#commandpalette");
    await s.scrollIntoViewIfNeeded();
    await s.getByRole("button", { name: "Otevřít paletu" }).click();
    await expect(page.locator(".cbb-cmd")).toBeVisible();
    return s;
  };

  test("po otevření je fokus v poli a vidět všechny příkazy ve skupinách", async ({ page }) => {
    await openPalette(page);
    expect(await page.evaluate(() => document.activeElement?.className.includes("cbb-cmd__input"))).toBe(true);
    await expect(page.locator(".cbb-cmd__item")).toHaveCount(7);
    await expect(page.locator(".cbb-cmd__group")).toHaveCount(3);
  });

  test("hledá bez diakritiky a podle klíčových slov a Enter provede příkaz", async ({ page }) => {
    await openPalette(page);
    await page.keyboard.type("tmavy");
    await expect(page.locator(".cbb-cmd__item")).toHaveCount(1);
    await expect(page.locator(".cbb-cmd__item")).toContainText("Tmavý");
    await page.keyboard.press("Enter");
    await expect(page.locator(".cbb-cmd")).toHaveCount(0); // closeOnSelect
    await expect.poll(() => theme(page)).toBe("dark");
    await page.getByRole("button", { name: "Otevřít paletu" }).click();
    await page.keyboard.type("noc"); // klíčové slovo, které není v popisku
    await expect(page.locator(".cbb-cmd__item")).toHaveCount(1);
  });

  test("prázdný výsledek ukáže hlášku a nedostupný příkaz nejde provést", async ({ page }) => {
    await openPalette(page);
    await page.keyboard.type("zzzz");
    await expect(page.locator(".cbb-cmd__empty")).toHaveCount(1);
    await page.keyboard.press("Control+a"); await page.keyboard.type("neda");
    await page.keyboard.press("Enter");
    await expect(page.locator(".cbb-cmd")).toHaveCount(1); // zůstane otevřená
  });

  test("šipky posouvají výběr, Tab nevyskočí z palety, Esc zavře", async ({ page }) => {
    await openPalette(page);
    await page.keyboard.press("ArrowDown"); await page.keyboard.press("ArrowDown");
    await expect(page.locator(".cbb-cmd__item.is-active")).toContainText("Světlý");
    for (let i = 0; i < 6; i++) {
      await page.keyboard.press("Tab");
      expect(await page.evaluate(() => !!document.activeElement?.closest(".cbb-cmd")), `Tab ${i + 1}`).toBe(true);
    }
    await page.keyboard.press("Escape");
    await expect(page.locator(".cbb-cmd")).toHaveCount(0);
  });

  test("zkratka Ctrl+J paletu otevře a znovu zavře", async ({ page }) => {
    await page.goto("/#commandpalette");
    await page.keyboard.press("Control+j");
    await expect(page.locator(".cbb-cmd")).toHaveCount(1);
    await page.keyboard.press("Control+j");
    await expect(page.locator(".cbb-cmd")).toHaveCount(0);
  });
});

test("useHotkey reaguje na Shift+H", async ({ page }) => {
  await page.goto("/#usehotkey");
  await page.locator("#usehotkey").scrollIntoViewIfNeeded();
  await page.keyboard.press("Shift+H"); await page.keyboard.press("Shift+H");
  await expect(page.locator("#usehotkey .demo-mono")).toContainText("2×");
});
