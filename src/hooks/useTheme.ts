import { useCallback, useEffect, useState } from "react";

export type ThemeMode = "light" | "dark" | "system";

export interface UseThemeOptions {
  /** Klíč v localStorage. */
  storageKey?: string;
  /** Režim, dokud uživatel nic nevybral. `system` = podle nastavení zařízení. */
  defaultMode?: ThemeMode;
}

const EVENT = "cbb-theme-change";
const isMode = (v: unknown): v is ThemeMode => v === "light" || v === "dark" || v === "system";

function systemDark() {
  return typeof window !== "undefined" && !!window.matchMedia?.("(prefers-color-scheme: dark)").matches;
}
function readStored(key: string, fallback: ThemeMode): ThemeMode {
  try {
    const v = window.localStorage.getItem(key);
    return isMode(v) ? v : fallback;
  } catch {
    return fallback;
  }
}

/**
 * Světlý / tmavý / systémový režim. Nastavuje `data-theme` na `<html>`, pamatuje si volbu
 * v localStorage a synchronizuje všechny použití hooku (i další karty prohlížeče).
 * Aby při načtení stránky neproblikl špatný režim, vlož do `<head>` skript z `getThemeInitScript()`.
 */
export function useTheme({ storageKey = "cbb-theme", defaultMode = "system" }: UseThemeOptions = {}) {
  const [mode, setModeState] = useState<ThemeMode>(defaultMode);
  const [dark, setDark] = useState(true);

  // načtení uložené volby až po připojení – HTML ze serveru se tak shoduje s prvním vykreslením
  useEffect(() => {
    setModeState(readStored(storageKey, defaultMode));
    setDark(systemDark());
    const onChange = () => setModeState(readStored(storageKey, defaultMode));
    const onStorage = (e: StorageEvent) => e.key === storageKey && onChange();
    window.addEventListener(EVENT, onChange);
    window.addEventListener("storage", onStorage);
    const mql = window.matchMedia?.("(prefers-color-scheme: dark)");
    const onSys = () => setDark(!!mql?.matches);
    mql?.addEventListener("change", onSys);
    return () => {
      window.removeEventListener(EVENT, onChange);
      window.removeEventListener("storage", onStorage);
      mql?.removeEventListener("change", onSys);
    };
  }, [storageKey, defaultMode]);

  const resolved: "light" | "dark" = mode === "system" ? (dark ? "dark" : "light") : mode;

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", resolved);
  }, [resolved]);

  const setMode = useCallback(
    (m: ThemeMode) => {
      setModeState(m);
      try {
        window.localStorage.setItem(storageKey, m);
      } catch {
        /* úložiště zakázané – volba platí jen do obnovení stránky */
      }
      window.dispatchEvent(new Event(EVENT));
    },
    [storageKey]
  );
  const toggle = useCallback(() => setMode(resolved === "dark" ? "light" : "dark"), [resolved, setMode]);
  return { mode, resolved, setMode, toggle };
}

/** Text inline skriptu pro `<head>` – nastaví `data-theme` ještě před vykreslením (bez probliknutí). */
export function getThemeInitScript(storageKey = "cbb-theme", defaultMode: ThemeMode = "system") {
  return `(function(){try{var m=localStorage.getItem(${JSON.stringify(storageKey)})||${JSON.stringify(defaultMode)};var d=m==="dark"||(m==="system"&&window.matchMedia("(prefers-color-scheme: dark)").matches);document.documentElement.setAttribute("data-theme",d?"dark":"light")}catch(e){}})()`;
}
