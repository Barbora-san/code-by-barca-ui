import { useEffect, useState } from "react";

/** Vrátí `value` se zpožděním – změní se až po `delay` ms bez další změny (hledání při psaní, autosave). */
export function useDebounce<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}
