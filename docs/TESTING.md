# Testování

Tento dokument popisuje testovací vrstvy knihovny, jejich spuštění a
oblasti, které pokrývají. Testy pomáhají ověřovat chování knihovny a
jejího sestaveného balíčku; nenahrazují ruční kontrolu vzhledu ani
testování ve všech podporovaných prostředích.

## Požadavky

-   Node.js a npm
-   Závislosti projektu nainstalované přes `npm install`
-   Chromium pro end-to-end (E2E) testy Playwrightu

## Spuštění testů

``` bash
npm install
npx playwright install chromium
npm test
```

Příkaz `npx playwright install chromium` stačí spustit při prvním
nastavení prostředí nebo tehdy, když požadovaná verze prohlížeče není
dostupná.

  -----------------------------------------------------------------------
Příkaz                              Co provádí
  ----------------------------------- -----------------------------------
`npm run test:unit`                 Sestaví knihovnu do `dist` a spustí
jednotkové testy pomocí Vitestu.

`npm run test:e2e`                  Sestaví demo a spustí E2E testy
pomocí Playwrightu v Chromiu.

`npm test`                          Spustí jednotkové a E2E testy za
sebou.
  -----------------------------------------------------------------------

Před vydáním je vhodné spustit `npm test`. Skript `prepublishOnly`
provádí pouze kontroly nakonfigurované v `package.json`; E2E testy proto
spouštějte samostatně a ověřte výsledek celého `npm test`.

Pokud Playwright nemůže najít Chromium, lze podle konfigurace projektu
nastavit proměnnou `CBB_CHROMIUM` na cestu k jeho spustitelnému souboru.

Po neúspěšném E2E testu hledejte diagnostické soubory ve složce
`test-results/`. HTML report lze otevřít příkazem:

``` bash
npx playwright show-report tests/report
```

## Testovací vrstvy

### Jednotkové testy

Jednotkové testy ve `tests/unit/` ověřují logiku, serverové vykreslení a
vlastnosti sestaveného balíčku. Jsou určené k rychlému odhalení regresí
v konkrétních částech knihovny.

### E2E testy

E2E testy ve `tests/e2e/` ověřují interakce v běžícím demu v prohlížeči.
Pokrývají například ovládání klávesnicí, fokus, práci s textovým polem,
motiv, `localStorage`, schránku a přehrávač.

Testy čekají na očekávaný stav místo pevně nastavených prodlev. Sdílená
fixture navíc po testu kontroluje, zda stránka nevyvolala nezachycenou
chybu.

## Jednotkové testy

### `tests/unit/markdown.test.ts` --- převod Markdownu

Testy ověřují podporovanou syntaxi Markdownu, escapování HTML a
zpracování odkazů. Zahrnují také nebezpečné vstupy, například značky
`<script>`, schémata `javascript:` a `data:` nebo uvozovky v adrese
odkazu.

Ověřují se jak odmítnuté či bezpečně zpracované nebezpečné vstupy, tak
běžné odkazy s podporovanými schématy, například `http`, `https`,
`mailto`, `tel`, relativní odkazy a kotvy. Externí odkazy musí mít
odpovídající atribut `rel="noopener noreferrer"`.

### `tests/unit/ssr.test.ts` --- vykreslení na serveru

Vybrané komponenty se vykreslují pomocí `renderToString` v prostředí bez
`window` a `document`. Testuje se také inicializační skript motivu.

Cílem je zachytit přístup k API prohlížeče během serverového
vykreslování a ověřit základní výstup komponent. Pokrytí se aktuálně
vztahuje na 15 komponent; neznamená to, že jsou takto otestované všechny
komponenty knihovny.

Testy přehrávače ověřují také chování při absenci skladby a serverové
vykreslení fullscreen přehrávače.

### `tests/unit/playerQueue.test.ts` --- fronta přehrávače

Testy ověřují logiku fronty oddělenou od Reactu a zvukového výstupu:
výběr další a předchozí skladby, opakování, náhodné pořadí, přidávání a
odebírání skladeb, přesouvání ve frontě a historii přehrávání.

Kontroluje se výsledné pořadí skladeb, chování při přepínání režimů a
zachování původního stavu vstupních dat. Náhodné pořadí používá
předvídatelný vstup, aby byly výsledky testů opakovatelné.

### `tests/unit/package.test.ts` --- sestavený balíček

Tyto testy kontrolují obsah složky `dist`, tedy výstup sestavení určený
k distribuci. Ověřují zejména:

-   existenci souborů uvedených v `exports`, `main`, `module`, `types` a
    `files`;
-   deklaraci Reactu jako peer dependency a očekávané nastavení
    závislostí;
-   přítomnost direktivy `"use client"` ve výstupech ESM a CJS;
-   shodu názvů exportů mezi formáty ESM a CJS a vstupním souborem
    `src/index.ts`;
-   přítomnost typových deklarací pro komponenty a typy;
-   základní strukturu `styles.css`, podporu světlého a tmavého motivu a
    nepřítomnost direktiv `@tailwind` a `@apply`;
-   definice použitých barevných proměnných `--cbb-*` a CSS pravidel pro
    třídy `cbb-*`, s výjimkami výslovně uvedenými v testech.

Při selhání test vypíše konkrétní chybějící soubor, token nebo třídu.
Tyto kontroly ověřují strukturu balíčku, nenahrazují jeho instalaci a
spuštění v samostatném projektu.

## E2E testy (Playwright)

### `tests/e2e/inputs.spec.ts` --- vstupy a hooky

Testy pokrývají:

-   `NumberInput`: tlačítka pro změnu hodnoty, klávesové šipky,
    modifikátor Shift, limity, desetinnou čárku, zaokrouhlování a
    odmítnutí neplatného vstupu;
-   `PasswordInput`: přepínání viditelnosti a validační hlášku;
-   `Rating`: klikání, zrušení hodnocení, ovládání klávesnicí, půlhvězdy
    a režim pouze pro čtení;
-   `MultiSelect`: výběr, filtrování, odebírání položek, zavření
    klávesou Esc a limity výběru;
-   fokus v modálním dialogu: udržení fokusu uvnitř dialogu a zavření
    klávesou Esc;
-   `useLocalStorage`: zachování hodnoty po obnovení stránky;
-   `useDebounce`: aktualizaci hodnoty po prodlevě.

### `tests/e2e/theme.spec.ts` --- motiv, paleta příkazů a zkratky

Testy ověřují cyklování režimů system/light/dark, uložení volby, reakci
na změnu systémového motivu a vypočtené barvy pozadí. Dále pokrývají
otevření palety příkazů, vyhledávání bez diakritiky i podle klíčových
slov, ovládání klávesnicí, zakázané příkazy a klávesovou zkratku.
Součástí je také test hooku `useHotkey`.

### `tests/e2e/editors.spec.ts` --- Markdown editor a editor tabulek

Testy ověřují formátování textu, práci se seznamy a nadpisy, chování
klávesy Enter v seznamu, vykreslení náhledu a zpracování nebezpečných
vstupů. U editoru tabulek kontrolují úpravu buněk, pohyb fokusu,
přidávání a odebírání řádků a sloupců a vložení tabulkových dat ze
schránky.

Vložení ze schránky se simuluje událostí `paste` s `DataTransfer`; test
tak ověřuje zpracování vložených dat bez závislosti na skutečné
systémové schránce.

### `tests/e2e/player.spec.ts` --- přehrávač

Demo vytváří syntetické zvukové smyčky přímo v prohlížeči, takže testy
nepotřebují externí zvukové soubory ani připojení k internetu.

Testy pokrývají zobrazení mini přehrávače, přehrávání a pauzu, přechod
na další a předchozí skladbu, posuvník času, opakování, náhodné pořadí,
hlasitost, frontu a historii, přeřazování skladeb myší i klávesnicí,
fullscreen režim, oblíbené skladby, úzký viewport, klávesové zkratky a
chybový stav při neexistujícím souboru.

Testy ověřují stav a ovládací prvky přehrávače, nikoli skutečný zvukový
výstup z reproduktorů. Stav ovládacích prvků se kontroluje pomocí
přístupných názvů a atributů, například `aria-label` a `aria-valuetext`.

## Co testy nepokrývají

Automatizované testy mají omezený rozsah. Aktuálně platí zejména
následující omezení:

-   **Vizuální regrese:** testy nepoužívají screenshotové porovnávání.
    Vzhled, rozložení a kontrast se kontrolují ručně; automatický test
    kontrastu ve světlém motivu zatím není součástí sady.
-   **Část komponent:** některé komponenty, například `Sheet`,
    `AlertDialog`, `DatePicker`, `DataTable` a grafy, nejsou pokryté
    uvedenými E2E testy a vyžadují samostatnou kontrolu.
-   **Prohlížeče:** E2E testy běží v Chromiu. Safari a Firefox nejsou v
    této sadě automatizovaně testované.
-   **Zvuk a systémové funkce:** ověřuje se stav přehrávače, ne to, co
    uživatel skutečně slyší. Multimediální klávesy a ovládání na zamčené
    obrazovce se automaticky netestují.
-   **Vzdálené zvukové soubory:** demo používá syntetické skladby.
    Pomalá síť, CORS a další problémy při načítání externích souborů
    nejsou pokryté.
-   **Všechny možné kombinace použití:** úspěšné testy nezaručují
    bezchybné chování ve všech aplikacích, prohlížečích, velikostech
    obrazovky ani kombinacích props a CSS.

U komponent a scénářů, které automatizované testy nepokrývají, je vhodné
provést ruční kontrolu v dokumentaci a podle potřeby také v samostatné
testovací aplikaci.

## Zjištění z testování

Při přípravě testů byly nalezeny a opraveny chyby uvedené v
[CHANGELOG](../CHANGELOG.md), včetně chybějící direktivy `"use client"`
v sestaveném balíčku, nedefinované CSS proměnné `--cbb-container` a
dvojího escapování adres v Markdownu. Testování odhalilo také problém v
testovacím serveru.

------------------------------------------------------------------------

Testovací sada se může s vývojem knihovny měnit. Pro aktuální rozsah
pokrytí a přesné očekávané výsledky slouží samotné testy v adresářích
`tests/unit/` a `tests/e2e/`.
