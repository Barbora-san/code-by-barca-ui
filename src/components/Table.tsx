import { useMemo, useState, type ReactNode } from "react";
import { normalizeText } from "../hooks/useFilter";
import { SearchBar } from "./SearchBar";
import { ChevronDownIcon, ChevronUpIcon } from "./Icons";
import { EmptyState } from "./EmptyState";
import { cn } from "../lib/cn";

export interface TableColumn<T> {
  /** Vlastnost řádku, kterou sloupec zobrazuje. */
  key: keyof T & string;
  /** Hlavička sloupce. */
  label: ReactNode;
  /** Zarovnání textu. */
  align?: "left" | "center" | "right";
  /** Ořízne text na N znaků (celý je v `title`). */
  truncate?: number;
  /** Nad tabulkou se objeví select pro filtrování podle hodnot sloupce. */
  filterable?: boolean;
  /** Povolí řazení kliknutím na hlavičku. */
  sortable?: boolean;
  /** Vlastní vykreslení buňky. */
  render?: (row: T) => ReactNode;
}

export interface TableProps<T> {
  /** Sloupce. */
  columns: TableColumn<T>[];
  /** Řádky. */
  data: T[];
  /** Zobrazí pole pro hledání. */
  searchable?: boolean;
  /** Text v poli hledání. */
  searchPlaceholder?: string;
  /** Dostane kliknutý řádek. */
  onRowClick?: (row: T) => void;
  /** Funkce vracející jedinečný klíč řádku (výchozí index). */
  rowKey?: (row: T, index: number) => string | number;
  /** Text, když nic nevyhovuje. */
  emptyLabel?: ReactNode;
  /** Vlastní CSS třída přidaná ke kořenovému prvku. */
  className?: string;
}

const text = (v: unknown) => (v === null || v === undefined ? "" : String(v));

/** Tabulka s fulltextem (bez diakritiky), filtry sloupců, řazením a ořezáváním dlouhých hodnot. */
export function Table<T extends Record<string, unknown>>({ columns, data, searchable, searchPlaceholder = "Hledat…", onRowClick, rowKey, emptyLabel = "Žádná data", className }: TableProps<T>) {
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [sort, setSort] = useState<{ key: string; dir: "asc" | "desc" } | null>(null);

  const rows = useMemo(() => {
    const words = normalizeText(query).trim().split(/\s+/).filter(Boolean);
    let out = data.filter((row) => {
      if (words.length) {
        const hay = normalizeText(columns.map((c) => text(row[c.key])).join(" "));
        if (!words.every((w) => hay.includes(w))) return false;
      }
      return columns.every((c) => !filters[c.key] || text(row[c.key]) === filters[c.key]);
    });
    if (sort) {
      const { key, dir } = sort;
      out = [...out].sort((a, b) => {
        const av = a[key];
        const bv = b[key];
        const r = typeof av === "number" && typeof bv === "number" ? av - bv : text(av).localeCompare(text(bv), "cs", { numeric: true });
        return dir === "asc" ? r : -r;
      });
    }
    return out;
  }, [data, columns, query, filters, sort]);

  const filterCols = columns.filter((c) => c.filterable);
  const toggleSort = (key: string) =>
    setSort((s) => (s?.key !== key ? { key, dir: "asc" } : s.dir === "asc" ? { key, dir: "desc" } : null));

  return (
    <div className={cn("cbb-table-wrap", className)}>
      {(searchable || filterCols.length > 0) && (
        <div className="cbb-table__tools">
          {searchable && <SearchBar value={query} onChange={setQuery} placeholder={searchPlaceholder} className="cbb-table__search" />}
          {filterCols.map((c) => {
            const values = [...new Set(data.map((r) => text(r[c.key])).filter(Boolean))].sort((a, b) => a.localeCompare(b, "cs"));
            return (
              <div key={c.key} className="cbb-select cbb-table__filter">
                <select aria-label={typeof c.label === "string" ? c.label : c.key} className="cbb-input" value={filters[c.key] ?? ""} onChange={(e) => setFilters((f) => ({ ...f, [c.key]: e.target.value }))}>
                  <option value="">{typeof c.label === "string" ? c.label : c.key}: vše</option>
                  {values.map((v) => (
                    <option key={v} value={v}>
                      {v}
                    </option>
                  ))}
                </select>
                <ChevronDownIcon size={16} className="cbb-select__chevron" />
              </div>
            );
          })}
        </div>
      )}
      <div className="cbb-table__scroll">
        <table className="cbb-table">
          <thead>
            <tr>
              {columns.map((c) => {
                const sorted = sort?.key === c.key ? sort.dir : null;
                return (
                  <th key={c.key} scope="col" style={{ textAlign: c.align }} aria-sort={sorted === "asc" ? "ascending" : sorted === "desc" ? "descending" : undefined}>
                    {c.sortable ? (
                      <button type="button" className="cbb-table__sort" onClick={() => toggleSort(c.key)}>
                        {c.label}
                        <span className={cn("cbb-table__arrows", sorted && "is-on")}>{sorted === "desc" ? <ChevronDownIcon size={14} /> : <ChevronUpIcon size={14} />}</span>
                      </button>
                    ) : (
                      c.label
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr
                key={rowKey ? rowKey(row, i) : i}
                className={cn(onRowClick && "is-clickable")}
                tabIndex={onRowClick ? 0 : undefined}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                onKeyDown={onRowClick ? (e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), onRowClick(row)) : undefined}
              >
                {columns.map((c) => {
                  const raw = text(row[c.key]);
                  const shown = c.truncate && raw.length > c.truncate ? `${raw.slice(0, c.truncate)}…` : raw;
                  return (
                    <td key={c.key} style={{ textAlign: c.align }} title={shown !== raw ? raw : undefined}>
                      {c.render ? c.render(row) : shown}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length === 0 && <EmptyState title={emptyLabel} className="cbb-table__empty" />}
      </div>
    </div>
  );
}
