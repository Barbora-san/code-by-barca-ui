import { useId, useLayoutEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { cn } from "../lib/cn";
import { useControllable } from "../lib/floating";
import { Field } from "./Field";
import { ImageIcon, LinkIcon } from "./Icons";
import { MarkdownView } from "./MarkdownView";

/** Nástroje v liště editoru. */
export type MarkdownTool =
  | "h1" | "h2" | "bold" | "italic" | "sup" | "sub" | "code" | "link" | "image" | "ul" | "ol" | "quote";

export interface MarkdownEditorLabels {
  /** Popisek karty s psaním. */
  write: string;
  /** Popisek karty s náhledem. */
  preview: string;
  /** Text v náhledu, když je pole prázdné. */
  empty: string;
  /** Popisek lišty nástrojů (čtečky obrazovky). */
  toolbar: string;
  /** Popisek tlačítka nadpisu. */
  h1: string; h2: string; bold: string; italic: string; sup: string; sub: string;
  /** Popisek tlačítka kódu. */
  code: string; link: string; image: string; ul: string; ol: string; quote: string;
  /** Výchozí text vložený místo prázdného výběru. */
  placeholders: { bold: string; italic: string; sup: string; sub: string; code: string; link: string; image: string; item: string; heading: string; quote: string };
}

const CS: MarkdownEditorLabels = {
  write: "Psát", preview: "Náhled", empty: "Náhled se zobrazí tady…", toolbar: "Formátování",
  h1: "Nadpis 1", h2: "Nadpis 2", bold: "Tučné (Ctrl+B)", italic: "Kurzíva (Ctrl+I)", sup: "Horní index", sub: "Dolní index",
  code: "Kód", link: "Odkaz (Ctrl+K)", image: "Obrázek", ul: "Odrážky", ol: "Číslovaný seznam", quote: "Citace",
  placeholders: { bold: "tučný text", italic: "kurzíva", sup: "horní", sub: "dolní", code: "kód", link: "text odkazu", image: "popis obrázku", item: "položka", heading: "Nadpis", quote: "citace" },
};

export interface MarkdownEditorProps {
  /** Řízená hodnota (Markdown text). */
  value?: string;
  /** Počáteční hodnota (neřízené použití). */
  defaultValue?: string;
  /** Zavolá se při změně, dostane novou hodnotu. */
  onChange?: (value: string) => void;
  /** Popisek / text. */
  label?: ReactNode;
  /** Nápověda pod polem. */
  hint?: ReactNode;
  /** Chybová hláška – zvýrazní pole červeně a připojí text pod něj. */
  error?: ReactNode;
  /** Text zobrazený v prázdném poli. */
  placeholder?: string;
  /** Počet viditelných řádků. */
  rows?: number;
  /** Které nástroje se v liště zobrazí a v jakém pořadí. Výchozí jsou všechny. */
  tools?: MarkdownTool[];
  /** Velikost písma v editoru i náhledu. */
  size?: "small" | "normal" | "lead";
  /** Se kterým panelem editor začíná. */
  defaultView?: "write" | "preview";
  /** Přepsání textů (čeština je výchozí). Stačí zadat jen to, co měníš. */
  labels?: Partial<Omit<MarkdownEditorLabels, "placeholders">> & { placeholders?: Partial<MarkdownEditorLabels["placeholders"]> };
  /** Zakáže prvek (nejde ho použít, je ztlumený). */
  disabled?: boolean;
  /** Jméno pole pro odeslání formuláře. */
  name?: string;
  /** Atribut `id` prvku (pro propojení s `<label htmlFor>`). */
  id?: string;
  /** Vlastní CSS třída přidaná ke kořenovému prvku. */
  className?: string;
}

const ALL_TOOLS: MarkdownTool[] = ["h1", "h2", "bold", "italic", "sup", "sub", "code", "link", "image", "ul", "ol", "quote"];

/** Pozice výběru, kterou nastavíme po vykreslení. */
type Sel = [number, number];

/**
 * Markdown editor s lištou nástrojů, klávesovými zkratkami (Ctrl/⌘ + B, I, K), pokračováním seznamů
 * na Enter a přepínačem Psát / Náhled. Náhled používá bezpečné vykreslení `MarkdownView`.
 */
export function MarkdownEditor({
  value, defaultValue = "", onChange, label, hint, error, placeholder, rows = 10, tools = ALL_TOOLS,
  size = "normal", defaultView = "write", labels, disabled, name, id, className,
}: MarkdownEditorProps) {
  const auto = useId();
  const areaId = id ?? auto;
  const [text, setText] = useControllable<string>(value, defaultValue, onChange);
  const [view, setView] = useState<"write" | "preview">(defaultView);
  const area = useRef<HTMLTextAreaElement>(null);
  const pending = useRef<Sel | null>(null);
  const L: MarkdownEditorLabels = { ...CS, ...labels, placeholders: { ...CS.placeholders, ...labels?.placeholders } };

  useLayoutEffect(() => {
    if (pending.current && area.current) {
      area.current.focus();
      area.current.setSelectionRange(...pending.current);
      pending.current = null;
    }
  });

  const commit = (next: string, sel: Sel) => {
    pending.current = sel;
    setText(next);
  };

  const wrap = (before: string, after: string, placeholderText: string) => {
    const el = area.current;
    if (!el) return;
    const { selectionStart: a, selectionEnd: b } = el;
    // Už obalený výběr → odeber značky (přepínání).
    if (a >= before.length && text.slice(a - before.length, a) === before && text.slice(b, b + after.length) === after) {
      commit(text.slice(0, a - before.length) + text.slice(a, b) + text.slice(b + after.length), [a - before.length, b - before.length]);
      return;
    }
    const picked = text.slice(a, b) || placeholderText;
    commit(text.slice(0, a) + before + picked + after + text.slice(b), [a + before.length, a + before.length + picked.length]);
  };

  const prefixLines = (kind: "h1" | "h2" | "ul" | "ol" | "quote", fallback: string) => {
    const el = area.current;
    if (!el) return;
    const { selectionStart: a, selectionEnd: b } = el;
    const from = text.lastIndexOf("\n", a - 1) + 1;
    const nl = text.indexOf("\n", b);
    const to = nl === -1 ? text.length : nl;
    const block = text.slice(from, to) || fallback;
    const rx = { h1: /^# /, h2: /^## /, ul: /^- /, ol: /^\d+\. /, quote: /^> / }[kind];
    const lines = block.split("\n");
    const allHave = lines.every((l) => rx.test(l));
    const next = lines
      .map((l, i) => {
        const bare = l.replace(/^(#{1,3} |- |\d+\. |> )/, "");
        if (allHave) return bare;
        return (kind === "h1" ? "# " : kind === "h2" ? "## " : kind === "ul" ? "- " : kind === "ol" ? `${i + 1}. ` : "> ") + bare;
      })
      .join("\n");
    commit(text.slice(0, from) + next + text.slice(to), [from, from + next.length]);
  };

  const link = (image: boolean) => {
    const el = area.current;
    if (!el) return;
    const { selectionStart: a, selectionEnd: b } = el;
    const picked = text.slice(a, b) || (image ? L.placeholders.image : L.placeholders.link);
    const head = (image ? "![" : "[") + picked + "](";
    const url = "https://";
    commit(text.slice(0, a) + head + url + ")" + text.slice(b), [a + head.length, a + head.length + url.length]);
  };

  const run = (tool: MarkdownTool) => {
    const p = L.placeholders;
    switch (tool) {
      case "bold": return wrap("**", "**", p.bold);
      case "italic": return wrap("*", "*", p.italic);
      case "sup": return wrap("^", "^", p.sup);
      case "sub": return wrap("~", "~", p.sub);
      case "code": return wrap("`", "`", p.code);
      case "link": return link(false);
      case "image": return link(true);
      case "h1": case "h2": return prefixLines(tool, p.heading);
      case "ul": case "ol": return prefixLines(tool, p.item);
      case "quote": return prefixLines("quote", p.quote);
    }
  };

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    const mod = e.ctrlKey || e.metaKey;
    const k = e.key.toLowerCase();
    if (mod && !e.shiftKey && !e.altKey && (k === "b" || k === "i" || k === "k")) {
      e.preventDefault();
      run(k === "b" ? "bold" : k === "i" ? "italic" : "link");
      return;
    }
    // Enter v seznamu: pokračuj další odrážkou; prázdná odrážka seznam ukončí.
    if (e.key === "Enter" && !e.shiftKey && !mod && !e.altKey) {
      const el = e.currentTarget;
      if (el.selectionStart !== el.selectionEnd) return;
      const pos = el.selectionStart;
      const start = text.lastIndexOf("\n", pos - 1) + 1;
      const lineBefore = text.slice(start, pos);
      const m = lineBefore.match(/^(\s*)(-|\d+\.) (.*)$/);
      if (!m) return;
      e.preventDefault();
      if (!m[3]) {
        commit(text.slice(0, start) + text.slice(pos), [start, start]);
        return;
      }
      const marker = m[2] === "-" ? "-" : `${parseInt(m[2], 10) + 1}.`;
      const ins = `\n${m[1]}${marker} `;
      commit(text.slice(0, pos) + ins + text.slice(pos), [pos + ins.length, pos + ins.length]);
    }
  };

  const toolBtn: Record<MarkdownTool, ReactNode> = {
    h1: "H1", h2: "H2", bold: <b>B</b>, italic: <i>I</i>,
    sup: <>x<sup>2</sup></>, sub: <>x<sub>2</sub></>, code: <code>{"</>"}</code>,
    link: <LinkIcon size={15} />, image: <ImageIcon size={15} />, ul: "•", ol: "1.", quote: "”",
  };
  const gaps = new Set<MarkdownTool>(["bold", "code", "ul"]);

  return (
    <Field label={label} hint={hint} error={error} htmlFor={areaId} className={className}>
      <div className={cn("cbb-md-editor", error && "is-invalid", disabled && "is-disabled")}>
        <div className="cbb-md-editor__bar">
          <div className="cbb-md-editor__tools" role="toolbar" aria-label={L.toolbar} aria-controls={areaId}>
            {tools.map((t) => (
              <span key={t} className="cbb-md-editor__slot">
                {gaps.has(t) && tools.indexOf(t) > 0 && <i className="cbb-md-editor__sep" aria-hidden="true" />}
                <button
                  type="button"
                  className="cbb-md-editor__tool"
                  title={L[t]}
                  aria-label={L[t]}
                  disabled={disabled || view !== "write"}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => run(t)}
                >
                  {toolBtn[t]}
                </button>
              </span>
            ))}
          </div>
          <div className="cbb-md-editor__views" role="tablist">
            {(["write", "preview"] as const).map((v) => (
              <button
                key={v}
                type="button"
                role="tab"
                aria-selected={view === v}
                className={cn("cbb-md-editor__view", view === v && "is-active")}
                onClick={() => setView(v)}
              >
                {L[v]}
              </button>
            ))}
          </div>
        </div>
        {view === "write" ? (
          <textarea
            ref={area}
            id={areaId}
            name={name}
            rows={rows}
            value={text}
            disabled={disabled}
            placeholder={placeholder}
            aria-invalid={error ? true : undefined}
            className={cn("cbb-md-editor__area", `cbb-md--${size}`)}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={onKeyDown}
          />
        ) : (
          <div className="cbb-md-editor__preview" style={{ minHeight: `${rows * 1.6 + 1.5}em` }}>
            <MarkdownView source={text} size={size} emptyText={L.empty} />
            {name && <input type="hidden" name={name} value={text} />}
          </div>
        )}
      </div>
    </Field>
  );
}
