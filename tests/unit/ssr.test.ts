import { createElement as h } from "react";
import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";
import {
  Button, Spinner, ThemeToggle, MarkdownView, MarkdownEditor, TableEditor, NumberInput, PasswordInput,
  Rating, MultiSelect, Badge, getThemeInitScript, MusicPlayerProvider, MiniPlayer, FullscreenPlayer, PlayerQueue,
} from "../../src";

/**
 * Next.js vykresluje komponenty nejdřív na serveru, kde neexistuje `window` ani `document`.
 * Test ověří, že se vybrané komponenty vykreslí na serveru bez výjimky a vytvoří očekávané značky.
 */
describe("vykreslení na serveru (bez window / document)", () => {
  it("window ani document v testu opravdu neexistují", () => {
    expect(typeof window).toBe("undefined");
    expect(typeof document).toBe("undefined");
  });

  const cases: [string, () => string, string][] = [
    ["Button", () => renderToString(h(Button, null, "Ahoj")), "cbb-btn"],
    ["Badge", () => renderToString(h(Badge, null, "x")), "cbb-badge"],
    ["Spinner", () => renderToString(h(Spinner, { label: "Načítám" })), "cbb-spin__ring"],
    ["ThemeToggle", () => renderToString(h(ThemeToggle, null)), "cbb-theme"],
    ["MarkdownView", () => renderToString(h(MarkdownView, { source: "**a**" })), "<strong>a</strong>"],
    ["MarkdownEditor", () => renderToString(h(MarkdownEditor, { defaultValue: "text" })), "cbb-md-editor"],
    ["TableEditor", () => renderToString(h(TableEditor, null)), "cbb-tbl-edit"],
    ["NumberInput", () => renderToString(h(NumberInput, { defaultValue: 3 })), "spinbutton"],
    ["PasswordInput", () => renderToString(h(PasswordInput, null)), 'type="password"'],
    ["Rating", () => renderToString(h(Rating, { defaultValue: 3 })), "cbb-rating"],
    ["MiniPlayer (prázdná lišta)", () => renderToString(h(MusicPlayerProvider, null, h(MiniPlayer, { hideWhenEmpty: false }))), "cbb-mp"],
    ["PlayerQueue", () => renderToString(h(MusicPlayerProvider, null, h(PlayerQueue, null))), "Fronta je prázdná"],
    ["MultiSelect", () => renderToString(h(MultiSelect, { options: [{ value: "a", label: "A" }] })), "cbb-multi"],
  ];
  it.each(cases)("%s se vykreslí", (_name, render, needle) => {
    expect(render()).toContain(needle);
  });

  it("přehrávač bez skladby nic nevykreslí a fullscreen na serveru nesahá na document", () => {
    expect(renderToString(h(MusicPlayerProvider, null, h(MiniPlayer, null)))).toBe("");
    expect(renderToString(h(MusicPlayerProvider, null, h(FullscreenPlayer, { open: true })))).toBe("");
  });

  it("getThemeInitScript vrací samostatně spustitelný skript", () => {
    const code = getThemeInitScript();
    expect(typeof code).toBe("string");
    const attrs: Record<string, string> = {};
    const fakeDoc = { documentElement: { setAttribute: (k: string, v: string) => (attrs[k] = v), style: {} } };
    const fakeWin = { matchMedia: () => ({ matches: true }), localStorage: { getItem: () => "light" } };
    new Function("document", "window", "localStorage", code)(fakeDoc, fakeWin, fakeWin.localStorage);
    expect(attrs["data-theme"]).toBe("light");
  });
});
