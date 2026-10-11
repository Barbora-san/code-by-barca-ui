# code-by-barca-ui

Čistá UI knihovna pro [code-by-barca.cz](https://code-by-barca.cz): jednotlivé komponenty a lišty, žádné celé části stránek.
Tmavý „geeky“ vzhled se žlutým akcentem. React + TypeScript, **bez závislosti na Tailwindu** (styly jsou hotové CSS s prefixem `cbb-`).

```bash
npm i code-by-barca-ui     # nebo: yarn add code-by-barca-ui
```

```tsx
import "code-by-barca-ui/styles.css";
import { Button, Badge, Toaster, toast } from "code-by-barca-ui";

export default function App() {
  return (
    <div className="cbb-root">
      <Button glow onClick={() => toast.success("Uloženo")}>Uložit</Button>
      <Toaster />
    </div>
  );
}
```

Třída `cbb-root` je volitelná (nastaví černé pozadí, bílý text a font). Knihovna je označená `"use client"`, takže funguje v Next.js App Routeru.

Požadavky: React 18 nebo 19 (`react` a `react-dom` jako peer závislosti), TypeScript je volitelný (typy jsou součástí balíčku). Dokumentace s živými ukázkami, kódem a tabulkami parametrů je v `demo/` (`npm run demo`).

## Komponenty

| Skupina | Komponenty |
| --- | --- |
| **Moje (portfolio)** | `SkillCard`, `SkillLevelBar`, `ProjectCard`, `Timeline`, `InfoRow`, `SocialLinks`, `ContactForm`, `DateTimePicker`, `Typewriter`, `SectionHeading`, `Reveal`, `CodeBlock`, `LazyImage`, `Lightbox`, `CookieBanner`, `Card` s `glow` a `corners` |
| Základy | `Button`, `Badge`, `Tag`, `Chip`, `Kbd`, `Divider` |
| Formuláře | `Input`, `Textarea`, `Select`, `Checkbox`, `Radio`, `Switch`, `Slider`, `TagInput`, `InputOTP`, `FileUpload`, `Toggle`, `ToggleGroup` |
| Zobrazení | `Card`, `StatCard`, `Avatar`, `AvatarGroup`, `Skeleton`, `Progress`, `EmptyState` |
| Zpětná vazba | `Alert`, `AlertBar` (lišta), `Toaster` + `showToast`, `NotificationBadge`, `NotificationPopover` |
| Popupy a msg box | `Dialog`, `AlertDialog`, `messageBox.alert()` / `messageBox.confirm()` (Promise), `Sheet` |
| Plovoucí | `Tooltip`, `Popover`, `HoverCard`, `Dropdown`, `ContextMenu` |
| Navigace a lišty | `Navbar`, `Sidebar`, `Menubar`, `Tabs`, `Breadcrumb`, `Pagination`, `Stepper`, `Accordion`, `Collapsible`, `ScrollProgress`, `SearchBar`, `SearchAutocomplete` |
| Filtrování | `useFilter`, `FilterBar`, `FilterPills`, `FilterDropdown` |
| Efekty a interaktivní prvky | `FlipCard`, `TiltCard`, `BeforeAfter`, `Folder`, `Wallet3D`, `FloatingInput`, `Marquee`, `TodoList`, `DataTable`, `AudioVisualizer` |
| Základy 2 | `Spinner`, `NumberInput`, `PasswordInput`, `Rating`, `MultiSelect` |
| Motiv a ovládání | `ThemeToggle`, `CommandPalette`, hooky `useTheme`, `getThemeInitScript`, `useHotkey` (světlý/tmavý/systémový režim přes `data-theme`) |
| Editory | `MarkdownEditor`, `MarkdownView` (bezpečné vykreslení, `markdownToHtml`), `TableEditor` |
| Hudba | `MusicPlayer`, `MiniPlayer`, `FullscreenPlayer`, `PlayerQueue`, `MusicPlayerProvider`, `useMusicPlayer` (fronta, shuffle, opakování, bez serveru) |
| Hooky | `useDebounce`, `useMediaQuery`, `useLocalStorage`, `useCopyToClipboard`, `useDisclosure`, `useFocusTrap` |
| Grafy | `AreaChart`, `LineChart`, `BarChart`, `RadarChart` |
| Platby a vstupenky | `PaymentSummary`, `PromoQRCard` |
| Data a layout | `Table`, `Calendar`, `Carousel`, `Resizable`, `ScrollArea`, `FAB` |

## Filtr (`useFilter` + `FilterBar`)

```tsx
const filters = [
  { key: "status", label: "Status", getValue: (p) => p.status },                       // jedna volba
  { key: "category", label: "Kategorie", multiple: true, getValue: (p) => p.category }, // více voleb
  { key: "tags", label: "Tagy", multiple: true, getValue: (p) => p.tags },
];
const sorts = [
  { value: "new", label: "Nejnovější", compare: (a, b) => +new Date(b.date) - +new Date(a.date) },
  { value: "title", label: "Podle názvu", compare: (a, b) => a.title.localeCompare(b.title, "cs") },
];

const f = useFilter({ items: projects, searchText: (p) => `${p.title} ${p.tags.join(" ")}`, filters, sorts });

<FilterBar filter={f} sticky={80} />
{f.filtered.map((p) => <ProjectCard key={p.id} {...p} />)}
```

Hledá bez ohledu na diakritiku, všechna slova musí sedět, počty u voleb se počítají podle ostatních aktivních filtrů.
`filters` a `sorts` definuj mimo komponentu (nebo v `useMemo`), ať se zbytečně nepřepočítávají.

## Motiv (světlý / tmavý / systémový)

```tsx
// layout.tsx: skript v <head> zabrání probliknutí špatného režimu při načtení
<script dangerouslySetInnerHTML={{ __html: getThemeInitScript() }} />

// kdekoli v aplikaci
<ThemeToggle />
const { mode, resolved, setMode } = useTheme();   // mode: "light" | "dark" | "system"
```

Světlý režim jde zapnout i ručně atributem `data-theme="light"` na libovolném obalu, nebo třídou `cbb-light`.

## Hudební přehrávač

```tsx
import { MusicPlayerProvider, MusicPlayer, useMusicPlayer, type Track } from "code-by-barca-ui";

// Provider kolem aplikace, přehrávač (mini lišta + fullscreen s frontou) na jednom místě
<MusicPlayerProvider onTrackStart={(t) => api.countPlay(t.id)}>
  {children}
  <MusicPlayer actions={(t) => <LikeButton trackId={t.id} />} />
</MusicPlayerProvider>

// spuštění skladby odkudkoli
const player = useMusicPlayer();
player.play(track, { list: tracks });
```

Přehrávač nic neukládá na server: oblíbené, počítadla přehrání a historii napojíš přes `actions`, `onTrackStart` a `onTrackEnd`. Klávesové zkratky jsou ve výchozím stavu vypnuté (`keyboardShortcuts`), aby nekolidovaly s tvojí aplikací.

## Next.js

```tsx
"use client";
import Link from "next/link";
import { CbbProvider } from "code-by-barca-ui";

export function Providers({ children }) {
  return <CbbProvider linkComponent={Link}>{children}</CbbProvider>;
}
```

Odkazy s interní cestou (`/projekty`) pak půjdou přes `next/link`, externí (`https:`, `mailto:`, `#kotva`) zůstanou obyčejné `<a>`.

## Přebarvení

```css
:root { --cbb-accent: #22d3ee; --cbb-accent-hover: #67e8f9; --cbb-bg: #050505; }
```

Volitelně Tailwind preset: `presets: [require("code-by-barca-ui/tailwind-preset")]` → `bg-cbb-surface text-cbb-accent rounded-cbb-lg`.

## Vývoj a publikace

```bash
npm install
npm run typecheck
npm run build        # tsup → dist/ (ESM + CJS + .d.ts) + dist/styles.css
npm run demo         # sestaví a spustí dokumentační stránku (demo/)
npm run test:unit    # jednotkové testy (rychlé, bez prohlížeče)
npm test             # build + jednotkové a e2e testy (popis: docs/TESTING.md)
npm pack --dry-run   # co přesně se publikuje
npm login && npm publish
```

`npm publish` před odesláním sám spustí typecheck, build a jednotkové testy (`prepublishOnly`). E2e testy potřebují prohlížeč, proto je spusť ručně přes `npm test`.

Změny verzí jsou v [CHANGELOG.md](CHANGELOG.md).

MIT © Barbora Šanderová
