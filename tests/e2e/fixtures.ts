import { test as base, expect } from "@playwright/test";

/**
 * Každý test dostane stránku, která sleduje chyby v konzoli prohlížeče (nezachycené výjimky).
 * Po testu se ověří, že žádná nevznikla – chyba, kterou si test nevšimne přímo, tak neprojde bez povšimnutí.
 */
export const test = base.extend({
  page: async ({ page }, use) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await use(page);
    expect(errors, "nezachycené chyby na stránce").toEqual([]);
  },
});
export { expect };
