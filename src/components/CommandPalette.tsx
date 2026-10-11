import { useEffect, useId, useMemo, useRef, useState, type ReactNode } from "react";
import { cn } from "../lib/cn";
import { useEscape } from "../hooks/useEscape";
import { useLockBodyScroll } from "../hooks/useLockBodyScroll";
import { useFocusTrap } from "../hooks/useFocusTrap";
import { useHotkey } from "../hooks/useHotkey";
import { normalizeText } from "../hooks/useFilter";
import { SearchIcon } from "./Icons";

export interface CommandItem {
  /** Unikátní klíč příkazu. */
  id: string;
  /** Hlavní text příkazu. */
  label: string;
  /** Vedlejší popis pod názvem. */
  description?: string;
  /** Nadpis skupiny, do které příkaz patří (Navigace, Akce…). */
  group?: string;
  /** Ikona před textem. */
  icon?: ReactNode;
  /** Zobrazená zkratka vpravo (jen text, nic neváže), např. „G H“. */
  shortcut?: string;
  /** Další slova, podle kterých jde příkaz najít (synonyma). */
  keywords?: string[];
  /** Zakáže prvek (nejde ho použít, je ztlumený). */
  disabled?: boolean;
  /** Zavolá se po výběru příkazu. */
  onSelect: () => void;
}

export interface CommandPaletteProps {
  /** Zda je paleta otevřená. */
  open: boolean;
  /** Zavolá se při otevření / zavření (zkratka, Esc, klik na pozadí, výběr příkazu). */
  onOpenChange: (open: boolean) => void;
  /** Seznam příkazů. */
  items: CommandItem[];
  /** Text zobrazený v prázdném poli. */
  placeholder?: string;
  /** Text, když hledání nic nenajde. */
  emptyLabel?: string;
  /** Klávesová zkratka pro otevření / zavření, např. `mod+k` (Ctrl / ⌘ + K). `null` ji vypne. */
  hotkey?: string | null;
  /** Zavřít paletu po výběru příkazu. */
  closeOnSelect?: boolean;
  /** Nejvíc zobrazených výsledků. */
  maxResults?: number;
  /** Vlastní CSS třída přidaná ke kořenovému prvku. */
  className?: string;
}

/** Hezký skórovací řez: všechna slova dotazu musí něco najít; začátek názvu vyhrává nad zbytkem. */
function score(item: CommandItem, tokens: string[]): number | null {
  const label = normalizeText(item.label);
  const rest = normalizeText([item.description, item.group, ...(item.keywords ?? [])].filter(Boolean).join(" "));
  let total = 0;
  for (const t of tokens) {
    if (label.startsWith(t)) total += 0;
    else if (label.includes(` ${t}`)) total += 1;
    else if (label.includes(t)) total += 2;
    else if (rest.includes(t)) total += 4;
    else return null;
  }
  return total;
}

/** Příkazová paleta (Ctrl / ⌘ + K): hledání v příkazech, skupiny, šipky + Enter, focus trap. */
export function CommandPalette({
  open,
  onOpenChange,
  items,
  placeholder = "Hledat příkaz…",
  emptyLabel = "Nic nenalezeno",
  hotkey = "mod+k",
  closeOnSelect = true,
  maxResults = 50,
  className,
}: CommandPaletteProps) {
  const id = useId();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const panel = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const list = useRef<HTMLDivElement>(null);

  useHotkey(hotkey, () => onOpenChange(!open));
  useEscape(open, () => onOpenChange(false));
  useLockBodyScroll(open);
  useFocusTrap(panel, open);

  useEffect(() => {
    if (!open) return;
    setQuery("");
    setActive(0);
    const prev = document.activeElement as HTMLElement | null;
    input.current?.focus();
    return () => prev?.focus?.();
  }, [open]);

  const { rows, flat } = useMemo(() => {
    const tokens = normalizeText(query).split(/\s+/).filter(Boolean);
    let found: CommandItem[];
    if (tokens.length === 0) found = items;
    else {
      found = items
        .map((it, i) => ({ it, i, s: score(it, tokens) }))
        .filter((x): x is { it: CommandItem; i: number; s: number } => x.s !== null)
        .sort((a, b) => a.s - b.s || a.i - b.i)
        .map((x) => x.it);
    }
    found = found.slice(0, maxResults);
    const flatList: CommandItem[] = [];
    const out: ({ type: "head"; label: string } | { type: "item"; item: CommandItem; index: number })[] = [];
    if (tokens.length === 0) {
      const groups = new Map<string, CommandItem[]>();
      for (const it of found) groups.set(it.group ?? "", [...(groups.get(it.group ?? "") ?? []), it]);
      for (const [g, arr] of groups) {
        if (g) out.push({ type: "head", label: g });
        for (const item of arr) {
          out.push({ type: "item", item, index: flatList.length });
          flatList.push(item);
        }
      }
    } else {
      for (const item of found) {
        out.push({ type: "item", item, index: flatList.length });
        flatList.push(item);
      }
    }
    return { rows: out, flat: flatList };
  }, [items, query, maxResults]);

  useEffect(() => {
    list.current?.querySelector<HTMLElement>(`[data-idx="${active}"]`)?.scrollIntoView({ block: "nearest" });
  }, [active]);

  if (!open) return null;

  const run = (item: CommandItem | undefined) => {
    if (!item || item.disabled) return;
    if (closeOnSelect) onOpenChange(false);
    item.onSelect();
  };
  const move = (dir: 1 | -1) => {
    if (!flat.length) return;
    let i = active;
    for (let n = 0; n < flat.length; n++) {
      i = (i + dir + flat.length) % flat.length;
      if (!flat[i]!.disabled) break;
    }
    setActive(i);
  };

  return (
    <div className="cbb-overlay cbb-overlay--cmd" onMouseDown={(e) => e.target === e.currentTarget && onOpenChange(false)}>
      <div ref={panel} role="dialog" aria-modal="true" aria-label="Příkazová paleta" tabIndex={-1} className={cn("cbb-cmd", className)}>
        <div className="cbb-cmd__search">
          <SearchIcon size={18} />
          <input
            ref={input}
            className="cbb-cmd__input"
            role="combobox"
            aria-expanded="true"
            aria-controls={`${id}-list`}
            aria-activedescendant={flat[active] ? `${id}-${active}` : undefined}
            aria-autocomplete="list"
            placeholder={placeholder}
            autoComplete="off"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActive(0);
            }}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") (e.preventDefault(), move(1));
              else if (e.key === "ArrowUp") (e.preventDefault(), move(-1));
              else if (e.key === "Enter") (e.preventDefault(), run(flat[active]));
              else if (e.key === "Home") (e.preventDefault(), setActive(0));
              else if (e.key === "End") (e.preventDefault(), setActive(Math.max(0, flat.length - 1)));
            }}
          />
          <kbd className="cbb-cmd__esc">Esc</kbd>
        </div>
        <div ref={list} id={`${id}-list`} role="listbox" className="cbb-cmd__list">
          {flat.length === 0 && <p className="cbb-cmd__empty">{emptyLabel}</p>}
          {rows.map((r, i) =>
            r.type === "head" ? (
              <div key={`h-${i}`} className="cbb-cmd__group" role="presentation">
                {r.label}
              </div>
            ) : (
              <div
                key={r.item.id}
                id={`${id}-${r.index}`}
                data-idx={r.index}
                role="option"
                aria-selected={r.index === active}
                aria-disabled={r.item.disabled || undefined}
                className={cn("cbb-cmd__item", r.index === active && "is-active", r.item.disabled && "is-disabled")}
                onMouseMove={() => r.index !== active && setActive(r.index)}
                onClick={() => run(r.item)}
              >
                {r.item.icon && <span className="cbb-cmd__icon">{r.item.icon}</span>}
                <span className="cbb-cmd__text">
                  <span>{r.item.label}</span>
                  {r.item.description && <small>{r.item.description}</small>}
                </span>
                {r.item.shortcut && <kbd className="cbb-cmd__kbd">{r.item.shortcut}</kbd>}
              </div>
            )
          )}
        </div>
        <div className="cbb-cmd__foot">
          <span><kbd>↑</kbd><kbd>↓</kbd> pohyb</span>
          <span><kbd>↵</kbd> vybrat</span>
          <span><kbd>Esc</kbd> zavřít</span>
        </div>
      </div>
    </div>
  );
}
