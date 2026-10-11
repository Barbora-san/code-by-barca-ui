import { useState, type ReactNode } from "react";
import { cn } from "../lib/cn";
import type { FilterState } from "../hooks/useFilter";
import { FilterDropdown } from "./FilterDropdown";
import { SearchBar } from "./SearchBar";
import { Chip } from "./Chip";
import { ArrowUpDownIcon, SlidersIcon } from "./Icons";

export interface FilterBarLabels {
  /** Placeholder hledání. */
  search: string;
  /** Text tlačítka Filtry (mobil). */
  filters: string;
  /** Popisek řazení. */
  sort: string;
  /** Popisek aktivních filtrů. */
  active: string;
  /** Text „Vymazat vše“. */
  clear: string;
  /** „Zobrazeno 3 z 12“ */
  results: (count: number, total: number) => ReactNode;
  /** Hláška, když nic nevyhovuje. */
  empty: ReactNode;
}

/** Výchozí české texty `FilterBar`. */
export const DEFAULT_FILTER_LABELS: FilterBarLabels = {
  search: "Hledat…",
  filters: "Filtry",
  sort: "Řadit",
  active: "Aktivní",
  clear: "Vymazat vše",
  results: (count, total) => (
    <>
      Zobrazeno <strong>{count}</strong> z {total}
    </>
  ),
  empty: "Nic nenalezeno. Zkus upravit hledání nebo filtry.",
};

export interface FilterBarProps<T> {
  /** Návratová hodnota `useFilter`. */
  filter: FilterState<T>;
  /** Přepíše texty lišty. */
  labels?: Partial<FilterBarLabels>;
  /** Přilepí lištu nahoře při scrollu (`top` v px, výchozí 0). */
  sticky?: boolean | number;
  /** Skryje řádek s počtem výsledků. */
  hideCount?: boolean;
  /** Vlastní CSS třída přidaná ke kořenovému prvku. */
  className?: string;
}

/**
 * Lišta pro hledání a filtrování: vyhledávání, dropdowny, řazení, chipy aktivních filtrů a počet výsledků.
 * Na mobilu se dropdowny schovávají za tlačítko „Filtry“.
 */
export function FilterBar<T>({ filter, labels, sticky, hideCount, className }: FilterBarProps<T>) {
  const t = { ...DEFAULT_FILTER_LABELS, ...labels };
  const [open, setOpen] = useState(false);
  const f = filter;

  const hasSort = f.sorts.length > 0;
  const hasDropdowns = f.filters.length > 0 || hasSort;
  const style = typeof sticky === "number" ? { top: sticky } : undefined;

  return (
    <div className={cn("cbb-filterbar", sticky !== undefined && sticky !== false && "is-sticky", className)} style={style}>
      <div className="cbb-filterbar__top">
        {f.hasSearch && (
          <SearchBar
            className="cbb-filterbar__search"
            value={f.query}
            onChange={f.setQuery}
            placeholder={t.search}
            aria-label={t.search}
          />
        )}
        {hasDropdowns && (
          <button
            type="button"
            className={cn("cbb-filterbar__toggle", open && "is-open")}
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
          >
            <SlidersIcon size={16} />
            {t.filters}
            {f.activeCount > 0 && <span className="cbb-filterbar__badge">{f.activeCount}</span>}
          </button>
        )}
      </div>

      {hasDropdowns && (
        <div className={cn("cbb-filterbar__row", open && "is-open")}>
          {f.filters.map((def) =>
            def.multiple ? (
              <FilterDropdown
                key={def.key}
                multiple
                label={def.label}
                icon={def.icon}
                options={def.options}
                value={f.values[def.key] ?? []}
                onChange={(v) => f.setValue(def.key, v)}
              />
            ) : (
              <FilterDropdown
                key={def.key}
                label={def.label}
                icon={def.icon}
                options={def.options}
                value={f.values[def.key]?.[0] ?? "all"}
                onChange={(v) => f.setValue(def.key, v === "all" ? [] : [v])}
              />
            )
          )}
          {hasSort && (
            <FilterDropdown
              label={t.sort}
              icon={<ArrowUpDownIcon size={16} />}
              options={f.sorts.map((s) => ({ value: s.value, label: s.label }))}
              value={f.sort}
              onChange={f.setSort}
            />
          )}
        </div>
      )}

      {f.chips.length > 0 && (
        <div className="cbb-filterbar__chips">
          <span className="cbb-filterbar__chips-label">{t.active}:</span>
          <div className="cbb-filterbar__chips-list">
            {f.chips.map((chip) => (
              <Chip key={chip.id} onRemove={chip.onRemove} removeLabel={`${t.clear}: ${chip.label}`}>
                {chip.label}
              </Chip>
            ))}
          </div>
          <button type="button" className="cbb-filterbar__clear" onClick={f.reset}>
            {t.clear}
          </button>
        </div>
      )}

      {!hideCount && (
        <p className="cbb-filterbar__count" aria-live="polite">
          {t.results(f.filtered.length, f.total)}
        </p>
      )}
    </div>
  );
}
