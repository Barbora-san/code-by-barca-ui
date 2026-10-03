import { useEffect, useRef, useState } from "react";
import {
  useFilter, FilterBar, FilterPills, FilterDropdown, ProjectCard, EmptyState, Table, Calendar, Carousel, Resizable, ScrollArea,
  FAB, Badge, Button, PlusIcon, useScrollReveal, useLockBodyScroll, useEscape, Floating, useClickOutside, useControllable,
  cn, SearchIcon, TagIcon, LayersIcon, type FilterDef, type SortDef,
} from "../../src";
import { Row, Col } from "../ui";
import { img } from "../img";
import type { Category } from "./types";

type Project = { id: string; title: string; status: "hotovo" | "wip"; category: string; tags: string[]; date: string };
const PROJECTS: Project[] = [
  { id: "1", title: "Redesign portfolia", status: "hotovo", category: "Web Design", tags: ["Next.js", "Tailwind"], date: "2026-03-12" },
  { id: "2", title: "Chytrá zahrada", status: "wip", category: "Arduino", tags: ["Arduino", "C++"], date: "2026-01-02" },
  { id: "3", title: "E-shop pro květinářství", status: "hotovo", category: "Web Development", tags: ["React", "FastAPI"], date: "2025-11-18" },
  { id: "4", title: "Cinema Space", status: "hotovo", category: "Software", tags: ["Java", "JavaFX"], date: "2025-06-05" },
  { id: "5", title: "3D stojan na telefon", status: "wip", category: "3D modelování", tags: ["Blender"], date: "2026-02-20" },
];
const FILTERS: FilterDef<Project>[] = [
  { key: "status", label: "Status", icon: <LayersIcon size={16} />, getValue: (p) => p.status, allLabel: "Vše" },
  { key: "category", label: "Kategorie", multiple: true, getValue: (p) => p.category },
  { key: "tags", label: "Tagy", icon: <TagIcon size={16} />, multiple: true, getValue: (p) => p.tags },
];
const SORTS: SortDef<Project>[] = [
  { value: "new", label: "Nejnovější", compare: (a, b) => +new Date(b.date) - +new Date(a.date) },
  { value: "old", label: "Nejstarší", compare: (a, b) => +new Date(a.date) - +new Date(b.date) },
  { value: "title", label: "Podle názvu", compare: (a, b) => a.title.localeCompare(b.title, "cs") },
];

function FilterDemo() {
  const f = useFilter({ items: PROJECTS, searchText: (p) => `${p.title} ${p.tags.join(" ")}`, filters: FILTERS, sorts: SORTS });
  return (
    <Col>
      <FilterBar filter={f} />
      <div className="demo-grid3">
        {f.filtered.map((p) => <ProjectCard key={p.id} category={p.category} year={p.date.slice(0, 4)} title={p.title} image={img(p.title, 800, 450, 40 + Number(p.id) * 45)} tags={p.tags} onClick={() => {}} />)}
      </div>
      {f.filtered.length === 0 && <EmptyState icon={<SearchIcon size={32} />} title="Nic nenalezeno" action={<Button size="sm" variant="soft" onClick={f.reset}>Zrušit filtry</Button>} />}
    </Col>
  );
}
function PillsDemo() {
  const [v, setV] = useState("all");
  return <FilterPills aria-label="Kategorie" value={v} onChange={setV} options={[{ value: "all", label: "All", count: 12 }, { value: "web", label: "Web Design", count: 5 }, { value: "dev", label: "Web Development", count: 4 }, { value: "arduino", label: "Arduino", count: 3 }]} />;
}
function DropdownFilterDemo() {
  const [one, setOne] = useState("newest");
  const [multi, setMulti] = useState<string[]>(["react"]);
  return (
    <Row>
      <FilterDropdown label="Řadit" value={one} onChange={(v: string) => setOne(v)} options={[{ value: "newest", label: "Nejnovější" }, { value: "oldest", label: "Nejstarší" }, { value: "title", label: "Podle názvu" }]} />
      <FilterDropdown multiple label="Tech" icon={<TagIcon size={16} />} value={multi} onChange={(v: string[]) => setMulti(v)} options={[{ value: "react", label: "React", count: 4 }, { value: "next", label: "Next.js", count: 2 }, { value: "figma", label: "Figma", count: 3 }]} />
    </Row>
  );
}
function TableDemo() {
  return (
    <Table<Project>
      searchable
      data={PROJECTS}
      onRowClick={() => {}}
      columns={[
        { key: "title", label: "Projekt", sortable: true },
        { key: "category", label: "Kategorie", filterable: true },
        { key: "status", label: "Status", render: (r) => <Badge variant={r.status === "wip" ? "warning" : "success"} dot>{r.status}</Badge> },
        { key: "date", label: "Datum", align: "right", sortable: true },
      ]}
    />
  );
}
function CalendarDemo() {
  const [d, setD] = useState<Date | null>(new Date());
  return (
    <Row gap={24} align="flex-start">
      <Calendar selected={d} onSelect={setD} min={new Date(new Date().getFullYear(), new Date().getMonth(), 1)} />
      <span className="demo-muted">Vybráno: {d ? d.toLocaleDateString("cs-CZ") : "—"}</span>
    </Row>
  );
}
function FabDemo() {
  return <Row><FAB fixed={false} icon={<PlusIcon size={22} />} aria-label="Nový projekt" /><FAB fixed={false} variant="secondary" icon={<PlusIcon size={20} />} label="Nový projekt" /></Row>;
}
function ScrollRevealDemo() {
  const [ref, visible] = useScrollReveal<HTMLDivElement>();
  return <div ref={ref} className={cn("cbb-reveal", visible && "is-visible")}><Badge variant="success">Objevil jsem se</Badge></div>;
}
function EscDemo() {
  const [open, setOpen] = useState(false);
  useEscape(open, () => setOpen(false));
  return <Row><Button variant="outline" onClick={() => setOpen(true)}>Otevřít</Button>{open && <Badge variant="info">Zavři klávesou Esc</Badge>}</Row>;
}
function LockDemo() {
  const [locked, setLocked] = useState(false);
  useLockBodyScroll(locked);
  return <Row><Button variant="outline" onClick={() => setLocked(true)}>Zamknout scroll</Button>{locked && <Button onClick={() => setLocked(false)}>Odemknout</Button>}</Row>;
}
function FloatingDemo() {
  const anchor = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useControllable<boolean>(undefined, false, undefined);
  useClickOutside([anchor, panel], () => setOpen(false), open);
  return (
    <>
      <Button ref={anchor} variant="outline" onClick={() => setOpen(!open)}>Vlastní plovoucí panel</Button>
      <Floating anchorRef={anchor} panelRef={panel} open={open} side="bottom" align="start">
        <div style={{ padding: 14, background: "var(--cbb-surface)", border: "1px solid var(--cbb-border)", borderRadius: 12 }}>Poziciuje se sám a nevyjede z okna.</div>
      </Floating>
    </>
  );
}

export const dataCat: Category = {
  id: "filtrovani-data",
  title: "Filtrování, data a layout",
  docs: [
    {
      id: "usefilter",
      name: "useFilter + FilterBar",
      desc: "Hook pro hledání (bez diakritiky), filtry s jednou i více volbami a řazení. FilterBar z jeho výsledku vykreslí celou lištu včetně chipů aktivních filtrů a mobilního rozbalení.",
      props: [{ type: "UseFilterOptions", title: "useFilter({ … })" }, { type: "FilterBarProps", component: "FilterBar" }, { type: "FilterDef", title: "FilterDef (položka v filters)" }, { type: "SortDef", title: "SortDef (položka v sorts)" }],
      block: true,
      preview: <FilterDemo />,
      code: `const filters = [
  { key: "status", label: "Status", getValue: (p) => p.status },
  { key: "category", label: "Kategorie", multiple: true, getValue: (p) => p.category },
  { key: "tags", label: "Tagy", multiple: true, getValue: (p) => p.tags },
];
const sorts = [
  { value: "new", label: "Nejnovější", compare: (a, b) => +new Date(b.date) - +new Date(a.date) },
  { value: "title", label: "Podle názvu", compare: (a, b) => a.title.localeCompare(b.title, "cs") },
];

const f = useFilter({ items: projects, searchText: (p) => \`\${p.title} \${p.tags.join(" ")}\`, filters, sorts });

<FilterBar filter={f} sticky={80} />
{f.filtered.map((p) => <ProjectCard key={p.id} {...p} />)}`,
      note: "filters a sorts definuj mimo komponentu (nebo v useMemo), ať se zbytečně nepřepočítávají.",
    },
    {
      id: "filterpills",
      name: "FilterPills",
      desc: "Jednoduchý výběr jedné kategorie jako řada pilulek s počty.",
      props: ["FilterPills", { type: "FilterPillOption", title: "FilterPillOption (položka v options)" }],
      preview: <PillsDemo />,
      code: `<FilterPills value={cat} onChange={setCat} options={[
  { value: "all", label: "All", count: 12 },
  { value: "web", label: "Web Design", count: 5 },
]} />`,
    },
    {
      id: "filterdropdown",
      name: "FilterDropdown",
      desc: "Rozbalovací filtr s jednou nebo více volbami, počty a tlačítky „Vybrat vše / Zrušit“.",
      props: ["FilterDropdown", { type: "FilterOption", title: "FilterOption (položka v options)" }],
      preview: <DropdownFilterDemo />,
      code: `<FilterDropdown label="Řadit" value={sort} onChange={setSort} options={sortOptions} />

<FilterDropdown multiple label="Tech" icon={<TagIcon size={16} />} value={techs} onChange={setTechs}
  options={[{ value: "react", label: "React", count: 4 }]} />`,
    },
    {
      id: "table",
      name: "Table",
      desc: "Tabulka s hledáním, řazením, filtrem sloupce, ořezem textu a vlastním vykreslením buněk.",
      props: ["Table", { type: "TableColumn", title: "TableColumn (položka v columns)" }],
      block: true,
      preview: <TableDemo />,
      code: `<Table<Project>
  searchable
  data={projects}
  onRowClick={(row) => open(row.id)}
  columns={[
    { key: "title", label: "Projekt", sortable: true },
    { key: "category", label: "Kategorie", filterable: true },
    { key: "status", label: "Status", render: (r) => <Badge>{r.status}</Badge> },
  ]}
/>`,
    },
    {
      id: "calendar",
      name: "Calendar",
      desc: "Měsíční kalendář s týdnem od pondělí a omezením min / max.",
      props: ["Calendar"],
      preview: <CalendarDemo />,
      code: `const [date, setDate] = useState<Date | null>(new Date());

<Calendar selected={date} onSelect={setDate} min={new Date()} />`,
    },
    {
      id: "carousel",
      name: "Carousel",
      desc: "Karusel se šipkami, tečkami, tažením prstem / myší a volitelným autoplayem.",
      props: ["Carousel"],
      preview: (
        <div style={{ width: "100%", maxWidth: 560 }}>
          <Carousel autoplay={5000} slides={[1, 2, 3].map((i) => <img key={i} src={img(`Slide ${i}`, 1120, 630, 40 + i * 60)} alt={`Slide ${i}`} style={{ width: "100%", display: "block" }} />)} />
        </div>
      ),
      code: `<Carousel
  loop
  autoplay={5000}
  slides={shots.map((s) => <img key={s.src} src={s.src} alt={s.alt} />)}
/>`,
    },
    {
      id: "resizable",
      name: "Resizable",
      desc: "Dva panely s tahacím oddělovačem – myš, dotyk i šipky.",
      props: ["Resizable"],
      block: true,
      preview: (
        <div style={{ height: 180, border: "1px solid var(--cbb-border)", borderRadius: 12, overflow: "hidden" }}>
          <Resizable defaultSize={35} minSize={20} firstPanel={<div className="demo-panel">Panel A</div>} secondPanel={<div className="demo-panel demo-panel--alt">Panel B – táhni za oddělovač</div>} />
        </div>
      ),
      code: `<Resizable defaultSize={35} minSize={20} firstPanel={<Files />} secondPanel={<Editor />} />`,
    },
    {
      id: "scrollarea",
      name: "ScrollArea",
      desc: "Scrollovatelná oblast s tenkým posuvníkem ve stylu knihovny.",
      props: ["ScrollArea"],
      preview: (
        <ScrollArea maxHeight={140} className="demo-scroll">
          {Array.from({ length: 14 }, (_, i) => <p key={i} style={{ margin: "0 0 8px" }} className="demo-muted">Řádek obsahu č. {i + 1}</p>)}
        </ScrollArea>
      ),
      code: `<ScrollArea maxHeight={140}>…dlouhý obsah…</ScrollArea>`,
    },
    {
      id: "fab",
      name: "FAB",
      desc: "Plovoucí akční tlačítko. V ukázce je fixed vypnuté, jinak se přilepí do rohu okna.",
      props: ["FAB"],
      preview: <FabDemo />,
      code: `<FAB icon={<PlusIcon size={22} />} aria-label="Nový projekt" onClick={create} />
<FAB variant="secondary" position="bottom-left" icon={<PlusIcon />} label="Nový projekt" />`,
    },
  ],
};

export const utils: Category = {
  id: "hooky-utility",
  title: "Hooky a utility",
  docs: [
    {
      id: "usescrollreveal",
      name: "useScrollReveal",
      desc: "Hook pod komponentou Reveal – vrací ref a visible, až prvek vjede do okna.",
      props: [{ type: "UseScrollRevealOptions", title: "useScrollReveal({ … })" }],
      preview: <ScrollRevealDemo />,
      code: `const [ref, visible] = useScrollReveal<HTMLDivElement>();

<div ref={ref} className={cn("cbb-reveal", visible && "is-visible")}>…</div>`,
    },
    {
      id: "useescape",
      name: "useEscape",
      desc: "Zavolá funkci při stisku Esc, dokud je aktivní.",
      props: [],
      preview: <EscDemo />,
      code: `useEscape(open, () => setOpen(false));`,
    },
    {
      id: "uselockbodyscroll",
      name: "useLockBodyScroll",
      desc: "Zamkne scroll stránky (modaly, menu) a vrátí ho zpět. Zvládá víc překryvů najednou.",
      props: [],
      preview: <LockDemo />,
      code: `useLockBodyScroll(open);`,
    },
    {
      id: "floating",
      name: "Floating + useClickOutside",
      desc: "Základ všech plovoucích prvků: přichytí panel k prvku, překlopí ho, když by vyjel z okna. Použij ho pro vlastní popovery. useControllable sjednotí řízený a neřízený stav.",
      props: [{ type: "FloatingProps", component: "Floating" }],
      preview: <FloatingDemo />,
      code: `const anchor = useRef<HTMLButtonElement>(null);
const panel = useRef<HTMLDivElement>(null);
const [open, setOpen] = useState(false);
useClickOutside([anchor, panel], () => setOpen(false), open);

<button ref={anchor} onClick={() => setOpen(!open)}>Otevřít</button>
<Floating anchorRef={anchor} panelRef={panel} open={open} side="bottom" align="start">…</Floating>`,
    },
    {
      id: "cbbprovider",
      name: "CbbProvider",
      desc: <>Předá knihovně router odkazů. Interní cesty (<code>/projekty</code>) pak půjdou přes <code>next/link</code>, externí a <code>#kotvy</code> zůstanou obyčejné <code>&lt;a&gt;</code>.</>,
      props: ["CbbProvider"],
      preview: <Badge variant="info">Bez zásahu do vzhledu – nastavení v kořeni aplikace</Badge>,
      code: `"use client";
import Link from "next/link";
import { CbbProvider } from "code-by-barca-ui";

export function Providers({ children }) {
  return <CbbProvider linkComponent={Link}>{children}</CbbProvider>;
}`,
    },
    {
      id: "cn",
      name: "cn",
      desc: "Spojí CSS třídy a zahodí falsy hodnoty – stejné použití jako clsx.",
      props: [],
      preview: <code className="demo-code">cn("a", false, "b", undefined) → "a b"</code>,
      code: `import { cn } from "code-by-barca-ui";

cn("cbb-card", active && "is-active", className);`,
    },
  ],
};

