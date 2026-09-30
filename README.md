# code-by-barca-ui

UI knihovna pro [code-by-barca.cz](https://code-by-barca.cz) – tmavý „geeky“ vzhled se žlutým akcentem.
React + TypeScript, **bez nutnosti Tailwindu** (styly jsou hotové CSS s prefixem `cbb-`).

```bash
npm i code-by-barca-ui
# nebo
yarn add code-by-barca-ui
```

## Použití

```tsx
import "code-by-barca-ui/styles.css";
import { Hero, Typewriter, Button, Section, SectionHeading, SkillCard } from "code-by-barca-ui";

export default function Home() {
  return (
    <div className="cbb-root">
      <Hero
        badge="Otevřena novým nápadům"
        title="Barbora"
        titleMuted="Šanderová"
        tagline={<>I'm a <Typewriter words={["Designer", "Developer"]} /></>}
        actions={<Button size="lg" glow href="#projects">Ukázka mé práce</Button>}
        scrollHref="#about"
      />
      <Section tone="alt">
        <SectionHeading eyebrow="// Skills" title="Dovednosti &" accent="Technologie" />
      </Section>
    </div>
  );
}
```

### Next.js (interní odkazy přes `next/link`)

```tsx
"use client";
import Link from "next/link";
import { CbbProvider } from "code-by-barca-ui";

export default function Providers({ children }) {
  return <CbbProvider linkComponent={Link}>{children}</CbbProvider>;
}
```

Komponenty s `href` pak pro interní cesty použijí `next/link`, externí odkazy (`https:`, `mailto:`, `#kotva`) zůstávají obyčejné `<a>`.
Knihovna je označená `"use client"`, takže funguje v App Routeru.

### Přebarvení

Vše se řídí CSS proměnnými – stačí je přepsat:

```css
:root {
  --cbb-accent: #22d3ee;
  --cbb-accent-hover: #67e8f9;
  --cbb-bg: #050505;
}
```

### Tailwind (volitelné)

```js
// tailwind.config.js
module.exports = {
  presets: [require("code-by-barca-ui/tailwind-preset")],
};
// pak: className="bg-cbb-surface text-cbb-accent rounded-cbb-lg"
```

## Komponenty

| Skupina | Komponenty |
| --- | --- |
| Základ | `Button`, `Badge`, `Tag`, `Card` (`CardMedia`, `CardBody`), `Reveal` |
| Sekce | `Hero`, `Typewriter`, `Section`, `SectionHeading`, `Timeline` |
| Obsah | `SkillCard`, `SkillLevelBar`, `ProjectCard`, `CodeBlock`, `LazyImage`, `Skeleton*` |
| Formuláře | `Input`, `Textarea`, `Select`, `Field`, `ContactForm` (validace + honeypot), `DateTimePicker`, `FilterPills`, `FilterDropdown` |
| Překryvy | `Modal`, `Lightbox` (+ `useLightbox`), `ToastProvider` / `useToast`, `CookieBanner` |
| Layout | `Navbar`, `Footer`, `InfoRow`, `SocialLinks` |
| Hooky | `useScrollReveal`, `useLockBodyScroll`, `useEscape` |
| Ikony | `ChevronRightIcon`, `MailIcon`, `GithubIcon`, … (inline SVG, bez závislosti) |

### DateTimePicker

```tsx
const [when, setWhen] = useState<string>(new Date().toISOString());
<DateTimePicker value={when} onChange={setWhen} />   // onChange dostává ISO řetězec
```

Klik na název měsíce přepne kalendář na kolečka měsíc/rok (po 2 s nečinnosti se vrátí na dny).
Hodiny a minuty se vybírají scrollem (scroll-snap). Texty jdou přepsat přes `locale`, `monthNames`, `weekdayNames`.

### ContactForm

```tsx
<ContactForm onSubmit={async (v) => { await fetch("/api/contact", { method: "POST", body: JSON.stringify(v) }); }} />
```

Když je vyplněné skryté pole (honeypot), `onSubmit` se nezavolá. Při chybě (throw) zůstanou data ve formuláři.

### CookieBanner

```tsx
<CookieBanner policyHref="/GDPR" hideOnPaths={["/admin"]} />
```

Souhlas čti přes `getCookieConsent()` (`"necessary" | "all" | null`), změnu poslouchej na události `cookie-consent-change`.
Znovuotevření z patičky: `window.dispatchEvent(new Event(COOKIE_OPEN_EVENT))`.

## Vývoj a publikace

```bash
npm install
npm run typecheck
npm run build        # tsup → dist/ (ESM + CJS + .d.ts) a dist/styles.css
npm pack --dry-run   # co přesně se publikuje
npm login
npm publish          # (publishConfig.access = public)
```

Před prvním publikováním:

1. Ověř, že je název `code-by-barca-ui` na npm volný (`npm view code-by-barca-ui`). Pokud ne, použij scope: `@code-by-barca/ui` a změň `name` v `package.json`.
2. Uprav `repository.url` na skutečný repozitář.
3. Verze: `npm version patch|minor|major`.

`npm run dev` spouští build ve watch režimu; ukázková stránka je v `demo/`.

## Licence

MIT © Barbora Šanderová
