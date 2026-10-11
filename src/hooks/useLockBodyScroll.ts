import { useEffect } from "react";

let locks = 0;
let saved: { overflow: string; paddingRight: string } | null = null;

/**
 * Zamkne scroll stránky, dokud je `locked` true (modal, lightbox, mobilní menu).
 * Je počítaný: když je otevřených víc překryvů najednou (dialog nad sheetem),
 * scroll se vrátí až po zavření posledního – v jakémkoli pořadí.
 */
export function useLockBodyScroll(locked: boolean) {
  useEffect(() => {
    if (!locked || typeof document === "undefined") return;
    const body = document.body;
    if (locks === 0) {
      saved = { overflow: body.style.overflow, paddingRight: body.style.paddingRight };
      // místo zmizelého posuvníku doplníme padding, ať stránka „neskočí“
      const gap = window.innerWidth - document.documentElement.clientWidth;
      if (gap > 0) body.style.paddingRight = `${gap}px`;
      body.style.overflow = "hidden";
    }
    locks++;
    return () => {
      locks = Math.max(0, locks - 1);
      if (locks === 0 && saved) {
        body.style.overflow = saved.overflow;
        body.style.paddingRight = saved.paddingRight;
        saved = null;
      }
    };
  }, [locked]);
}
