import { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Sidebar, Sheet, Button, Tabs, CodeBlock, Badge, ScrollProgress, Toaster, MessageBoxHost, CbbProvider, SearchAutocomplete,
  GithubIcon, MenuIcon, ArrowDownIcon, CheckIcon, SparklesIcon, FolderIcon, type SidebarGroup,
} from "../src";
import "../src/styles.css";
import "./demo.css";
import { CATEGORIES } from "./docs";
import { DocBlock } from "./ui";
import { Showcase } from "./showcase";
import pkg from "../package.json";

const REPO = "https://github.com/Barbora-san/code-by-barca-ui";
const ZIP = `${REPO}/archive/refs/heads/main.zip`;
const logo = <>code<span className="cbb-accent">.</span>by<span className="cbb-accent">.</span>barca <span className="demo-ui">UI</span></>;

const INSTALL = {
  npm: "npm install code-by-barca-ui",
  yarn: "yarn add code-by-barca-ui",
  pnpm: "pnpm add code-by-barca-ui",
};
const USAGE = `// 1) styly – jednou v kořeni aplikace
import "code-by-barca-ui/styles.css";

// 2) komponenty
import { Button, Toaster, toast } from "code-by-barca-ui";

export default function App() {
  return (
    <div className="cbb-root">
      <Button glow onClick={() => toast.success("Uloženo")}>Uložit</Button>
      <Toaster />
    </div>
  );
}`;
const NEXT = `"use client";
import Link from "next/link";
import { CbbProvider } from "code-by-barca-ui";

export function Providers({ children }) {
  return <CbbProvider linkComponent={Link}>{children}</CbbProvider>;
}`;
const THEME = `:root {
  --cbb-accent: #22d3ee;       /* hlavní barva */
  --cbb-accent-hover: #67e8f9;
  --cbb-bg: #050505;           /* pozadí */
  --cbb-radius-lg: 20px;
}`;
const TW = `// tailwind.config.js (volitelné)
module.exports = {
  presets: [require("code-by-barca-ui/tailwind-preset")],
};
// pak: bg-cbb-surface, text-cbb-accent, rounded-cbb-lg …`;

const total = CATEGORIES.reduce((n, c) => n + c.docs.length, 0);

function App() {
  const [active, setActive] = useState("uvod");
  const [mobileNav, setMobileNav] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  // scroll-spy: aktivní položka v panelu podle toho, co je vidět
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-spy]"));
    const obs = new IntersectionObserver(
      (entries) => {
        const vis = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (vis[0]) setActive((vis[0].target as HTMLElement).id);
      },
      { rootMargin: "-80px 0px -65% 0px" }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  // přímý odkaz (#button) po načtení doskočí na kotvu
  useEffect(() => {
    const id = decodeURIComponent(location.hash.slice(1));
    if (id) requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView());
  }, []);

  const go = (id: string) => { setMobileNav(false); setActive(id); history.replaceState(null, "", `#${id}`); document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" }); };

  const groups: SidebarGroup[] = useMemo(() => [
    { title: "Začínáme", items: [
      { label: "Úvod", icon: <SparklesIcon size={16} />, active: active === "uvod", onClick: () => go("uvod") },
      { label: "Instalace", icon: <ArrowDownIcon size={16} />, active: active === "instalace", onClick: () => go("instalace") },
      { label: "Ukázkový web", icon: <FolderIcon size={16} />, active: active === "showcase", onClick: () => go("showcase") },
    ] },
    ...CATEGORIES.map((c) => ({
      title: c.title,
      items: c.docs.map((d) => ({ label: d.name, active: active === d.id, onClick: () => go(d.id) })),
    })),
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ], [active]);

  const searchItems = useMemo(() => CATEGORIES.flatMap((c) => c.docs.map((d) => ({ id: d.id, label: d.name, category: c.title }))), []);

  const nav = <Sidebar groups={groups} header={logo} collapsed={collapsed} onCollapsedChange={setCollapsed} footer={<span className="demo-muted" style={{ fontSize: 12 }}>v{pkg.version} · {total} komponent</span>} aria-label="Komponenty" />;

  return (
    <CbbProvider>
      <div className="cbb-root demo-root">
        <ScrollProgress />
        <Toaster />
        <MessageBoxHost />

        <aside className={`demo-side ${collapsed ? "is-collapsed" : ""}`}>{nav}</aside>
        <Sheet open={mobileNav} side="left" onClose={() => setMobileNav(false)} title="Komponenty">
          <Sidebar groups={groups} aria-label="Komponenty (mobil)" className="demo-side-mobile" />
        </Sheet>

        <div className="demo-main">
          <div className="demo-topbar">
            <Button variant="ghost" size="sm" aria-label="Otevřít menu" className="demo-burger" onClick={() => setMobileNav(true)}><MenuIcon size={18} /></Button>
            <div className="demo-search"><SearchAutocomplete items={searchItems} shortcut placeholder="Hledat komponentu…" onSelect={(id) => go(id)} /></div>
            <Button variant="outline" size="sm" href={REPO} target="_blank" rel="noopener noreferrer" leftIcon={<GithubIcon size={16} />}>GitHub</Button>
          </div>

          <main className="demo-content">
            {/* ───────── Úvod ───────── */}
            <section id="uvod" data-spy className="demo-hero">
              <Badge icon={<SparklesIcon size={14} />}>v{pkg.version} · open source</Badge>
              <h1>code<span className="cbb-accent">.</span>by<span className="cbb-accent">.</span>barca <span className="cbb-accent">UI</span></h1>
              <p className="demo-lead">Čistá UI knihovna pro <a className="cbb-link" href="https://code-by-barca.cz">code-by-barca.cz</a> – tmavý „geeky“ vzhled se žlutým akcentem. {total} komponent v Reactu a TypeScriptu, <strong>bez závislosti na Tailwindu</strong>, s přístupnou klávesnicí a podporou Next.js.</p>
              <div className="demo-hero__actions">
                <Button size="lg" glow href={ZIP} leftIcon={<ArrowDownIcon size={18} />}>Stáhnout (.zip)</Button>
                <Button size="lg" variant="outline" href={REPO} target="_blank" rel="noopener noreferrer" leftIcon={<GithubIcon size={18} />}>Zobrazit na GitHubu</Button>
              </div>
              <ul className="demo-features">
                {["Bez Tailwindu – hotové CSS s prefixem cbb-", "Přebarvení přes CSS proměnné", "Next.js App Router (use client)", "Klávesnice a čtečky obrazovky", "Respektuje prefers-reduced-motion", "Tree-shaking, ESM i CJS"].map((t) => <li key={t}><CheckIcon size={16} />{t}</li>)}
              </ul>
            </section>

            {/* ───────── Instalace ───────── */}
            <section id="instalace" data-spy className="demo-section">
              <h2 className="demo-h2">Instalace</h2>
              <p className="demo-muted">Balíček se připravuje k publikaci na npm. Až bude venku, nainstaluješ ho jedním příkazem:</p>
              <Tabs tabs={Object.entries(INSTALL).map(([k, v]) => ({ value: k, label: k, content: <CodeBlock language="bash" code={v} /> }))} />
              <h3 className="demo-h3">Použití</h3>
              <CodeBlock language="tsx" code={USAGE} />
              <p className="demo-note">Třída <code className="demo-code">cbb-root</code> je volitelná – nastaví tmavé pozadí, bílý text a font.</p>
              <div className="demo-grid2">
                <div><h3 className="demo-h3">Next.js</h3><CodeBlock language="tsx" code={NEXT} /></div>
                <div><h3 className="demo-h3">Přebarvení</h3><CodeBlock language="css" code={THEME} /></div>
              </div>
              <h3 className="demo-h3">Tailwind preset <Badge variant="secondary">volitelné</Badge></h3>
              <CodeBlock language="js" code={TW} />
              <h3 className="demo-h3">Než je na npm</h3>
              <p className="demo-muted">Stáhni zip, rozbal a v adresáři knihovny spusť:</p>
              <CodeBlock language="bash" code={"npm install\nnpm run build\n# v projektu pak:\nnpm install ../cesta/k/code-by-barca-ui"} />
            </section>

            {/* ───────── Ukázkový web ───────── */}
            <section id="showcase" data-spy className="demo-section">
              <h2 className="demo-h2">Ukázkový web</h2>
              <p className="demo-muted">Celá ukázka je poskládaná jen z komponent knihovny – klikej, filtruj, otevírej dialogy a obrázky. Kód každé komponenty najdeš níže.</p>
              <Showcase />
            </section>

            {/* ───────── Kategorie ───────── */}
            {CATEGORIES.map((c) => (
              <div key={c.id} id={c.id} className="demo-category">
                <h2 className="demo-h2">{c.title}</h2>
                {c.docs.map((d) => <DocBlock key={d.id} doc={d} category={c.title} />)}
              </div>
            ))}

            <footer className="demo-footer">
              <span>© {new Date().getFullYear()} Barbora Šanderová · MIT</span>
              <a className="cbb-link" href={REPO} target="_blank" rel="noopener noreferrer">GitHub</a>
            </footer>
          </main>
        </div>
      </div>
    </CbbProvider>
  );
}

createRoot(document.getElementById("root")!).render(<App />);
