import { useState } from "react";
import { MarkdownEditor, MarkdownView, TableEditor, type TableData } from "../../src";
import { Col } from "../ui";
import type { Doc } from "./types";

const SAMPLE = `## Nadpis sekce

Text může být **tučný**, *kurzívou* nebo ***obojí***. Vzorec: H~2~O, x^2^. Vložený \`kód\` a [odkaz](https://code-by-barca.cz).

- první položka
- druhá položka

> Citace se zvýrazní čarou vlevo.
`;

function EditorDemo() {
  const [md, setMd] = useState(SAMPLE);
  return (
    <Col gap={8}>
      <MarkdownEditor label="Popis projektu" value={md} onChange={setMd} rows={9} hint="Ctrl+B tučné, Ctrl+I kurzíva, Ctrl+K odkaz. Enter v seznamu přidá další odrážku." />
    </Col>
  );
}

const UNSAFE = `<script>alert(1)</script> <img src=x onerror=alert(1)>

[klik](javascript:alert(1)) a [bezpečný odkaz](https://example.com)`;

function ViewDemo() {
  return (
    <Col gap={20}>
      <MarkdownView source={SAMPLE} />
      <div>
        <span className="demo-eyebrow">nebezpečný vstup zůstane jen textem</span>
        <MarkdownView source={UNSAFE} size="small" />
      </div>
    </Col>
  );
}

function TableDemo() {
  const [t, setT] = useState<TableData>({
    headers: ["Technologie", "Úroveň", "Roky"],
    rows: [["React", "pokročilá", "4"], ["TypeScript", "pokročilá", "3"], ["Python", "střední", "2"]],
  });
  return (
    <Col gap={12}>
      <TableEditor label="Dovednosti" value={t} onChange={setT} hint="Šipky ↑ ↓ a Enter přecházejí mezi řádky. Buňky můžeš vložit přímo z Excelu." />
      <pre className="demo-mono" style={{ margin: 0, whiteSpace: "pre-wrap", wordBreak: "break-all" }}>{JSON.stringify(t)}</pre>
    </Col>
  );
}

export const EDITOR_DOCS: Doc[] = [
  {
    id: "markdowneditor", name: "MarkdownEditor",
    desc: "Textové pole s lištou nástrojů pro Markdown: nadpisy, tučné, kurzíva, horní a dolní index, kód, odkaz, obrázek, seznamy a citace. Má klávesové zkratky, pokračování seznamů na Enter a přepínač Psát / Náhled.",
    props: ["MarkdownEditor"],
    block: true,
    preview: <EditorDemo />,
    note: <>Tlačítka formátování fungují jako přepínač: když je výběr už obalený značkami, kliknutí je odebere. Náhled používá <code>MarkdownView</code>, takže je bezpečný. Tabulátor nezachytává, aby nešlo uvíznout při ovládání klávesnicí.</>,
    code: `const [text, setText] = useState("");

<MarkdownEditor
  label="Popis projektu"
  value={text}
  onChange={setText}
  rows={10}
  tools={["h2", "bold", "italic", "link", "ul"]}  // volitelně jen některé nástroje
/>`,
  },
  {
    id: "markdownview", name: "MarkdownView",
    desc: "Vykreslí Markdown jako stylovaný text. Vstup se escapuje a adresy odkazů a obrázků se kontrolují (povolené je http, https, mailto, tel a relativní), takže se hodí i na obsah od uživatelů.",
    props: ["MarkdownView"],
    block: true,
    preview: <ViewDemo />,
    note: <>Chceš jen HTML řetězec? Použij <code>markdownToHtml(text)</code>, vrací stejně bezpečný výstup.</>,
    code: `<MarkdownView source={project.description} />
<MarkdownView source={text} size="lead" emptyText="Zatím bez popisu" />

const html = markdownToHtml("**ahoj**"); // "<p><strong>ahoj</strong></p>"`,
  },
  {
    id: "tableeditor", name: "TableEditor",
    desc: "Editor tabulky: úprava buněk a názvů sloupců, přidávání a odebírání řádků i sloupců, pohyb šipkami a Enterem. Vložení z Excelu nebo Google Sheets vyplní více buněk najednou a případně přidá řádky a sloupce.",
    props: ["TableEditor", { type: "TableData", title: "TableData" }],
    block: true,
    preview: <TableDemo />,
    code: `const [table, setTable] = useState<TableData>({
  headers: ["Název", "Cena"],
  rows: [["Web", "12 000"]],
});

<TableEditor
  label="Ceník"
  value={table}
  onChange={setTable}
  maxColumns={6}
  maxRows={50}
/>`,
  },
];
