import { test, expect } from "./fixtures";
import type { Page } from "@playwright/test";

/** Demo vyrábí skladby přímo v prohlížeči (5 smyček dlouhých 22 až 34 s), proto nejsou potřeba žádné soubory. */
const TITLES = ["Neon Kód", "Pull Request", "Noční build", "Hot Reload", "Merge Conflict"];

const setup = async (page: Page, id = "musicplayer") => {
  await page.goto(`/#${id}`);
  const s = page.locator(`#${id}`);
  await s.scrollIntoViewIfNeeded();
  const mini = s.locator(".cbb-mp");
  const row = (i: number) => s.locator(".demo-trackrow").nth(i);
  const playIndex = async (i: number) => {
    await row(i).locator(".demo-trackrow__main").click();
    await expect(mini.locator(".cbb-mp__title")).toHaveText(TITLES[i]!);
    await expect(mini.locator(".cbb-mp__play")).toHaveAccessibleName("Pozastavit"); // opravdu hraje
  };
  const seek = mini.locator(".cbb-seek");
  const now = async () => Number(await seek.getAttribute("aria-valuenow"));
  return { s, mini, row, playIndex, seek, now };
};

test.describe("MusicPlayer: základní ovládání", () => {
  test("mini lišta se zobrazí až po spuštění skladby a čas běží", async ({ page }) => {
    const { s, mini, playIndex, now } = await setup(page);
    await expect(mini).toHaveCount(0); // nic nehraje, nic se nevykresluje
    await playIndex(0);
    await expect(s.locator(".cbb-mp__artist")).toHaveText("Barca Beats");
    await expect.poll(now, { timeout: 8000 }).toBeGreaterThan(0);
  });

  test("pozastavení a pokračování", async ({ page }) => {
    const { mini, playIndex, now } = await setup(page);
    await playIndex(0);
    await mini.locator(".cbb-mp__play").click();
    await expect(mini.locator(".cbb-mp__play")).toHaveAccessibleName("Přehrát");
    const frozen = await now();
    await page.waitForTimeout(1200);
    expect(await now()).toBe(frozen); // při pauze čas stojí
    await mini.locator(".cbb-mp__play").click();
    await expect(mini.locator(".cbb-mp__play")).toHaveAccessibleName("Pozastavit");
  });

  test("další a předchozí; po 3 sekundách předchozí jen vrátí skladbu na začátek", async ({ page }) => {
    const { mini, playIndex, seek, now } = await setup(page);
    await playIndex(0);
    await mini.getByRole("button", { name: "Další skladba" }).click();
    await expect(mini.locator(".cbb-mp__title")).toHaveText("Pull Request");
    await mini.getByRole("button", { name: "Předchozí skladba" }).click(); // do 3 s: skutečně předchozí
    await expect(mini.locator(".cbb-mp__title")).toHaveText("Neon Kód");
    await seek.focus();
    await page.keyboard.press("Shift+ArrowRight"); // +15 s
    await expect.poll(now).toBeGreaterThanOrEqual(15);
    await mini.getByRole("button", { name: "Předchozí skladba" }).click();
    await expect(mini.locator(".cbb-mp__title")).toHaveText("Neon Kód"); // zůstala, jen od začátku
    await expect.poll(now).toBeLessThan(3);
  });

  test("posuvník času: šipky, Home, End a hodnota pro čtečky", async ({ page }) => {
    const { playIndex, seek, now } = await setup(page);
    await playIndex(0);
    await seek.focus();
    await page.keyboard.press("ArrowRight");
    await expect.poll(now).toBeGreaterThanOrEqual(5);
    await page.keyboard.press("Home");
    await expect.poll(now).toBeLessThan(2);
    await expect(seek).toHaveAttribute("aria-valuetext", /z 0:22$/);
    expect(Number(await seek.getAttribute("aria-valuemax"))).toBe(22);
  });

  test("klik na posuvník přeskočí na danou pozici", async ({ page }) => {
    const { playIndex, seek, now } = await setup(page);
    await playIndex(0);
    const box = (await seek.boundingBox())!;
    await page.mouse.click(box.x + box.width * 0.75, box.y + box.height / 2);
    await expect.poll(now).toBeGreaterThanOrEqual(15);
    expect(await now()).toBeLessThanOrEqual(19);
  });
});

test.describe("MusicPlayer: konec skladby, opakování, náhodné pořadí", () => {
  test("opakování se přepíná vypnuto → vše → jedna → vypnuto", async ({ page }) => {
    const { mini, playIndex } = await setup(page);
    await playIndex(0);
    const labels = ["Opakování vypnuto", "Opakovat vše", "Opakovat jednu skladbu"];
    for (const l of [...labels, labels[0]!]) {
      await expect(mini.locator(".cbb-mp__mode").last()).toHaveAccessibleName(l);
      await mini.locator(".cbb-mp__mode").last().click();
    }
  });

  test("po doznění další skladby se přejde na další, na úplném konci se zastaví", async ({ page }) => {
    const { mini, playIndex, seek, now } = await setup(page);
    await playIndex(3);
    await seek.focus(); await page.keyboard.press("End");
    await expect(mini.locator(".cbb-mp__title")).toHaveText("Merge Conflict"); // 5. skladba
    await seek.focus(); await page.keyboard.press("End");
    await expect(mini.locator(".cbb-mp__play")).toHaveAccessibleName("Přehrát"); // není co hrát: zastaví se
    await expect(mini.locator(".cbb-mp__title")).toHaveText("Merge Conflict");
    await expect.poll(now).toBeLessThan(2); // a je připravená na začátku
  });

  test("opakovat jednu: skladba po doznění hraje znovu", async ({ page }) => {
    const { mini, playIndex, seek } = await setup(page);
    await playIndex(1);
    await mini.locator(".cbb-mp__mode").last().click();
    await mini.locator(".cbb-mp__mode").last().click(); // vše → jedna
    await expect(mini.locator(".cbb-mp__mode").last()).toHaveAccessibleName("Opakovat jednu skladbu");
    await seek.focus(); await page.keyboard.press("End");
    await expect(mini.locator(".cbb-mp__title")).toHaveText("Pull Request");
    await expect(mini.locator(".cbb-mp__play")).toHaveAccessibleName("Pozastavit");
  });

  test("opakovat vše: po poslední skladbě se začíná od první", async ({ page }) => {
    const { mini, playIndex, seek } = await setup(page);
    await playIndex(4);
    await mini.locator(".cbb-mp__mode").last().click(); // vše
    await seek.focus(); await page.keyboard.press("End");
    await expect(mini.locator(".cbb-mp__title")).toHaveText("Neon Kód");
  });

  test("náhodné pořadí: přepínač a zamíchaná fronta obsahuje všechny skladby", async ({ page }) => {
    const { s, mini, playIndex } = await setup(page);
    await playIndex(0);
    const shuffle = mini.getByRole("button", { name: "Náhodné pořadí" });
    await expect(shuffle).toHaveAttribute("aria-pressed", "false");
    await shuffle.click();
    await expect(shuffle).toHaveAttribute("aria-pressed", "true");
    await mini.getByRole("button", { name: "Otevřít přehrávač" }).first().click();
    const titles = await page.locator(".cbb-fp .cbb-pq__list .cbb-pq__title").allTextContents();
    expect(titles.sort()).toEqual(TITLES.slice(1).sort());
    await page.keyboard.press("Escape");
    await shuffle.click();
    await expect(shuffle).toHaveAttribute("aria-pressed", "false");
    await mini.getByRole("button", { name: "Otevřít přehrávač" }).first().click();
    expect(await page.locator(".cbb-fp .cbb-pq__list .cbb-pq__title").allTextContents()).toEqual(TITLES.slice(1)); // původní pořadí
    await page.keyboard.press("Escape");
    await expect(s.locator(".cbb-fp")).toHaveCount(0);
  });
});

test.describe("MusicPlayer: hlasitost", () => {
  test("ztlumení, posuvník a uložení po obnovení stránky", async ({ page }) => {
    const { mini, playIndex } = await setup(page);
    await playIndex(0);
    const range = mini.locator(".cbb-mp__range");
    await range.fill("0.4");
    await expect(range).toHaveValue("0.4");
    await mini.getByRole("button", { name: "Ztlumit" }).click();
    await expect(mini.getByRole("button", { name: "Zapnout zvuk" })).toBeVisible();
    await expect(range).toHaveValue("0"); // ztlumeno
    await mini.getByRole("button", { name: "Zapnout zvuk" }).click();
    await expect(range).toHaveValue("0.4"); // vrátí se původní hlasitost, ne 100 %
    expect(await page.evaluate(() => localStorage.getItem("cbb-demo-volume"))).toBe("0.4");
    await page.reload();
    const again = await setup(page);
    await again.playIndex(1);
    await expect(again.mini.locator(".cbb-mp__range")).toHaveValue("0.4");
  });
});

test.describe("MusicPlayer: fronta", () => {
  const openFull = async (page: Page) => {
    const ctx = await setup(page);
    await ctx.playIndex(0);
    await ctx.mini.locator(".cbb-mp__cover").click();
    await expect(page.locator(".cbb-fp")).toBeVisible();
    return { ...ctx, fp: page.locator(".cbb-fp"), titles: () => page.locator(".cbb-fp .cbb-pq__list .cbb-pq__title").allTextContents() };
  };

  test("přidání na konec a jako další; počet a vymazání", async ({ page }) => {
    const { s, mini, playIndex } = await setup(page);
    await playIndex(0);
    await s.locator(".demo-trackrow").nth(4).getByRole("button", { name: /Do fronty/ }).click();
    await s.locator(".demo-trackrow").nth(2).getByRole("button", { name: "Jako další" }).click();
    await mini.locator(".cbb-mp__cover").click();
    const list = page.locator(".cbb-fp .cbb-pq__list .cbb-pq__title");
    // po „Neon Kód“ hraje playlist (Pull Request … Merge Conflict); „Jako další“ je před ním, „Do fronty“ na konci
    await expect(list.first()).toHaveText("Noční build");
    await expect(list.last()).toHaveText("Merge Conflict");
    await expect(page.locator(".cbb-fp .cbb-pq__count")).toHaveText("6");
    await page.locator(".cbb-fp").getByRole("button", { name: "Vymazat frontu" }).click();
    await expect(page.locator(".cbb-fp .cbb-pq__empty")).toHaveText("Fronta je prázdná");
  });

  test("odebrání křížkem a přehrání kliknutím (přeskočené skladby jdou do historie)", async ({ page }) => {
    const { titles, fp } = await openFull(page);
    expect(await titles()).toEqual(TITLES.slice(1));
    await fp.getByRole("button", { name: /Odebrat z fronty: Pull Request/ }).click();
    expect(await titles()).toEqual(TITLES.slice(2));
    await fp.locator(".cbb-pq__play", { hasText: "Hot Reload" }).click(); // přeskočí Noční build
    await expect(fp.locator(".cbb-fp__title")).toHaveText("Hot Reload");
    expect(await titles()).toEqual(["Merge Conflict"]);
    await fp.getByRole("button", { name: "Předchozí skladba" }).click(); // do 3 s: vrátí se na přeskočenou
    await expect(fp.locator(".cbb-fp__title")).toHaveText("Noční build");
  });

  test("přeřazení tažením", async ({ page }) => {
    const { titles, fp } = await openFull(page);
    const rows = fp.locator(".cbb-pq__list > li");
    await rows.nth(0).dragTo(rows.nth(2)); // Pull Request za Noční build
    expect(await titles()).toEqual(["Noční build", "Hot Reload", "Pull Request", "Merge Conflict"]);
  });

  test("přeřazení klávesnicí: úchyt a šipky nahoru a dolů, fokus zůstane na přesunuté skladbě", async ({ page }) => {
    const { titles, fp } = await openFull(page);
    const grip = (name: string) => fp.getByRole("button", { name: new RegExp(`Přesunout.*: ${name}`) });
    await grip("Pull Request").focus();
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("ArrowDown");
    expect(await titles()).toEqual(["Noční build", "Hot Reload", "Pull Request", "Merge Conflict"]);
    await expect(grip("Pull Request")).toBeFocused();
    await page.keyboard.press("ArrowUp");
    expect(await titles()).toEqual(["Noční build", "Pull Request", "Hot Reload", "Merge Conflict"]);
    await page.keyboard.press("ArrowUp"); await page.keyboard.press("ArrowUp"); // na začátku se dál nejde
    expect((await titles())[0]).toBe("Pull Request");
  });
});

test.describe("FullscreenPlayer", () => {
  test("otevření klikem, modální okno, Esc zavře a vrátí fokus", async ({ page }) => {
    const { mini, playIndex } = await setup(page);
    await playIndex(1);
    const opener = mini.locator(".cbb-mp__cover");
    await opener.click();
    const dialog = page.locator(".cbb-fp");
    await expect(dialog).toHaveAttribute("role", "dialog");
    await expect(dialog).toHaveAttribute("aria-modal", "true");
    await expect(dialog.locator(".cbb-fp__title")).toHaveText("Pull Request");
    await expect(dialog.locator(".cbb-fp__artist")).toContainText("Žlutá hodina");
    await page.keyboard.press("Escape");
    await expect(dialog).toHaveCount(0);
    await expect(opener).toBeFocused();
  });

  test("tlačítko zavřít, ovládání uvnitř a focus trap", async ({ page }) => {
    const { mini, playIndex } = await setup(page);
    await playIndex(0);
    await mini.locator(".cbb-mp__meta").click();
    const dialog = page.locator(".cbb-fp");
    await dialog.getByRole("button", { name: "Pozastavit" }).click();
    await expect(dialog.getByRole("button", { name: "Přehrát" })).toBeVisible();
    await expect(mini.locator(".cbb-mp__play")).toHaveAccessibleName("Přehrát"); // mini je pořád synchronní
    for (let i = 0; i < 30; i++) {
      await page.keyboard.press("Tab");
      expect(await page.evaluate(() => !!document.activeElement?.closest(".cbb-fp")), `Tab ${i + 1}`).toBe(true);
    }
    await dialog.getByRole("button", { name: "Zavřít přehrávač" }).click();
    await expect(dialog).toHaveCount(0);
  });

  test("zvuková stopa přetáčí a oblíbené (actions) fungují v obou verzích", async ({ page }) => {
    const { mini, playIndex } = await setup(page);
    await playIndex(2);
    await mini.locator(".cbb-mp__cover").click();
    const dialog = page.locator(".cbb-fp");
    const wave = dialog.locator(".cbb-seek--waveform");
    await expect(wave.locator(".cbb-seek__bar")).toHaveCount(64);
    const box = (await wave.boundingBox())!;
    await page.mouse.click(box.x + box.width * 0.5, box.y + box.height / 2);
    await expect.poll(async () => Number(await wave.getAttribute("aria-valuenow"))).toBeGreaterThanOrEqual(12);
    const like = dialog.getByRole("button", { name: "Přidat do oblíbených" });
    await like.click();
    await expect(dialog.getByRole("button", { name: "Odebrat z oblíbených" })).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(mini.getByRole("button", { name: "Odebrat z oblíbených" })).toBeVisible(); // stejný stav i v mini
  });

  test("úzká obrazovka: přepínač mezi přehrávačem a frontou", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 800 });
    const { mini, playIndex } = await setup(page);
    await playIndex(0);
    await mini.locator(".cbb-mp__cover").click();
    const dialog = page.locator(".cbb-fp");
    await expect(dialog.locator(".cbb-fp__stage")).toBeVisible();
    await expect(dialog.locator(".cbb-fp__queue")).toBeHidden();
    await dialog.getByRole("tab", { name: "Fronta" }).click();
    await expect(dialog.locator(".cbb-fp__queue")).toBeVisible();
    await expect(dialog.locator(".cbb-fp__stage")).toBeHidden();
    await dialog.getByRole("tab", { name: "Přehrávač" }).click();
    await expect(dialog.locator(".cbb-fp__stage")).toBeVisible();
  });
});

test.describe("MusicPlayerProvider", () => {
  test("klávesové zkratky (zapnuté jen v téhle ukázce): mezerník a šipky", async ({ page }) => {
    const { s } = await setup(page, "musicplayerprovider");
    await s.getByRole("button", { name: "Přehrát seznam" }).click();
    const status = s.locator(".demo-mono").first();
    await expect(status).toContainText("Neon Kód");
    await page.locator("body").click({ position: { x: 5, y: 5 } }); // fokus mimo ovládací prvky
    await page.keyboard.press("Space");
    await expect(s.getByRole("button", { name: "Pokračovat" })).toBeVisible(); // pozastaveno
    await page.keyboard.press("Space");
    await expect(s.getByRole("button", { name: "Pozastavit" })).toBeVisible();
  });

  test("chyba při přehrání se zobrazí a nezhroutí stránku", async ({ page }) => {
    const { s } = await setup(page, "musicplayerprovider");
    await s.getByRole("button", { name: "Skladba s chybou" }).click();
    await expect(s.getByRole("status")).toContainText("nepodařilo přehrát");
  });
});
