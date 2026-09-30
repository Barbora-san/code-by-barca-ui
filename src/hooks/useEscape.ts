import { useEffect } from "react";

/** Zavolá `handler` při stisku Escape, dokud je `active` true. */
export function useEscape(active: boolean, handler: () => void) {
  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handler();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [active, handler]);
}
