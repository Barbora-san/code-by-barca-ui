import { useState } from "react";
import {
  Navbar, Sidebar, Menubar, Tabs, Breadcrumb, Pagination, Stepper, Accordion, Collapsible, ScrollProgress, SearchBar,
  SearchAutocomplete, CookieBanner, Button, Badge, HomeIcon, FolderIcon, SettingsIcon, UserIcon, BellIcon, CodeIcon,
  toast, ChevronDownIcon, type AutocompleteItem,
} from "../../src";
import { Row, Col } from "../ui";
import type { Category } from "./types";

const brand = <>code<span className="cbb-accent">.</span>by<span className="cbb-accent">.</span>barca</>;

function SidebarDemo() {
  const [collapsed, setCollapsed] = useState(false);
  const [active, setActive] = useState("projects");
  const item = (id: string, label: string, icon: React.ReactNode, badge?: React.ReactNode) => ({ label, icon, badge, active: active === id, onClick: () => setActive(id) });
  return (
    <div style={{ height: 360, display: "flex", border: "1px solid var(--cbb-border)", borderRadius: 12, overflow: "hidden" }}>
      <Sidebar
        collapsed={collapsed}
        onCollapsedChange={setCollapsed}
        header={brand}
        groups={[
          { title: "Obsah", items: [item("home", "Přehled", <HomeIcon size={18} />), item("projects", "Projekty", <FolderIcon size={18} />, 12), item("skills", "Dovednosti", <CodeIcon size={18} />, 5)] },
          { title: "Systém", items: [item("users", "Administrátoři", <UserIcon size={18} />), item("bell", "Upozornění", <BellIcon size={18} />, 3), { label: "Nastavení", icon: <SettingsIcon size={18} />, disabled: true }] },
        ]}
        footer={<span className="demo-muted" style={{ fontSize: 12 }}>v0.1.0</span>}
      />
    </div>
  );
}
function TabsDemo() {
  return (
    <Col gap={24}>
      <Tabs tabs={[
        { label: "Základní info", content: <p className="demo-muted">Název, slug, kategorie a datum.</p> },
        { label: "Obsah", content: <p className="demo-muted">Bloky textu, obrázků a kódu.</p> },
        { label: "Nastavení", content: <p className="demo-muted">Zobrazení na webu, WIP, SEO.</p> },
        { label: "Archiv", content: null, disabled: true },
      ]} />
      <Tabs variant="pills" defaultValue="b" tabs={[
        { value: "a", label: "Vše", content: <p className="demo-muted">Všechny projekty.</p> },
        { value: "b", label: "Hotové", icon: <FolderIcon size={14} />, content: <p className="demo-muted">Dokončené projekty.</p> },
        { value: "c", label: "WIP", content: <p className="demo-muted">Rozpracované projekty.</p> },
      ]} />
    </Col>
  );
}
function PaginationDemo() {
  const [p, setP] = useState(4);
  return <Pagination currentPage={p} totalPages={12} onPageChange={setP} />;
}
function StepperDemo() {
  const [s, setS] = useState(1);
  return (
    <Col>
      <Stepper currentStep={s} onStepClick={setS} steps={["Údaje", { label: "Obsah", description: "Bloky" }, "Náhled", "Publikace"]} />
      <Row><Button size="sm" variant="outline" disabled={s === 0} onClick={() => setS(s - 1)}>Zpět</Button><Button size="sm" disabled={s === 3} onClick={() => setS(s + 1)}>Další</Button></Row>
    </Col>
  );
}
function SearchBarDemo() {
  const [q, setQ] = useState("");
  return <Col width={380}><SearchBar value={q} onChange={setQ} /></Col>;
}
const AUTO: AutocompleteItem[] = [
  { id: "p1", label: "Redesign portfolia", category: "Projekty", keywords: "next react" },
  { id: "p2", label: "Chytrá zahrada", category: "Projekty", keywords: "arduino" },
  { id: "s1", label: "Web Development", category: "Dovednosti" },
  { id: "s2", label: "3D modeling", category: "Dovednosti", keywords: "blender" },
  { id: "pg1", label: "GDPR", category: "Stránky" },
];
function CookieDemo() {
  const [open, setOpen] = useState(true);
  return (
    <Col>
      <Row><Button variant="outline" size="sm" onClick={() => setOpen(true)}>Zobrazit lištu</Button></Row>
      <div style={{ position: "relative", minHeight: 140 }}>
        <CookieBanner fixed={false} open={open} onClose={() => setOpen(false)} storageKey="demo-cookie" policyHref="#cookiebanner" onChange={(c) => toast.info(`Souhlas: ${c}`)} />
      </div>
    </Col>
  );
}

export const navigation: Category = {
  id: "navigace",
  title: "Navigace a lišty",
  docs: [
    {
      id: "navbar",
      name: "Navbar",
      desc: "Horní navigace s logem, odkazy, tlačítkem a mobilním menu. V ukázce je fixed vypnuté, na webu se přilepí nahoru.",
      props: ["Navbar", { type: "NavItem", title: "NavItem (položka v items)" }],
      block: true,
      preview: (
        <div className="demo-frame">
          <Navbar fixed={false} brand={brand} items={[{ label: "Domů", href: "#navbar", active: true }, { label: "Dovednosti", href: "#navbar" }, { label: "Projekty", href: "#navbar" }, { label: "Kontakt", href: "#navbar" }]} cta={<Button size="sm">Let's Talk</Button>} />
        </div>
      ),
      code: `<Navbar
  brand={<>code<span className="cbb-accent">.</span>by<span className="cbb-accent">.</span>barca</>}
  items={[
    { label: "Domů", href: "/", active: true },
    { label: "Projekty", href: "/projects" },
  ]}
  cta={<Button size="sm">Let's Talk</Button>}
/>`,
    },
    {
      id: "sidebar",
      name: "Sidebar",
      desc: "Svislá navigace (admin, dokumentace) se skupinami, odznaky a sbalením jen na ikony s tooltipy.",
      props: ["Sidebar", { type: "SidebarGroup", title: "SidebarGroup" }, { type: "SidebarItem", title: "SidebarItem" }],
      block: true,
      preview: <SidebarDemo />,
      code: `<Sidebar
  header={<Logo />}
  collapsed={collapsed}
  onCollapsedChange={setCollapsed}
  groups={[
    { title: "Obsah", items: [
      { label: "Projekty", icon: <FolderIcon size={18} />, badge: 12, href: "/admin/projects", active: true },
    ] },
  ]}
/>`,
    },
    {
      id: "menubar",
      name: "Menubar",
      desc: "Horizontální lišta nabídek jako v desktopové aplikaci (Soubor, Úpravy…).",
      props: ["Menubar", { type: "MenubarMenu", title: "MenubarMenu (položka v menus)" }],
      preview: (
        <Menubar menus={[
          { label: "Soubor", items: [{ label: "Nový projekt", shortcut: "⌘N", onSelect: () => toast.info("Nový") }, { label: "Export JSON", onSelect: () => toast.info("Export") }, { separator: true, label: "" }, { label: "Odhlásit", variant: "destructive" }] },
          { label: "Úpravy", items: [{ label: "Zpět", shortcut: "⌘Z" }, { label: "Znovu", shortcut: "⇧⌘Z", disabled: true }] },
          { label: "Zobrazit", items: [{ label: "Zobrazit web", onSelect: () => toast.info("Web") }] },
        ]} />
      ),
      code: `<Menubar menus={[
  { label: "Soubor", items: [{ label: "Nový projekt", shortcut: "⌘N", onSelect: create }] },
  { label: "Úpravy", items: [{ label: "Zpět", shortcut: "⌘Z" }] },
]} />`,
    },
    {
      id: "tabs",
      name: "Tabs",
      desc: "Záložky s obsahem – podtržené nebo pills. Funguje se šipkami, může být řízené (value) i neřízené.",
      props: ["Tabs", { type: "TabItem", title: "TabItem (položka v tabs)" }],
      preview: <TabsDemo />,
      code: `<Tabs tabs={[
  { label: "Základní info", content: <BasicForm /> },
  { label: "Obsah", content: <Blocks /> },
]} />

<Tabs variant="pills" defaultValue="b" tabs={[
  { value: "a", label: "Vše", content: <All /> },
  { value: "b", label: "Hotové", content: <Done /> },
]} />`,
    },
    {
      id: "breadcrumb",
      name: "Breadcrumb",
      desc: "Drobečková navigace. Poslední položka je aktuální stránka.",
      props: ["Breadcrumb", { type: "BreadcrumbItem", title: "BreadcrumbItem (položka v items)" }],
      preview: <Breadcrumb items={[{ label: "Domů", href: "#breadcrumb", icon: <HomeIcon size={14} /> }, { label: "Projekty", href: "#breadcrumb" }, { label: "Redesign portfolia" }]} />,
      code: `<Breadcrumb items={[
  { label: "Domů", href: "/", icon: <HomeIcon size={14} /> },
  { label: "Projekty", href: "/projects" },
  { label: "Redesign portfolia" },
]} />`,
    },
    {
      id: "pagination",
      name: "Pagination",
      desc: "Stránkování s trojtečkami. Pomocná funkce getPageRange vrátí čísla stránek, když chceš vlastní vzhled.",
      props: ["Pagination"],
      preview: <PaginationDemo />,
      code: `<Pagination currentPage={page} totalPages={12} onPageChange={setPage} siblingCount={1} />`,
    },
    {
      id: "stepper",
      name: "Stepper",
      desc: "Kroky průvodce. S onStepClick jde vracet se na dokončené kroky.",
      props: ["Stepper"],
      block: true,
      preview: <StepperDemo />,
      code: `<Stepper
  currentStep={step}
  onStepClick={setStep}
  steps={["Údaje", { label: "Obsah", description: "Bloky" }, "Náhled", "Publikace"]}
/>`,
    },
    {
      id: "accordion",
      name: "Accordion",
      desc: "Skládací sekce / FAQ. S multiple jde otevřít víc najednou.",
      props: ["Accordion", { type: "AccordionItem", title: "AccordionItem (položka v items)" }],
      preview: (
        <Accordion items={[
          { title: "Jak knihovnu nainstaluju?", content: "Přes npm nebo yarn, viz sekce Instalace.", defaultOpen: true },
          { title: "Potřebuju Tailwind?", content: "Ne, styly jsou hotové CSS s prefixem cbb-." },
          { title: "Funguje to v Next.js?", content: "Ano, knihovna je označená \"use client\"." },
          { title: "Zakázaná položka", content: "", disabled: true },
        ]} />
      ),
      code: `<Accordion items={[
  { title: "Potřebuju Tailwind?", content: "Ne, styly jsou hotové CSS s prefixem cbb-.", defaultOpen: true },
  { title: "Funguje to v Next.js?", content: "Ano." },
]} />`,
    },
    {
      id: "collapsible",
      name: "Collapsible",
      desc: "Jeden rozbalovací panel s vlastním spouštěčem.",
      props: ["Collapsible"],
      preview: (
        <Collapsible trigger={<span style={{ display: "inline-flex", gap: 8, alignItems: "center" }}>Pokročilé možnosti <ChevronDownIcon size={16} /></span>}>
          <p className="demo-muted">Tady jsou další nastavení, která většina lidí nepotřebuje.</p>
        </Collapsible>
      ),
      code: `<Collapsible trigger="Pokročilé možnosti">
  Další nastavení…
</Collapsible>`,
    },
    {
      id: "scrollprogress",
      name: "ScrollProgress",
      desc: <>Tenký proužek s postupem čtení stránky. <strong>V této dokumentaci běží úplně nahoře</strong> – scrolluj a sleduj ho.</>,
      props: ["ScrollProgress"],
      preview: <Badge variant="info">Proužek je vidět nahoře v okně</Badge>,
      code: `<ScrollProgress />                       // nahoře
<ScrollProgress position="bottom" height={4} />`,
    },
    {
      id: "searchbar",
      name: "SearchBar",
      desc: "Vyhledávací pole s ikonou a křížkem pro vymazání.",
      props: ["SearchBar"],
      preview: <SearchBarDemo />,
      code: `const [q, setQ] = useState("");

<SearchBar value={q} onChange={setQ} />`,
    },
    {
      id: "searchautocomplete",
      name: "SearchAutocomplete",
      desc: "Hledání s našeptávačem napříč obsahem. Hledá bez diakritiky, řadí do kategorií, otevírá se zkratkou Ctrl + K.",
      props: ["SearchAutocomplete", { type: "AutocompleteItem", title: "AutocompleteItem (položka v items)" }],
      preview: <Col width={420}><SearchAutocomplete items={AUTO} shortcut onSelect={(id, it) => toast.info(`Vybráno: ${it.label} (${id})`)} placeholder="Hledat v projektech…" /></Col>,
      code: `<SearchAutocomplete
  items={[{ id: "p1", label: "Redesign portfolia", category: "Projekty", keywords: "next react" }]}
  shortcut
  onSelect={(id, item) => router.push(\`/search/\${id}\`)}
/>`,
    },
    {
      id: "cookiebanner",
      name: "CookieBanner",
      desc: "Cookie lišta se souhlasem „nezbytné / vše“, uloženým v localStorage. Znovu ji otevřeš událostí COOKIE_OPEN_EVENT (např. z patičky). Tady je fixed vypnuté.",
      props: ["CookieBanner", { type: "CookieBannerTexts", title: "CookieBannerTexts (texts)" }],
      block: true,
      preview: <CookieDemo />,
      code: `import { CookieBanner, getCookieConsent, COOKIE_OPEN_EVENT } from "code-by-barca-ui";

<CookieBanner policyHref="/GDPR" onChange={(c) => c === "all" && loadAnalytics()} />

// znovu otevřít z patičky
window.dispatchEvent(new Event(COOKIE_OPEN_EVENT));`,
    },
  ],
};

