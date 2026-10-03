import { useState } from "react";
import {
  Navbar, AlertBar, SectionHeading, SkillCard, ProjectCard, Tabs, Table, ContactForm, Timeline, Accordion, Badge, Button,
  Card, StatCard, Avatar, Progress, Breadcrumb, Stepper, Switch, Slider, TagInput, InputOTP, FileUpload, DateTimePicker, Select,
  Checkbox, Radio, Toggle, ToggleGroup, Tooltip, Dropdown, Popover, HoverCard, Dialog, Sheet, Lightbox, useLightbox, Carousel,
  Chip, Tag, Kbd, Divider, EmptyState, Skeleton, CodeBlock, InfoRow, SocialLinks, Typewriter, Reveal, Pagination, Collapsible,
  SearchBar, SearchAutocomplete, FilterPills, FilterBar, useFilter, Calendar, Resizable, ScrollArea, FAB, NotificationPopover,
  NotificationBadge, Menubar, Alert, SkillLevelBar, LazyImage, messageBox, toast, MailIcon, MapPinIcon, GithubIcon,
  CodeIcon, PaletteIcon, SparklesIcon, FolderIcon, BellIcon, PlusIcon, SearchIcon, MoreIcon,
  type FilterDef, type SortDef,
} from "../src";
import { img } from "./img";

type P = { id: string; title: string; cat: string; tags: string[]; date: string; hue: number };
const PROJECTS: P[] = [
  { id: "1", title: "Code by Barca", cat: "Web Design", tags: ["Next.js", "Tailwind", "FastAPI"], date: "2026-03-12", hue: 48 },
  { id: "2", title: "Chytrá zahrada", cat: "Arduino", tags: ["Arduino", "C++"], date: "2026-01-02", hue: 140 },
  { id: "3", title: "E-shop pro květinářství", cat: "Web Development", tags: ["React", "Node"], date: "2025-11-18", hue: 330 },
  { id: "4", title: "Cinema Space", cat: "Software", tags: ["Java", "JavaFX"], date: "2025-06-05", hue: 200 },
];
const FILTERS: FilterDef<P>[] = [
  { key: "cat", label: "Kategorie", multiple: true, getValue: (p) => p.cat },
  { key: "tags", label: "Tagy", multiple: true, getValue: (p) => p.tags },
];
const SORTS: SortDef<P>[] = [
  { value: "new", label: "Nejnovější", compare: (a, b) => +new Date(b.date) - +new Date(a.date) },
  { value: "title", label: "Podle názvu", compare: (a, b) => a.title.localeCompare(b.title, "cs") },
];
const logo = <>code<span className="cbb-accent">.</span>by<span className="cbb-accent">.</span>barca</>;

/** Ukázkový web poskládaný jen z komponent knihovny – bez jediného vlastního stylu komponent. */
export function Showcase() {
  const [tab, setTab] = useState("a");
  const f = useFilter({ items: PROJECTS, searchText: (p) => `${p.title} ${p.tags.join(" ")}`, filters: FILTERS, sorts: SORTS });
  const [dialog, setDialog] = useState(false);
  const [sheet, setSheet] = useState(false);
  const [on, setOn] = useState(true);
  const [vol, setVol] = useState(60);
  const [tags, setTags] = useState(["React", "UI"]);
  const [otp, setOtp] = useState("");
  const [pill, setPill] = useState("all");
  const [view, setView] = useState("grid");
  const [bold, setBold] = useState(false);
  const [lang, setLang] = useState("cs");
  const [ok, setOk] = useState(true);
  const [date, setDate] = useState<string | null>("2026-10-01T14:30:00.000Z");
  const [page, setPage] = useState(2);
  const [q, setQ] = useState("");
  const [cal, setCal] = useState<Date | null>(new Date());
  const [notifs, setNotifs] = useState([{ id: "1", title: "Nový komentář", time: "před 5 min" }, { id: "2", title: "Projekt publikován", time: "včera", read: true }]);
  const lb = useLightbox();
  const shots = PROJECTS.map((p) => ({ src: img(p.title, 1200, 700, p.hue), alt: p.title, caption: p.title }));

  return (
    <div className="demo-showcase">
      <AlertBar variant="brand" dismissible={false} icon={<SparklesIcon size={16} />} action={{ label: "Zjistit víc", href: "#button" }}>Ukázkový web – vše níže je poskládané jen z komponent knihovny.</AlertBar>
      <Navbar fixed={false} brand={logo} items={[{ label: "Domů", href: "#showcase", active: true }, { label: "Dovednosti", href: "#showcase" }, { label: "Projekty", href: "#showcase" }, { label: "Kontakt", href: "#showcase" }]}
        extras={<><NotificationPopover notifications={notifs} onMarkAllRead={() => setNotifs((l) => l.map((n) => ({ ...n, read: true })))} onDismiss={(id) => setNotifs((l) => l.filter((n) => n.id !== id))} /></>}
        cta={<Button size="sm" onClick={() => setDialog(true)}>Let's Talk</Button>} />

      <div className="demo-showcase__body">
        <section className="demo-showcase__hero">
          <Badge icon={<SparklesIcon size={14} />}>Otevřena novým nápadům</Badge>
          <h2>Barbora<span className="cbb-accent">.</span> <span style={{ color: "var(--cbb-text-muted)" }}>Šanderová</span></h2>
          <p className="demo-showcase__tagline">I'm a <Typewriter words={["Web Developer", "UI/UX Designer", "Creative Coder"]} /></p>
          <Row2>
            <Button glow>Ukázka mé práce</Button>
            <Button variant="outline" leftIcon={<GithubIcon size={16} />}>GitHub</Button>
            <Tooltip content="Otevřít hledání"><span><Kbd>Ctrl</Kbd> <Kbd>K</Kbd></span></Tooltip>
          </Row2>
        </section>

        <Breadcrumb items={[{ label: "Domů", href: "#showcase" }, { label: "Ukázka" }]} />

        <div className="demo-grid4">
          <StatCard label="Projektů" value="12" icon={<FolderIcon size={18} />} />
          <StatCard label="Zobrazení / měsíc" value="2 340" change="+8.2%" />
          <StatCard label="Dovedností" value="5" icon={<CodeIcon size={18} />} />
          <Card form raised><Row2><Avatar initials="BŠ" status="online" /><div><strong>Barbora</strong><div className="demo-muted" style={{ fontSize: 12 }}>online</div></div><AvatarBadge n={notifs.filter((n) => !n.read).length} /></Row2></Card>
        </div>

        <SectionHeading eyebrow="// Skills" title="Dovednosti &" accent="Technologie" description="Propojování designu a vývoje" />
        <div className="demo-grid3">
          <Reveal index={0}><SkillCard icon={<CodeIcon size={28} />} title="Web Development" description="Statické weby i backend." level={4} tools={["React", "Next.js", "FastAPI"]} onClick={() => toast.info("Detail dovednosti")} /></Reveal>
          <Reveal index={1}><SkillCard icon={<PaletteIcon size={28} />} title="Web Design" description="Layout, ikony, mikroanimace." level={3} tools={["Figma"]} /></Reveal>
          <Reveal index={2}><Card form corners glow><strong>Úroveň</strong><div style={{ marginTop: 12 }}><SkillLevelBar level={2} /></div><div style={{ marginTop: 16 }}><Progress label="Arduino" value={55} showValue /></div></Card></Reveal>
        </div>

        <SectionHeading align="left" eyebrow="// Portfolio" title="Hotové" accent="Projekty" action={<Button size="sm" variant="soft" onClick={() => lb.open(0)}>Galerie</Button>} />
        <FilterBar filter={f} />
        <div className="demo-grid3">
          {f.filtered.map((p) => <ProjectCard key={p.id} category={p.cat} year={p.date.slice(0, 4)} title={p.title} description="Ukázkový projekt z portfolia." image={img(p.title, 800, 450, p.hue)} tags={p.tags} maxTags={3} onClick={() => lb.open(Number(p.id) - 1)} />)}
          {f.filtered.length === 0 && <div style={{ gridColumn: "1 / -1" }}><EmptyState icon={<SearchIcon size={32} />} title="Nic nenalezeno" action={<Button size="sm" variant="soft" onClick={f.reset}>Zrušit filtry</Button>} /></div>}
        </div>
        <Lightbox {...lb.props} items={shots} />

        <div className="demo-grid2">
          <Card form>
            <Tabs value={tab} onChange={setTab} tabs={[
              { value: "a", label: "Ovládací prvky", content: (
                <div className="demo-stack">
                  <Switch checked={on} onChange={setOn} label="Zobrazit na webu" />
                  <Slider label="Průhlednost" value={vol} onChange={setVol} formatValue={(x) => `${x} %`} />
                  <Checkbox checked={ok} onChange={setOk} label="Souhlasím s GDPR" />
                  <Radio orientation="horizontal" value={lang} onChange={setLang} aria-label="Jazyk" options={[{ value: "cs", label: "CZ" }, { value: "en", label: "EN" }]} />
                  <Row2><Toggle pressed={bold} onChange={setBold} aria-label="Tučně"><b>B</b></Toggle><ToggleGroup aria-label="Zobrazení" value={view} onChange={setView} items={[{ value: "grid", label: "Mřížka" }, { value: "list", label: "Seznam" }]} /></Row2>
                </div>
              ) },
              { value: "b", label: "Zadávání", content: (
                <div className="demo-stack">
                  <TagInput label="Tagy" tags={tags} onChange={setTags} />
                  <Select label="Typ projektu" defaultValue="web" options={[{ value: "web", label: "Web" }, { value: "app", label: "Aplikace" }]} />
                  <DateTimePicker value={date} onChange={setDate} />
                  <InputOTP value={otp} onChange={setOtp} length={4} />
                  <FileUpload label="Přílohy" accept="image/*" maxSize="2MB" onUpload={(fl) => toast.info(`Soubory: ${fl.length}`)} />
                </div>
              ) },
              { value: "c", label: "Rozbalovací", content: (
                <div className="demo-stack">
                  <Accordion items={[{ title: "Potřebuju Tailwind?", content: "Ne.", defaultOpen: true }, { title: "Funguje to v Next.js?", content: "Ano." }]} />
                  <Collapsible trigger="Pokročilé možnosti"><p className="demo-muted">Další nastavení…</p></Collapsible>
                  <Row2>
                    <Dropdown trigger={<Button variant="outline" rightIcon={<MoreIcon size={16} />}>Akce</Button>} items={[{ label: "Nový", icon: <PlusIcon size={16} />, shortcut: "⌘N" }, { separator: true, label: "" }, { label: "Smazat", variant: "destructive" }]} />
                    <Popover trigger={<Button variant="outline">Popover</Button>}><div style={{ padding: 14 }}>Obsah panelu</div></Popover>
                    <HoverCard trigger={<span className="cbb-link">@barbora</span>}><div style={{ padding: 14 }}>Profil</div></HoverCard>
                    <Button variant="destructive" onClick={async () => { const r = await messageBox.confirm({ title: "Smazat projekt?", variant: "destructive", okLabel: "Smazat" }); toast.show({ title: r ? "Smazáno" : "Zrušeno" }); }}>Smazat…</Button>
                    <Button variant="soft" onClick={() => setSheet(true)}>Sheet</Button>
                  </Row2>
                </div>
              ) },
            ]} />
          </Card>
          <div className="demo-stack">
            <Alert variant="success" title="Uloženo">Změny jsou na webu.</Alert>
            <Carousel slides={shots.map((s) => <img key={s.src} src={s.src} alt={s.alt} style={{ width: "100%", display: "block" }} />)} />
            <Row2><Chip onRemove={() => {}}>React</Chip><Tag>Next.js</Tag><Tag interactive>Interaktivní</Tag><NotificationBadge count={3}><BellIcon size={22} /></NotificationBadge></Row2>
            <Divider label="nebo" />
            <Row2><Skeleton variant="circle" /><div style={{ flex: 1 }}><Skeleton variant="text" width="60%" /><div style={{ height: 8 }} /><Skeleton variant="text" /></div></Row2>
          </div>
        </div>

        <Table<P & Record<string, unknown>> searchable data={PROJECTS as (P & Record<string, unknown>)[]} columns={[
          { key: "title", label: "Projekt", sortable: true },
          { key: "cat", label: "Kategorie", filterable: true },
          { key: "date", label: "Datum", align: "right", sortable: true },
        ]} />
        <Row2><Pagination currentPage={page} totalPages={9} onPageChange={setPage} /><SearchBar value={q} onChange={setQ} /></Row2>
        <Row2><FilterPills aria-label="Kategorie" value={pill} onChange={setPill} options={[{ value: "all", label: "All" }, { value: "web", label: "Web" }, { value: "dev", label: "Dev" }]} /><Menubar menus={[{ label: "Soubor", items: [{ label: "Nový", shortcut: "⌘N" }] }, { label: "Úpravy", items: [{ label: "Zpět", shortcut: "⌘Z" }] }]} /></Row2>
        <div style={{ maxWidth: 420 }}><SearchAutocomplete shortcut items={PROJECTS.map((p) => ({ id: p.id, label: p.title, category: p.cat }))} onSelect={(_, it) => toast.info(it.label)} /></div>
        <Stepper currentStep={1} steps={["Údaje", "Obsah", "Náhled", "Publikace"]} />

        <div className="demo-grid2">
          <div className="demo-stack">
            <Timeline entries={[{ period: "2024 — dnes", title: "Freelance", subtitle: "Web & design" }, { period: "2020 — 2022", title: "Web Administrátor", subtitle: "Rybáři Broumov" }]} />
            <InfoRow icon={<MailIcon size={20} />} label="Email" value="barcasan.san@icloud.com" href="mailto:barcasan.san@icloud.com" />
            <InfoRow icon={<MapPinIcon size={20} />} label="Lokace" value="Broumov, Náchod" />
            <SocialLinks links={[{ label: "GitHub", href: "https://github.com/Barbora-san", icon: <GithubIcon size={20} /> }]} />
          </div>
          <Card form corners><ContactForm onSubmit={async () => { await new Promise((r) => setTimeout(r, 500)); toast.success("Zpráva odeslána"); }} /></Card>
        </div>

        <div className="demo-grid2">
          <CodeBlock language="tsx" showLineNumbers code={`import { Button } from "code-by-barca-ui";\n\n<Button glow>Ahoj</Button>`} />
          <div style={{ height: 200, border: "1px solid var(--cbb-border)", borderRadius: 12, overflow: "hidden" }}>
            <Resizable firstPanel={<ScrollArea maxHeight={200} className="demo-scroll">{Array.from({ length: 10 }, (_, i) => <p key={i} className="demo-muted" style={{ margin: "0 0 6px" }}>Řádek {i + 1}</p>)}</ScrollArea>} secondPanel={<div className="demo-panel demo-panel--alt"><LazyImage src={img("LazyImage", 400, 300)} alt="Ukázka" /></div>} />
          </div>
        </div>
        <Calendar selected={cal} onSelect={setCal} />
        <FAB fixed={false} icon={<PlusIcon size={22} />} aria-label="Nový projekt" />
      </div>

      <Dialog open={dialog} onClose={() => setDialog(false)} title="Let's Talk" description="Ukázkový dialog." footer={<Button onClick={() => setDialog(false)}>Zavřít</Button>}>
        <p className="demo-muted">Napiš mi o svém nápadu.</p>
      </Dialog>
      <Sheet open={sheet} onClose={() => setSheet(false)} title="Boční panel" footer={<Button onClick={() => setSheet(false)}>Hotovo</Button>}><p className="demo-muted">Obsah panelu.</p></Sheet>
    </div>
  );
}

function Row2({ children }: { children: React.ReactNode }) {
  return <div style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center" }}>{children}</div>;
}
function AvatarBadge({ n }: { n: number }) {
  return n > 0 ? <Badge variant="warning" style={{ marginLeft: "auto" }}>{n} nových</Badge> : null;
}
