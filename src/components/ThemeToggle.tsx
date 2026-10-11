import { cn } from "../lib/cn";
import { useTheme, type ThemeMode, type UseThemeOptions } from "../hooks/useTheme";
import { MonitorIcon, MoonIcon, SunIcon } from "./Icons";

export interface ThemeToggleProps extends UseThemeOptions {
  /** `icon` = jedno tlačítko (přepíná světlý ↔ tmavý, s `includeSystem` i systémový), `segmented` = tři tlačítka vedle sebe. */
  variant?: "icon" | "segmented";
  /** U `icon` přidá do cyklu i režim „podle systému“. U `segmented` se systém ukazuje vždy. */
  includeSystem?: boolean;
  /** Popisky pro čtečky obrazovky a tooltipy. */
  labels?: Partial<Record<ThemeMode, string>>;
  /** Vlastní CSS třída přidaná ke kořenovému prvku. */
  className?: string;
}

const DEFAULT_LABELS: Record<ThemeMode, string> = { light: "Světlý režim", dark: "Tmavý režim", system: "Podle systému" };
const ICONS = { light: SunIcon, dark: MoonIcon, system: MonitorIcon } as const;

/** Přepínač světlého / tmavého režimu. Používá `useTheme`, takže sám nastaví `data-theme` na `<html>` a pamatuje si volbu. */
export function ThemeToggle({ variant = "icon", includeSystem = false, labels, storageKey, defaultMode, className }: ThemeToggleProps) {
  const { mode, resolved, setMode } = useTheme({ storageKey, defaultMode });
  const L = { ...DEFAULT_LABELS, ...labels };

  if (variant === "segmented") {
    return (
      <div className={cn("cbb-theme-seg", className)} role="group" aria-label="Barevný režim">
        {(["light", "dark", "system"] as const).map((m) => {
          const Icon = ICONS[m];
          return (
            <button key={m} type="button" className={cn(mode === m && "is-active")} aria-pressed={mode === m} aria-label={L[m]} title={L[m]} onClick={() => setMode(m)}>
              <Icon size={16} />
            </button>
          );
        })}
      </div>
    );
  }
  const order: ThemeMode[] = includeSystem ? ["light", "dark", "system"] : ["light", "dark"];
  const current: ThemeMode = includeSystem ? mode : resolved;
  const next = order[(order.indexOf(current) + 1) % order.length]!;
  const Icon = ICONS[current];
  return (
    <button type="button" className={cn("cbb-theme-btn", className)} aria-label={`${L[next]} (přepnout)`} title={L[next]} onClick={() => setMode(next)}>
      <Icon size={18} />
    </button>
  );
}
