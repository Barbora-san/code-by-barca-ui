# Changelog

Formát vychází z [Keep a Changelog](https://keepachangelog.com/cs/1.1.0/), verzování podle [SemVer](https://semver.org/lang/cs/).

## [1.0.0] – 2026-10-11

První veřejná verze. Obsah knihovny:

### Přidáno
- **Základ:** tlačítka, štítky, formulářová pole, výběry, přepínače, karty, tabulky, navigace, překryvy, toasty, cookie lišta, kalendář a výběry data a času (DatePicker, DateTimePicker, DateRangePicker).
- **Efekty a interaktivní prvky:** FlipCard, TiltCard (celá karta i jednotlivé vrstvy), BeforeAfter, Folder (varianty `stack` a `spread`), Wallet3D, FloatingInput, Marquee, AudioVisualizer.
- **Data:** DataTable, TodoList, filtry (`useFilter`, FilterPills, FilterDropdown), grafy (AreaChart, LineChart, BarChart, RadarChart) s tabulkou pro čtečky obrazovky.
- **Platby:** PaymentSummary, PromoQRCard.
- **Základy 2:** Spinner (ring, dots, bars, pulse, custom), NumberInput, PasswordInput, Rating, MultiSelect.
- **Motiv:** světlý, tmavý a systémový režim (`ThemeToggle`, `useTheme`, `getThemeInitScript`), ovládání přes `data-theme` nebo třídu `cbb-light`.
- **Ovládání:** CommandPalette (Ctrl/⌘ + K), `useHotkey`.
- **Editory:** MarkdownEditor, MarkdownView (bezpečné vykreslení) a `markdownToHtml`, TableEditor (vkládání z Excelu).
- **Hudba:** MusicPlayer (mini lišta, fullscreen, fronta), MiniPlayer, FullscreenPlayer, PlayerQueue, MusicPlayerProvider a `useMusicPlayer`: náhodné pořadí, opakování (vypnuto, vše, jedna), přeřazování fronty, uložená hlasitost, ovládání v systému. Bez serveru; vlastní data se napojují přes callbacky.
- **Hooky:** `useDebounce`, `useMediaQuery`, `useLocalStorage`, `useCopyToClipboard`, `useDisclosure`, `useFocusTrap` (použitý v Dialog, Sheet, AlertDialog).
- Demo a dokumentace s živými ukázkami, kódem a tabulkami parametrů generovanými z typů.
- Testy: jednotkové (Vitest, vykreslení na serveru, kontrola balíčku) a e2e (Playwright). Popis v [docs/TESTING.md](docs/TESTING.md).
