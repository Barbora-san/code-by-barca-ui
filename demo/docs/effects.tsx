import { useState } from "react";
import {
  FlipCard, TiltCard, TiltLayer, Checkbox, BeforeAfter, Folder, Wallet3D, FloatingInput, Marquee, TodoList, DataTable, AudioVisualizer, Badge,
  CodeIcon, SparklesIcon, LayersIcon, GithubIcon, TagIcon, type TodoItem, type DataColumn,
} from "../../src";
import { Row, Col } from "../ui";
import type { Doc } from "./types";

const face = { display: "flex", flexDirection: "column" as const, alignItems: "center", justifyContent: "center", height: "100%", gap: 6, textAlign: "center" as const, padding: 16 };

function FlipDemo() {
  return (
    <Row gap={24}>
      <div style={{ width: 240 }}>
        <FlipCard
          height={180}
          front={<div style={face}><b style={{ fontSize: 18 }}>Klikni na mě</b><span className="demo-muted">přední strana</span></div>}
          back={<div style={face}><b style={{ fontSize: 18 }}>Otočeno ✨</b><span className="demo-muted">zadní strana</span></div>}
        />
      </div>
      <div style={{ width: 240 }}>
        <FlipCard
          height={180}
          trigger="hover"
          direction="vertical"
          front={<div style={face}><b style={{ fontSize: 18 }}>Najeď myší</b><span className="demo-muted">svislé otočení</span></div>}
          back={<div style={face}><b style={{ fontSize: 18 }}>Hotovo</b><span className="demo-muted">trigger="hover"</span></div>}
        />
      </div>
    </Row>
  );
}

function TiltDemo() {
  return (
    <Row gap={32} align="flex-start">
      <Col width={280} gap={8}>
        <span className="demo-eyebrow">mode="card" – naklání se celá karta</span>
        <TiltCard>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <TiltLayer depth={30}><Badge>3D</Badge></TiltLayer>
            <TiltLayer depth={60}><b style={{ fontSize: 20 }}>Celá karta</b></TiltLayer>
            <span className="demo-muted">Karta se naklání za kurzorem a vrstvy vystupují dopředu.</span>
          </div>
        </TiltCard>
      </Col>
      <Col width={280} gap={8}>
        <span className="demo-eyebrow">mode="layers" – hýbou se jen vrstvy</span>
        <TiltCard mode="layers">
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <TiltLayer depth={20}><Badge>Paralaxa</Badge></TiltLayer>
            <TiltLayer depth={40}><b style={{ fontSize: 20 }}>Jednotlivé vrstvy</b></TiltLayer>
            <TiltLayer depth={-10}><span className="demo-muted">Karta zůstane rovná, vrstvy se posouvají různě rychle.</span></TiltLayer>
          </div>
        </TiltCard>
      </Col>
    </Row>
  );
}

function CompareDemo() {
  return (
    <div style={{ width: "100%", maxWidth: 520 }}>
      <BeforeAfter
        height={220}
        before={<div style={{ ...face, background: "#27272a", color: "#a1a1aa", fontFamily: "monospace" }}>{"<div>bez stylu</div>"}</div>}
        after={<div style={{ ...face, background: "linear-gradient(135deg,#facc15,#f59e0b)", color: "#000", fontWeight: 700, fontSize: 20 }}>Code by Barca ✦</div>}
      />
    </div>
  );
}

function FolderDemo() {
  const [last, setLast] = useState("—");
  const items = [
    { id: "0", label: "Brand.pdf", meta: "2,4 MB" },
    { id: "1", label: "Web.fig", meta: "18 MB" },
    { id: "2", label: "Faktura", meta: "Q3" },
  ].map((it) => ({ ...it, onClick: () => setLast(String(it.label)) }));
  return (
    <Col gap={32}>
      <Row gap={32} align="flex-end">
        <Folder label="Dokumenty" items={items} />
        <Folder label="Modrá složka" color="#60a5fa" items={items.slice(0, 2)} />
      </Row>
      <Col gap={8}>
        <span className="demo-eyebrow">variant="spread"</span>
        <Folder variant="spread" label="Projekty 2026" items={items} />
      </Col>
      <span className="demo-muted demo-mono">kliknuto na list: {last}</span>
    </Col>
  );
}

function WalletDemo() {
  return (
    <Wallet3D
      hint="Najeď myší pro zobrazení zůstatku"
      balance="12 450 Kč"
      cards={[
        { id: "1", brand: "Stripe", holder: "BARBORA Š.", holderLabel: "Majitel", number: "5524 9910 4242", color: "#635bff", textColor: "#fff" },
        { id: "2", brand: "Studio", holder: "CODE BY BARCA", holderLabel: "Firma", number: "9012 4432 8810", color: "#facc15", textColor: "#000" },
        { id: "3", brand: "Pay", holder: "hello@work.com", holderLabel: "E-mail", number: "3312 0045 0094", color: "#ffffff", textColor: "#1e293b" },
      ]}
    />
  );
}

function FloatingDemo() {
  const [v, setV] = useState("");
  const bad = v.length > 0 && !v.includes("@");
  return (
    <Col width={320} gap={20}>
      <FloatingInput label="Jméno" />
      <FloatingInput label="E-mail" type="email" value={v} onChange={(e) => setV(e.target.value)} error={bad ? "Chybí @" : undefined} hint="Ozveme se do 24 hodin" />
    </Col>
  );
}

const MQ_ITEMS = [
  { icon: <CodeIcon size={16} />, label: "React" },
  { icon: <SparklesIcon size={16} />, label: "TypeScript" },
  { icon: <LayersIcon size={16} />, label: "A11y" },
  { icon: <GithubIcon size={16} />, label: "Open source" },
  { icon: <TagIcon size={16} />, label: "Design system" },
];
function MarqueeDemo() {
  const [speed, setSpeed] = useState(60);
  const [rows, setRows] = useState(1);
  const [pill, setPill] = useState(false);
  const [iconOnly, setIconOnly] = useState(false);
  return (
    <Col gap={20}>
      <Marquee items={MQ_ITEMS} speed={speed} rows={rows} variant={pill ? "pill" : "plain"} iconOnly={iconOnly} />
      <Row gap={20}>
        <Checkbox label="Pilulky" checked={pill} onChange={setPill} />
        <Checkbox label="Jen ikony" checked={iconOnly} onChange={setIconOnly} />
        <label className="demo-muted" style={{ display: "flex", gap: 8, alignItems: "center" }}>
          Rychlost: {speed} px/s <input type="range" min={20} max={200} value={speed} onChange={(e) => setSpeed(Number(e.target.value))} />
        </label>
        <label className="demo-muted" style={{ display: "flex", gap: 8, alignItems: "center" }}>
          Řádky: {rows} <input type="range" min={1} max={4} value={rows} onChange={(e) => setRows(Number(e.target.value))} />
        </label>
      </Row>
    </Col>
  );
}

const TODOS: TodoItem[] = [
  { id: "1", text: "Dokončit knihovnu", done: false, priority: "high" },
  { id: "2", text: "Napsat dokumentaci", done: true, priority: "medium" },
  { id: "3", text: "Publikovat na npm", done: false, priority: "low" },
];
function TodoDemo() {
  return <TodoList defaultItems={TODOS} />;
}

type Row_ = { id: string; name: string; role: string; hours: number };
const ROWS: Row_[] = [
  { id: "1", name: "Eva", role: "Design", hours: 32 }, { id: "2", name: "Tomáš", role: "Vývoj", hours: 41 },
  { id: "3", name: "Anna", role: "Vývoj", hours: 28 }, { id: "4", name: "Petr", role: "Design", hours: 19 },
  { id: "5", name: "Lucie", role: "Test", hours: 37 }, { id: "6", name: "Jan", role: "Vývoj", hours: 44 },
  { id: "7", name: "Marie", role: "Test", hours: 23 },
];
const COLS: DataColumn<Row_>[] = [
  { key: "name", header: "Jméno", sortable: true },
  { key: "role", header: "Role", filterable: true, render: (r) => <Badge>{r.role}</Badge> },
  { key: "hours", header: "Hodiny", sortable: true, align: "right" },
];
function TableDemo() {
  return <DataTable rows={ROWS} columns={COLS} pageSize={4} />;
}

function AudioDemo() {
  return <AudioVisualizer title="Midnight Code" artist="Barca" duration={187} />;
}

export const EFFECT_DOCS: Doc[] = [
  {
    id: "flipcard", name: "FlipCard",
    desc: "Karta se dvěma stranami, která se otočí kliknutím, nebo najetím myší. Odkazy a tlačítka uvnitř fungují a skrytá strana je vypnutá pro klávesnici i čtečky.",
    preview: <FlipDemo />,
    code: `<FlipCard
  height={200}
  front={<h3>Přední strana</h3>}
  back={<p>Zadní strana</p>}
/>
<FlipCard trigger="hover" direction="vertical" front={…} back={…} />`,
  },
  {
    id: "tiltcard", name: "TiltCard",
    desc: <>Karta reagující na kurzor. Buď se naklání celá (<code>mode="card"</code>), nebo zůstane rovná a hýbou se jen jednotlivé vrstvy (<code>mode="layers"</code>). Vrstvy vytvoříš obalením obsahu do <code>TiltLayer</code> a hloubku nastavíš přes <code>depth</code>. Na dotyku a při omezeném pohybu zůstane klidná.</>,
    props: ["TiltCard", "TiltLayer"],
    preview: <TiltDemo />,
    code: `// celá karta se naklání, vrstvy vystupují dopředu
<TiltCard>
  <TiltLayer depth={60}><h3>Nadpis</h3></TiltLayer>
  <p>Obsah karty</p>
</TiltCard>

// karta rovná, hýbou se jen vrstvy (paralaxa)
<TiltCard mode="layers">
  <TiltLayer depth={20}><Badge>Nové</Badge></TiltLayer>
  <TiltLayer depth={60}><h3>Nadpis</h3></TiltLayer>
</TiltCard>`,
  },
  {
    id: "beforeafter", name: "BeforeAfter",
    desc: "Srovnání dvou stavů s tažnou lištou – myš, dotyk i šipky na klávesnici. Hodí se na úpravy fotek, redesign nebo srovnání kódu.",
    preview: <CompareDemo />,
    block: true,
    code: `<BeforeAfter
  height={280}
  before={<img src="/pred.jpg" alt="" />}
  after={<img src="/po.jpg" alt="" />}
/>`,
  },
  {
    id: "folder", name: "Folder",
    desc: <>Složka, ze které se po otevření vysunou listy. <code>variant="stack"</code> je kompaktní vějíř, <code>variant="spread"</code> větší složka s listy roztaženými vedle sebe. Každý list může být klikací.</>,
    props: ["Folder", { type: "FolderItem", title: "FolderItem" }],
    preview: <FolderDemo />,
    code: `<Folder
  label="Dokumenty"
  items={[
    { id: "1", label: "Projekty", meta: "4 kB", onClick: () => open("projekty") },
    { id: "2", label: "Faktury", meta: "8 kB" },
  ]}
/>

<Folder variant="spread" label="Projekty 2026" items={items} />`,
  },
  {
    id: "wallet3d", name: "Wallet3D",
    desc: "Peněženka s vrstvenými kartami. Po najetí (nebo klepnutí) vyjedou z kapsy, karta pod kurzorem se zvedne a ukáže celé číslo a zůstatek v kapse se odhalí. Barvy těla peněženky se mění proměnnými --cbb-wallet-body a --cbb-wallet-line.",
    props: ["Wallet3D", { type: "WalletCard", title: "WalletCard" }],
    preview: <WalletDemo />,
    code: `<Wallet3D
  balance="12 450 Kč"
  hint="Najeď myší pro zobrazení zůstatku"
  cards={[
    { id: "1", brand: "Stripe", holder: "BARBORA Š.", number: "5524 9910 4242", color: "#635bff" },
    { id: "2", brand: "Studio", holder: "CODE BY BARCA", number: "9012 4432 8810", color: "#facc15", textColor: "#000" },
  ]}
/>`,
  },
  {
    id: "floatinginput", name: "FloatingInput",
    desc: "Pole jako podtržení – popisek po fokusu nebo zápisu vyjede nahoru. Podporuje chybu a nápovědu a předává `ref`, takže funguje s react-hook-form.",
    preview: <FloatingDemo />,
    code: `<FloatingInput label="E-mail" type="email" error={errors.email} hint="Ozveme se do 24 hodin" />`,
  },
  {
    id: "marquee", name: "Marquee",
    desc: "Nekonečný běžící pás jen na CSS, vždy přes celou šířku. Položky můžou být prostý text s ikonou, nebo pilulky, případně jen ikony. Umí víc řádků (střídavě opačným směrem) a rychlost se zadává v px/s.",
    preview: <MarqueeDemo />,
    block: true,
    code: `<Marquee items={[{ icon: <CodeIcon />, label: "React" }, { icon: <SparklesIcon />, label: "TypeScript" }]} />

<Marquee items={items} variant="pill" rows={2} speed={80} />
<Marquee items={items} iconOnly />

// vlastní položky
<Marquee><b>Cokoli</b><span>vlastní</span></Marquee>`,
  },
  {
    id: "todolist", name: "TodoList",
    desc: "Úkolníček s prioritami, filtrem a přidáváním. Funguje řízeně (`items`) i neřízeně (`defaultItems`) a texty se dají přeložit přes `labels`.",
    props: ["TodoList", { type: "TodoItem", title: "TodoItem" }],
    preview: <TodoDemo />,
    code: `<TodoList defaultItems={items} onChange={(next) => save(next)} />`,
  },
  {
    id: "datatable", name: "DataTable",
    desc: "Tabulka s řazením, filtry podle hodnot sloupce, výběrem řádků a stránkováním. Vlastní vykreslení buněk přes `render`.",
    props: ["DataTable", { type: "DataColumn", title: "DataColumn" }],
    preview: <TableDemo />,
    block: true,
    code: `const columns: DataColumn<Row>[] = [
  { key: "name", header: "Jméno", sortable: true },
  { key: "role", header: "Role", filterable: true },
  { key: "hours", header: "Hodiny", sortable: true, align: "right" },
];

<DataTable rows={rows} columns={columns} pageSize={5} onSelectionChange={setIds} />`,
  },
  {
    id: "audiovisualizer", name: "AudioVisualizer",
    desc: <>Vzhled přehrávače s poskakujícími linkami a posuvníkem. Zvuk sám nepřehrává – čas je simulovaný a linky jsou jen dekorace. Pro skutečný zvuk řiď <code>playing</code> a <code>position</code> z vlastního <code>&lt;audio&gt;</code>.</>,
    preview: <AudioDemo />,
    code: `<AudioVisualizer title="Midnight Code" artist="Barca" duration={187} />`,
  },
];
