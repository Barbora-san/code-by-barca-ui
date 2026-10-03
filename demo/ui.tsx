import { useState, type ReactNode } from "react";
import { Badge, CodeBlock, Collapsible, cn } from "../src";
import data from "./props.generated.json";
import type { Doc, PropsRef } from "./docs/types";

type PropRow = { name: string; type: string; required: boolean; doc: string };
const TYPES = data.types as Record<string, PropRow[]>;
const DEFAULTS = data.defaults as Record<string, Record<string, string>>;

/** Řádek ukázky – komponenty vedle sebe. */
export function Row({ children, gap = 12, align = "center" }: { children: ReactNode; gap?: number; align?: string }) {
  return <div style={{ display: "flex", flexWrap: "wrap", gap, alignItems: align }}>{children}</div>;
}
/** Sloupec ukázky – komponenty pod sebou. */
export function Col({ children, gap = 16, width }: { children: ReactNode; gap?: number; width?: number | string }) {
  return <div style={{ display: "flex", flexDirection: "column", gap, width: width ?? "100%" }}>{children}</div>;
}

function normalizeRef(r: PropsRef | string, name: string): PropsRef {
  if (typeof r !== "string") return r;
  return { type: `${r}Props`, component: r, title: name === r ? undefined : r };
}

export function PropsTable({ refs, name }: { refs?: (PropsRef | string)[]; name: string }) {
  const list = (refs ?? [name]).map((r) => normalizeRef(r, name));
  const tables = list
    .map((r) => ({ ref: r, rows: (TYPES[r.type] ?? []).filter((p) => p.name !== "style" && p.name !== "children" || p.doc) }))
    .filter((t) => t.rows.length > 0);
  if (tables.length === 0) return <p className="demo-muted">Komponenta nemá vlastní parametry.</p>;
  const total = tables.reduce((n, t) => n + t.rows.length, 0);
  return (
    <Collapsible
      defaultOpen
      trigger={<span className="demo-props-trigger">Parametry <Badge variant="secondary">{total}</Badge></span>}
    >
      {tables.map(({ ref, rows }) => (
        <div key={ref.type} className="demo-props">
          {(ref.title || tables.length > 1) && <p className="demo-props__title">{ref.title ?? ref.type}</p>}
          <div className="demo-props__scroll">
            <table className="demo-table">
              <thead>
                <tr><th>Parametr</th><th>Typ</th><th>Výchozí</th><th>Popis</th></tr>
              </thead>
              <tbody>
                {rows.map((p) => {
                  const def = ref.component ? DEFAULTS[ref.component]?.[p.name] : undefined;
                  return (
                    <tr key={p.name}>
                      <td><code className="demo-code demo-code--accent">{p.name}{p.required && <span title="povinný" className="demo-req">*</span>}</code></td>
                      <td><code className="demo-code demo-code--type">{p.type}</code></td>
                      <td>{def ? <code className="demo-code">{def}</code> : <span className="demo-muted">—</span>}</td>
                      <td className="demo-desc">{p.doc || <span className="demo-muted">—</span>}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </Collapsible>
  );
}

/** Jeden blok dokumentace: nadpis, popis, živá ukázka, kód, parametry. */
export function DocBlock({ doc, category }: { doc: Doc; category: string }) {
  const [showCode, setShowCode] = useState(true);
  return (
    <section id={doc.id} data-spy className="demo-doc">
      <header className="demo-doc__head">
        <p className="demo-eyebrow">{category}</p>
        <h3 className="demo-doc__title">
          <a href={`#${doc.id}`} className="demo-anchor" aria-label={`Odkaz na ${doc.name}`}>#</a>
          {doc.name}
        </h3>
        <p className="demo-doc__desc">{doc.desc}</p>
      </header>
      <div className={cn("demo-preview", doc.block && "demo-preview--block")}>{doc.preview}</div>
      {doc.note && <p className="demo-note">{doc.note}</p>}
      <div className="demo-codewrap">
        <button type="button" className="demo-codetoggle" onClick={() => setShowCode((v) => !v)} aria-expanded={showCode}>
          {showCode ? "Skrýt kód" : "Zobrazit kód"}
        </button>
        {showCode && <CodeBlock language="tsx" code={doc.code.trim()} />}
      </div>
      <PropsTable refs={doc.props} name={doc.name} />
    </section>
  );
}
