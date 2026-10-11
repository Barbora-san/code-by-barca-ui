import { useMemo, useState, type ReactNode } from "react";
import { cn } from "../lib/cn";
import { Checkbox } from "./Checkbox";
import { ChevronLeftIcon, ChevronRightIcon } from "./Icons";

export interface DataColumn<T> {
  /** Klíč vlastnosti řádku, ze které sloupec čte hodnotu (použije se pro řazení a filtr). */
  key: keyof T & string;
  /** Text hlavičky sloupce. */
  header: string;
  /** Povolí řazení kliknutím na hlavičku (vzestupně → sestupně → bez řazení). */
  sortable?: boolean;
  /** Nabídne výběr z unikátních hodnot sloupce jako filtr nad tabulkou. */
  filterable?: boolean;
  /** Vlastní vykreslení buňky (badge, odkaz, formátování). */
  render?: (row: T) => ReactNode;
  /** Zarovnání obsahu sloupce. */
  align?: "left" | "right";
}

export interface DataTableLabels {
  /** Popisek zaškrtávátka „vybrat vše na stránce“. */
  selectPage?: string;
  /** Popisek zaškrtávátka řádku. */
  selectRow?: (id: string) => string;
  /** Placeholder vyhledávacího pole. */
  filter?: (header: string) => string;
  /** Text „vše“ ve filtru sloupce. */
  all?: string;
  /** Slovo za počtem záznamů. */
  records?: (n: number) => string;
  /** Slovo za počtem vybraných řádků. */
  selected?: (n: number) => string;
  /** Slovo „Stránka“ v ovládání stránkování. */
  page?: (cur: number, total: number) => string;
  /** Popisek tlačítka předchozí stránky. */
  prev?: string;
  /** Popisek tlačítka další stránky. */
  next?: string;
  /** Text, když tabulka nemá žádná data. */
  empty?: string;
}

export interface DataTableProps<T extends { id: string }> {
  /** Data tabulky. Každý řádek musí mít unikátní `id`. */
  rows: T[];
  /** Definice sloupců. */
  columns: DataColumn<T>[];
  /** Počet řádků na stránku. */
  pageSize?: number;
  /** Zobrazí sloupec s checkboxy. */
  selectable?: boolean;
  /** Zavolá se při změně výběru s ID vybraných řádků. */
  onSelectionChange?: (ids: string[]) => void;
  /** Překlad textů v komponentě – výchozí je čeština. */
  labels?: DataTableLabels;
  /** Vlastní CSS třída přidaná ke kořenovému prvku. */
  className?: string;
}

const DEFAULT_LABELS: Required<DataTableLabels> = {
  selectPage: "Vybrat stránku",
  selectRow: (id) => `Vybrat řádek ${id}`,
  filter: (h) => `Filtr ${h}`,
  all: "vše",
  records: (n) => `${n} záznamů`,
  selected: (n) => `${n} vybráno`,
  page: (c, t) => `Strana ${c} z ${t}`,
  prev: "Předchozí strana",
  next: "Další strana",
  empty: "Žádné výsledky",
};

/** Tabulka s řazením, filtry, výběrem řádků a stránkováním. */
export function DataTable<T extends { id: string }>({
  rows,
  columns,
  pageSize = 5,
  selectable = true,
  onSelectionChange,
  labels,
  className,
}: DataTableProps<T>) {
  const L = { ...DEFAULT_LABELS, ...labels };
  const [sort, setSort] = useState<{ key: string; dir: 1 | -1 } | null>(null);
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [page, setPage] = useState(0);
  const [sel, setSel] = useState<Set<string>>(new Set());

  const data = useMemo(() => {
    let d = rows.filter((r) => Object.entries(filters).every(([k, v]) => !v || String(r[k as keyof T]) === v));
    if (sort) {
      d = [...d].sort((a, b) => {
        const x = a[sort.key as keyof T];
        const y = b[sort.key as keyof T];
        return (x > y ? 1 : x < y ? -1 : 0) * sort.dir;
      });
    }
    return d;
  }, [rows, filters, sort]);

  const pages = Math.max(1, Math.ceil(data.length / pageSize));
  const cur = Math.min(page, pages - 1);
  const slice = data.slice(cur * pageSize, cur * pageSize + pageSize);
  const update = (s: Set<string>) => {
    setSel(s);
    onSelectionChange?.([...s]);
  };
  const allOnPage = slice.length > 0 && slice.every((r) => sel.has(r.id));
  const toggleSort = (key: string) =>
    setSort(sort?.key === key ? (sort.dir === 1 ? { key, dir: -1 } : null) : { key, dir: 1 });

  return (
    <div className={cn("cbb-dtable", className)}>
      <div className="cbb-dtable__tools">
        {columns
          .filter((c) => c.filterable)
          .map((c) => (
            <select
              key={c.key}
              value={filters[c.key] ?? ""}
              aria-label={L.filter(c.header)}
              onChange={(e) => {
                setFilters({ ...filters, [c.key]: e.target.value });
                setPage(0);
              }}
            >
              <option value="">
                {c.header}: {L.all}
              </option>
              {[...new Set(rows.map((r) => String(r[c.key])))].map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          ))}
        <span>
          {sel.size > 0 && `${L.selected(sel.size)} · `}
          {L.records(data.length)}
        </span>
      </div>
      <div className="cbb-dtable__scroll">
        <table>
          <thead>
            <tr>
              {selectable && (
                <th className="cbb-dtable__check">
                  <Checkbox
                    aria-label={L.selectPage}
                    checked={allOnPage}
                    indeterminate={!allOnPage && slice.some((r) => sel.has(r.id))}
                    onChange={() => {
                      const s = new Set(sel);
                      slice.forEach((r) => (allOnPage ? s.delete(r.id) : s.add(r.id)));
                      update(s);
                    }}
                  />
                </th>
              )}
              {columns.map((c) => (
                <th
                  key={c.key}
                  style={{ textAlign: c.align }}
                  aria-sort={sort?.key === c.key ? (sort.dir === 1 ? "ascending" : "descending") : undefined}
                >
                  {c.sortable ? (
                    <button type="button" onClick={() => toggleSort(c.key)}>
                      {c.header} <i>{sort?.key === c.key ? (sort.dir === 1 ? "↑" : "↓") : "↕"}</i>
                    </button>
                  ) : (
                    c.header
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {slice.map((r) => (
              <tr key={r.id} className={sel.has(r.id) ? "is-selected" : ""}>
                {selectable && (
                  <td className="cbb-dtable__check">
                    <Checkbox
                      aria-label={L.selectRow(r.id)}
                      checked={sel.has(r.id)}
                      onChange={() => {
                        const s = new Set(sel);
                        if (s.has(r.id)) s.delete(r.id);
                        else s.add(r.id);
                        update(s);
                      }}
                    />
                  </td>
                )}
                {columns.map((c) => (
                  <td key={c.key} style={{ textAlign: c.align }}>
                    {c.render ? c.render(r) : String(r[c.key])}
                  </td>
                ))}
              </tr>
            ))}
            {!slice.length && (
              <tr>
                <td colSpan={columns.length + (selectable ? 1 : 0)} className="cbb-dtable__empty">
                  {L.empty}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="cbb-dtable__pager">
        <span>{L.page(cur + 1, pages)}</span>
        <button type="button" disabled={cur === 0} onClick={() => setPage(cur - 1)} aria-label={L.prev}>
          <ChevronLeftIcon size={16} />
        </button>
        <button type="button" disabled={cur >= pages - 1} onClick={() => setPage(cur + 1)} aria-label={L.next}>
          <ChevronRightIcon size={16} />
        </button>
      </div>
    </div>
  );
}
