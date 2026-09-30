import { useEffect } from "react";

/** Zamkne scroll stránky, dokud je `locked` true (modal, lightbox, mobilní menu). */
export function useLockBodyScroll(locked: boolean) {
  useEffect(() => {
    if (!locked || typeof document === "undefined") return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [locked]);
}
