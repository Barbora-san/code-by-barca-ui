import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { Floating, useClickOutside } from "../lib/floating";
import { normalizeText } from "../hooks/useFilter";
import { SearchIcon } from "./Icons";
import { cn } from "../lib/cn";

export interface AutocompleteItem {
  /** Jedinečné `id`. */
  id: string;
  /** Zobrazený text. */
  label: string;
  /** Skupina, do které se položka zařadí. */
  category?: string;
  /** Další text, ve kterém se hledá (synonyma). */
  keywords?: string;
}

export interface SearchAutocompleteProps {
  /** Prohledávané položky. */
  items: AutocompleteItem[];
  /** Dostane `id` a celou vybranou položku. */
  onSelect: (id: string, item: AutocompleteItem) => void;
  /** Text v prázdném poli. */
  placeholder?: string;
  /** Globální zkratka ⌘K / Ctrl+K zaostří pole (výchozí true). */
  shortcut?: boolean;
  /** Text, když nic nevyhovuje. */
  emptyLabel?: string;
  /** Maximum zobrazených výsledků. */
  limit?: number;
  /** Vlastní CSS třída přidaná ke kořenovému prvku. */
  className?: string;
}

/** Vyhledávání s našeptávačem – hledá bez diakritiky, výsledky seskupuje podle kategorie. */
export function SearchAutocomplete({ items, onSelect, placeholder = "Hledat…", shortcut = true, emptyLabel = "Nic nenalezeno", limit = 12, className }: SearchAutocompleteProps) {
  const id = useId();
  const wrap = useRef<HTMLDivElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);

  useClickOutside([wrap, panel], () => setOpen(false), open);

  useEffect(() => {
    if (!shortcut) return;
    const onKey = (e: globalThis.KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        input.current?.focus();
        setOpen(true);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [shortcut]);

  const results = useMemo(() => {
    const words = normalizeText(query).trim().split(/\s+/).filter(Boolean);
    const list = words.length
      ? items.filter((it) => {
          const text = normalizeText(`${it.label} ${it.category ?? ""} ${it.keywords ?? ""}`);
          return words.every((w) => text.includes(w));
        })
      : items;
    return list.slice(0, limit);
  }, [items, query, limit]);

  useEffect(() => setActive(0), [query]);

  const choose = (item: AutocompleteItem) => {
    onSelect(item.id, item);
    setQuery("");
    setOpen(false);
    input.current?.blur();
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
      setActive((a) => Math.min(a + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter" && open && results[active]) {
      e.preventDefault();
      choose(results[active]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  // seskupení při zachování pořadí
  const groups: { category: string; items: { item: AutocompleteItem; index: number }[] }[] = [];
  results.forEach((item, index) => {
    const cat = item.category ?? "";
    let g = groups.find((x) => x.category === cat);
    if (!g) groups.push((g = { category: cat, items: [] }));
    g.items.push({ item, index });
  });

  return (
    <div ref={wrap} className={cn("cbb-search cbb-autocomplete", className)}>
      <SearchIcon size={18} className="cbb-search__icon" />
      <input
        ref={input}
        role="combobox"
        aria-expanded={open}
        aria-controls={`${id}-list`}
        aria-activedescendant={open && results[active] ? `${id}-${results[active].id}` : undefined}
        aria-autocomplete="list"
        value={query}
        placeholder={placeholder}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={onKeyDown}
        className="cbb-search__input"
      />
      {shortcut && !query && <kbd className="cbb-kbd cbb-autocomplete__kbd">⌘K</kbd>}
      <Floating anchorRef={wrap} panelRef={panel} open={open} matchWidth side="bottom" align="start" offset={6} className="cbb-autocomplete__panel">
        <div id={`${id}-list`} role="listbox">
          {results.length === 0 && <p className="cbb-autocomplete__empty">{emptyLabel}</p>}
          {groups.map((g) => (
            <div key={g.category} role="group" aria-label={g.category || undefined}>
              {g.category && <p className="cbb-autocomplete__cat">{g.category}</p>}
              {g.items.map(({ item, index }) => (
                <button
                  key={item.id}
                  id={`${id}-${item.id}`}
                  type="button"
                  role="option"
                  aria-selected={index === active}
                  className={cn("cbb-autocomplete__opt", index === active && "is-active")}
                  onMouseEnter={() => setActive(index)}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => choose(item)}
                >
                  {item.label}
                </button>
              ))}
            </div>
          ))}
        </div>
      </Floating>
    </div>
  );
}
