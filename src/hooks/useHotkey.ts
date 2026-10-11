import { useEffect, useRef } from "react";

/**
 * Zavolá `handler` při stisku klávesové zkratky, např. `"mod+k"` (mod = Ctrl, na Macu ⌘), `"shift+/"`, `"alt+n"`.
 * Prohlížečovou akci zkratky zruší. `enabled=false` zkratku vypne.
 */
export function useHotkey(combo: string | null, handler: (e: KeyboardEvent) => void, enabled = true) {
  const ref = useRef(handler);
  ref.current = handler;
  useEffect(() => {
    if (!combo || !enabled) return;
    const parts = combo.toLowerCase().split("+").map((s) => s.trim());
    const key = parts[parts.length - 1]!;
    const want = { mod: parts.includes("mod"), ctrl: parts.includes("ctrl"), meta: parts.includes("meta"), shift: parts.includes("shift"), alt: parts.includes("alt") };
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() !== key) return;
      const mod = e.ctrlKey || e.metaKey;
      if (want.mod !== mod && !want.ctrl && !want.meta) return;
      if (want.ctrl && !e.ctrlKey) return;
      if (want.meta && !e.metaKey) return;
      if (want.shift !== e.shiftKey || want.alt !== e.altKey) return;
      e.preventDefault();
      ref.current(e);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [combo, enabled]);
}
