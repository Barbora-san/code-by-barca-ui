import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Stav uložený v `localStorage` (JSON). Bezpečný pro SSR i pro prohlížeče, kde je úložiště zablokované.
 * První vykreslení vždy použije `initial`, uložená hodnota se načte hned po připojení (bez rozdílu v HTML).
 * Změny se synchronizují i mezi kartami prohlížeče.
 */
export function useLocalStorage<T>(key: string, initial: T): [T, (v: T | ((prev: T) => T)) => void, () => void] {
  const [value, setValue] = useState<T>(initial);
  const initialRef = useRef(initial);

  useEffect(() => {
    const read = () => {
      try {
        const raw = window.localStorage.getItem(key);
        setValue(raw === null ? initialRef.current : (JSON.parse(raw) as T));
      } catch {
        setValue(initialRef.current);
      }
    };
    read();
    const onStorage = (e: StorageEvent) => e.key === key && read();
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [key]);

  const set = useCallback(
    (v: T | ((prev: T) => T)) => {
      setValue((prev) => {
        const next = typeof v === "function" ? (v as (p: T) => T)(prev) : v;
        try {
          window.localStorage.setItem(key, JSON.stringify(next));
        } catch {
          /* úložiště je plné nebo zakázané – hodnota zůstane jen v paměti */
        }
        return next;
      });
    },
    [key]
  );

  const remove = useCallback(() => {
    try {
      window.localStorage.removeItem(key);
    } catch {
      /* ignorováno */
    }
    setValue(initialRef.current);
  }, [key]);

  return [value, set, remove];
}
