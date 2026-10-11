import { useState } from "react";
import {
  Spinner, NumberInput, PasswordInput, Rating, MultiSelect, Button, Dialog, Input, Card,
  useDebounce, useMediaQuery, useLocalStorage, useCopyToClipboard, useDisclosure, useFocusTrap,
  SparklesIcon,
} from "../../src";
import { useRef } from "react";
import { Row, Col } from "../ui";
import type { Doc } from "./types";

function SpinnerDemo() {
  return (
    <Col gap={28}>
      <Row gap={36}>
        <Spinner />
        <Spinner variant="dots" />
        <Spinner variant="bars" />
        <Spinner variant="pulse" />
        <Spinner variant="custom" motion="spin"><SparklesIcon size={24} /></Spinner>
      </Row>
      <Row gap={28}>
        <Spinner size="sm" label="Ukládám…" />
        <Spinner size="lg" label="Načítám data" />
        <Spinner color="#60a5fa" variant="bars" label="Vlastní barva" />
      </Row>
      <div style={{ position: "relative", height: 110, borderRadius: 12, border: "1px solid var(--cbb-border)", padding: 16 }}>
        Obsah, který se právě načítá…
        <Spinner overlay label="Načítám" />
      </div>
    </Col>
  );
}

function NumberDemo() {
  const [n, setN] = useState<number | null>(2);
  const [price, setPrice] = useState<number | null>(19.9);
  return (
    <Row gap={32} align="flex-start">
      <Col width={220} gap={8}>
        <NumberInput label="Počet kusů" value={n} onChange={setN} min={0} max={10} />
        <span className="demo-muted demo-mono">hodnota: {String(n)}</span>
      </Col>
      <Col width={220} gap={8}>
        <NumberInput label="Cena (Kč)" value={price} onChange={setPrice} step={0.1} min={0} hint="Šipky ↑↓, Shift = 10×" />
        <span className="demo-muted demo-mono">hodnota: {String(price)}</span>
      </Col>
    </Row>
  );
}

function PasswordDemo() {
  const [pw, setPw] = useState("");
  return (
    <Col width={340}>
      <PasswordInput label="Heslo" placeholder="••••••••" value={pw} onChange={(e) => setPw(e.target.value)} hint="Minimálně 8 znaků" error={pw && pw.length < 8 ? "Heslo je příliš krátké" : undefined} />
    </Col>
  );
}

function RatingDemo() {
  const [v, setV] = useState(3);
  const [h, setH] = useState(3.5);
  return (
    <Row gap={40} align="flex-start">
      <Col gap={8}>
        <Rating value={v} onChange={setV} aria-label="Hodnocení produktu" />
        <span className="demo-muted demo-mono">{v} / 5</span>
      </Col>
      <Col gap={8}>
        <Rating value={h} onChange={setH} precision={0.5} size={28} />
        <span className="demo-muted demo-mono">{h} / 5 (půlhvězdy)</span>
      </Col>
      <Col gap={8}>
        <Rating value={4.5} precision={0.5} readOnly size={20} />
        <span className="demo-muted demo-mono">readOnly</span>
      </Col>
    </Row>
  );
}

const TECH = ["React", "TypeScript", "Next.js", "Python", "FastAPI", "PostgreSQL", "Docker", "Tailwind"].map((l) => ({ value: l.toLowerCase(), label: l }));
function MultiDemo() {
  const [v, setV] = useState<string[]>(["react", "typescript"]);
  return (
    <Row gap={32} align="flex-start">
      <Col width={360} gap={8}>
        <MultiSelect label="Technologie" options={TECH} value={v} onChange={setV} placeholder="Vyber technologie…" />
        <span className="demo-muted demo-mono">{v.join(", ") || "nic"}</span>
      </Col>
      <Col width={300}>
        <MultiSelect label="Maximálně 2, sbalené štítky" options={TECH} defaultValue={["react"]} max={2} maxChips={1} />
      </Col>
    </Row>
  );
}

function DebounceDemo() {
  const [q, setQ] = useState("");
  const d = useDebounce(q, 500);
  return (
    <Col width={340} gap={8}>
      <Input placeholder="Piš a čekej 0,5 s…" value={q} onChange={(e) => setQ(e.target.value)} />
      <span className="demo-muted demo-mono">hned: „{q}“ · po prodlevě: „{d}“</span>
    </Col>
  );
}
function MediaDemo() {
  const small = useMediaQuery("(max-width: 700px)");
  return <span className="demo-mono">{small ? "Úzká obrazovka (≤ 700 px)" : "Široká obrazovka (> 700 px)"} – změň velikost okna</span>;
}
function StorageDemo() {
  const [n, setN, reset] = useLocalStorage("cbb-demo-counter", 0);
  return (
    <Row>
      <Button onClick={() => setN((c) => c + 1)}>Kliknuto {n}×</Button>
      <Button variant="outline" onClick={reset}>Vynulovat</Button>
      <span className="demo-muted">Obnov stránku – číslo zůstane.</span>
    </Row>
  );
}
function CopyDemo() {
  const { copy, copied } = useCopyToClipboard();
  return <Button variant="soft" onClick={() => copy("npm i code-by-barca-ui")}>{copied ? "Zkopírováno ✓" : "Kopírovat příkaz"}</Button>;
}
function DisclosureDemo() {
  const { open, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Button onClick={onOpen}>Otevřít dialog</Button>
      <Dialog open={open} onClose={onClose} title="Dialog" size="sm">Otevřeno přes useDisclosure.</Dialog>
    </>
  );
}
function TrapDemo() {
  const [on, setOn] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useFocusTrap(ref, on);
  return (
    <Col width={360} gap={12}>
      <Button variant="outline" onClick={() => setOn((v) => !v)}>{on ? "Vypnout zachycení fokusu" : "Zapnout zachycení fokusu"}</Button>
      <div ref={ref} tabIndex={-1}>
        <Card><div style={{ padding: 16, display: "flex", gap: 8 }}><Input placeholder="Pole 1" /><Input placeholder="Pole 2" /></div></Card>
      </div>
      <span className="demo-muted">Zapni a tabuluj – fokus neuteče z karty.</span>
    </Col>
  );
}

export const BASIC2_DOCS: Doc[] = [
  {
    id: "spinner", name: "Spinner",
    desc: <>Univerzální loader: <code>ring</code>, <code>dots</code>, <code>bars</code>, <code>pulse</code> a <code>custom</code> pro vlastní značku (logo, ikona). S <code>overlay</code> překryje načítanou kartu nebo tabulku.</>,
    props: ["Spinner"],
    preview: <SpinnerDemo />,
    code: `<Spinner />
<Spinner variant="dots" label="Ukládám…" />
<Spinner overlay label="Načítám" />   // rodič potřebuje position: relative

// vlastní značka (logo)
<Spinner variant="custom" motion="pulse" size={48}><Logo /></Spinner>`,
  },
  {
    id: "numberinput", name: "NumberInput",
    desc: "Číselné pole s tlačítky − a +, šipkami (Shift = 10×), omezením min a max a zaokrouhlením. Píše se čárkou i tečkou.",
    props: ["NumberInput"],
    preview: <NumberDemo />,
    code: `const [qty, setQty] = useState<number | null>(1);

<NumberInput label="Počet kusů" value={qty} onChange={setQty} min={0} max={10} />
<NumberInput label="Cena" step={0.1} defaultValue={19.9} />`,
  },
  {
    id: "passwordinput", name: "PasswordInput",
    desc: "Pole pro heslo s okem pro zobrazení. Má štítek, nápovědu a chybu jako běžný Input a předává ref.",
    props: ["PasswordInput"],
    preview: <PasswordDemo />,
    code: `<PasswordInput label="Heslo" value={pw} onChange={(e) => setPw(e.target.value)} error={error} />`,
  },
  {
    id: "rating", name: "Rating",
    desc: "Hodnocení hvězdičkami – myší, dotykem i šipkami. Umí půlhvězdy a režim jen pro čtení (průměr z recenzí).",
    props: ["Rating"],
    preview: <RatingDemo />,
    code: `<Rating value={value} onChange={setValue} />
<Rating value={4.5} precision={0.5} readOnly />`,
  },
  {
    id: "multiselect", name: "MultiSelect",
    desc: "Výběr více hodnot: štítky, hledání, klávesnice (šipky, Enter, Backspace, Esc), limit počtu a sbalení štítků. Panel se vykreslí nad ostatním obsahem.",
    props: ["MultiSelect", { type: "MultiSelectOption", title: "MultiSelectOption" }],
    preview: <MultiDemo />,
    code: `<MultiSelect
  label="Technologie"
  options={[{ value: "react", label: "React" }, { value: "ts", label: "TypeScript" }]}
  value={value}
  onChange={setValue}
  max={5}
/>`,
  },
  { id: "usedebounce", name: "useDebounce", desc: "Vrátí hodnotu se zpožděním – hodí se u hledání při psaní nebo automatického ukládání.", props: [], preview: <DebounceDemo />, code: `const debounced = useDebounce(query, 300);` },
  { id: "usemediaquery", name: "useMediaQuery", desc: "Sleduje CSS media query. Na serveru vrací výchozí hodnotu, aby se HTML shodovalo.", props: [], preview: <MediaDemo />, code: `const isMobile = useMediaQuery("(max-width: 640px)");` },
  { id: "uselocalstorage", name: "useLocalStorage", desc: "Stav uložený v localStorage. Bezpečný pro SSR i zablokované úložiště a synchronizuje karty prohlížeče.", props: [], preview: <StorageDemo />, code: `const [theme, setTheme, resetTheme] = useLocalStorage("theme", "dark");` },
  { id: "usecopytoclipboard", name: "useCopyToClipboard", desc: "Zkopíruje text do schránky a na chvíli nastaví copied. Má záložní cestu pro http a starší prohlížeče.", props: [], preview: <CopyDemo />, code: `const { copy, copied } = useCopyToClipboard();\n<Button onClick={() => copy(text)}>{copied ? "Zkopírováno" : "Kopírovat"}</Button>` },
  { id: "usedisclosure", name: "useDisclosure", desc: "Stav otevřeno / zavřeno se stabilními funkcemi onOpen, onClose a onToggle.", props: [], preview: <DisclosureDemo />, code: `const { open, onOpen, onClose } = useDisclosure();\n<Dialog open={open} onClose={onClose} />` },
  { id: "usefocustrap", name: "useFocusTrap", desc: "Drží klávesu Tab uvnitř prvku, dokud je aktivní. Už ho používají Dialog, Sheet a AlertDialog.", props: [], preview: <TrapDemo />, code: `const ref = useRef<HTMLDivElement>(null);\nuseFocusTrap(ref, open);\n<div ref={ref} tabIndex={-1}>…</div>` },
];
