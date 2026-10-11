import { useEffect, useState } from "react";

/**
 * Sleduje CSS media query, např. `useMediaQuery("(max-width: 640px)")`.
 * Na serveru (SSR) vrací `defaultValue`, aby se HTML shodovalo s prvním vykreslením v prohlížeči.
 */
export function useMediaQuery(query: string, defaultValue = false): boolean {
  const [matches, setMatches] = useState(defaultValue);
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mql = window.matchMedia(query);
    const update = () => setMatches(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, [query]);
  return matches;
}
