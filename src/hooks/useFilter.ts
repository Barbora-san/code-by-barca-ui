import { useCallback, useMemo, useState, type ReactNode } from "react";
import type { FilterOption } from "../components/FilterDropdown";

/** Odstraní diakritiku a převede na malá písmena („Žlutá“ najde i „zluta“). */
export function normalizeText(value: unknown): string {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

export interface FilterDef<T> {
  /** Unikátní klíč filtru (např. `category`). */
  key: string;
  /** Popisek ve dropdownu. */
  label: string;
  icon?: ReactNode;
  /** Více voleb najednou (položka projde, když má aspoň jednu z vybraných hodnot). */
  multiple?: boolean;
  /** Hodnota(y) položky pro tento filtr. */
  getValue: (item: T) => string | string[] | null | undefined;
  /**
   * Vlastní nabídka voleb. Bez ní se odvodí z dat (unikátní hodnoty, seřazené abecedně).
   * Počty u voleb se dopočítají vždy.
   */
  options?: { value: string; label?: string; dotClass?: string; icon?: ReactNode }[];
  /** Popisek volby „vše“ u jednoduchého (single) filtru. */
  allLabel?: string;
  /** Text zobrazený v chipu aktivního filtru. */
  chipLabel?: (value: string) => string;
}

export interface SortDef<T> {
  value: string;
  label: string;
  compare: (a: T, b: T) => number;
}

export interface UseFilterOptions<T> {
  items: T[];
  /** Text položky, ve kterém se hledá (název, popis, tagy…). Bez něj není vyhledávání. */
  searchText?: (item: T) => string;
  filters?: FilterDef<T>[];
  sorts?: SortDef<T>[];
  /** Výchozí řazení (`value` z `sorts`), jinak první. */
  defaultSort?: string;
  initialQuery?: string;
  initialValues?: Record<string, string[]>;
}

export interface FilterChipModel {
  id: string;
  label: string;
  onRemove: () => void;
}

export interface FilterState<T> {
  query: string;
  setQuery: (q: string) => void;
  values: Record<string, string[]>;
  setValue: (key: string, value: string[]) => void;
  sort: string;
  setSort: (sort: string) => void;
  reset: () => void;

  /** Výsledek – vyhledáno, vyfiltrováno, seřazeno. */
  filtered: T[];
  total: number;
  /** Počet aktivních omezení (hledání + vybrané hodnoty), bez řazení. */
  activeCount: number;

  // modely pro <FilterBar />
  filters: (FilterDef<T> & { options: FilterOption[] })[];
  sorts: SortDef<T>[];
  chips: FilterChipModel[];
  hasSearch: boolean;
}

const asArray = (v: string | string[] | null | undefined): string[] =>
  v == null ? [] : Array.isArray(v) ? v.filter(Boolean) : v === "" ? [] : [v];

/**
 * Hledání + filtry + řazení nad polem libovolných položek.
 *
 *   const f = useFilter({ items: projects, searchText: p => `${p.title} ${p.tags.join(" ")}`,
 *     filters: [{ key: "category", label: "Kategorie", multiple: true, getValue: p => p.category }],
 *     sorts: [{ value: "new", label: "Nejnovější", compare: (a,b) => b.date - a.date }] });
 *   <FilterBar filter={f} />   →   f.filtered.map(...)
 *
 * Počty u voleb jsou „fasetové“: počítají se nad položkami, které projdou hledáním
 * a ostatními filtry – takže číslo vždy sedí s tím, co uvidíš po kliknutí.
 */
export function useFilter<T>({
  items,
  searchText,
  filters = [],
  sorts = [],
  defaultSort,
  initialQuery = "",
  initialValues = {},
}: UseFilterOptions<T>): FilterState<T> {
  const [query, setQuery] = useState(initialQuery);
  const [values, setValues] = useState<Record<string, string[]>>(initialValues);
  const [sort, setSort] = useState(defaultSort ?? sorts[0]?.value ?? "");

  const setValue = useCallback((key: string, value: string[]) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  }, []);

  const reset = useCallback(() => {
    setQuery("");
    setValues({});
  }, []);

  // předpočítaný text pro hledání (řetězec normalizujeme jen jednou na položku)
  const haystacks = useMemo(
    () => (searchText ? items.map((item) => normalizeText(searchText(item))) : null),
    [items, searchText]
  );

  const words = useMemo(() => normalizeText(query).trim().split(/\s+/).filter(Boolean), [query]);

  const passesQuery = useCallback(
    (index: number) => {
      if (!words.length || !haystacks) return true;
      const text = haystacks[index];
      return words.every((w) => text.includes(w));
    },
    [words, haystacks]
  );

  const passesFilter = useCallback(
    (item: T, def: FilterDef<T>) => {
      const selected = values[def.key];
      if (!selected || selected.length === 0) return true;
      const own = asArray(def.getValue(item));
      return own.some((v) => selected.includes(v));
    },
    [values]
  );

  const filtered = useMemo(() => {
    const out: T[] = [];
    items.forEach((item, i) => {
      if (passesQuery(i) && filters.every((f) => passesFilter(item, f))) out.push(item);
    });
    const s = sorts.find((x) => x.value === sort);
    if (s) out.sort(s.compare);
    return out;
  }, [items, filters, sorts, sort, passesQuery, passesFilter]);

  const modelFilters = useMemo(
    () =>
      filters.map((def) => {
        // položky, které projdou hledáním a VŠEMI OSTATNÍMI filtry
        const scope: T[] = [];
        items.forEach((item, i) => {
          if (passesQuery(i) && filters.every((f) => f.key === def.key || passesFilter(item, f))) scope.push(item);
        });

        const counts = new Map<string, number>();
        scope.forEach((item) => {
          for (const v of new Set(asArray(def.getValue(item)))) counts.set(v, (counts.get(v) ?? 0) + 1);
        });

        let base = def.options;
        if (!base) {
          const all = new Set<string>();
          items.forEach((item) => asArray(def.getValue(item)).forEach((v) => all.add(v)));
          base = [...all].sort((a, b) => a.localeCompare(b, "cs")).map((value) => ({ value }));
        }

        const options: FilterOption[] = base.map((o) => ({
          value: o.value,
          label: o.label ?? o.value,
          count: counts.get(o.value) ?? 0,
          dotClass: o.dotClass,
          icon: o.icon,
        }));

        if (!def.multiple) {
          options.unshift({ value: "all", label: def.allLabel ?? "Vše", count: scope.length });
        }
        return { ...def, options };
      }),
    [filters, items, passesQuery, passesFilter]
  );

  const chips = useMemo<FilterChipModel[]>(() => {
    const out: FilterChipModel[] = [];
    for (const def of filters) {
      const selected = values[def.key] ?? [];
      const opts = def.options ?? [];
      for (const v of selected) {
        const label = def.chipLabel?.(v) ?? opts.find((o) => o.value === v)?.label ?? v;
        out.push({
          id: `${def.key}:${v}`,
          label,
          onRemove: () => setValue(def.key, selected.filter((x) => x !== v)),
        });
      }
    }
    if (query.trim()) out.push({ id: "q", label: `„${query.trim()}“`, onRemove: () => setQuery("") });
    return out;
  }, [filters, values, query, setValue]);

  const activeCount =
    (query.trim() ? 1 : 0) + filters.reduce((n, f) => n + (values[f.key]?.length ? values[f.key].length : 0), 0);

  return {
    query,
    setQuery,
    values,
    setValue,
    sort,
    setSort,
    reset,
    filtered,
    total: items.length,
    activeCount,
    filters: modelFilters,
    sorts,
    chips,
    hasSearch: Boolean(searchText),
  };
}
