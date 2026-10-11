import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "../lib/cn";

export interface ToggleProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onChange"> {
  /** Zda je tlačítko zapnuté. */
  pressed: boolean;
  /** Dostane nový stav. */
  onChange: (pressed: boolean) => void;
  /** Velikost. */
  size?: "sm" | "md";
}

/** Tlačítko se stavem zapnuto / vypnuto (např. tučné písmo). */
export function Toggle({ pressed, onChange, size = "md", className, children, ...rest }: ToggleProps) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      className={cn("cbb-toggle", `cbb-toggle--${size}`, pressed && "is-on", className)}
      onClick={() => onChange(!pressed)}
      {...rest}
    >
      {children}
    </button>
  );
}

export interface ToggleGroupItem {
  /** Hodnota, kterou `onChange` vrátí. */
  value: string;
  /** Text položky. */
  label: ReactNode;
  /** Zakáže položku. */
  disabled?: boolean;
}

export interface ToggleGroupProps {
  /** Možnosti skupiny. */
  items: ToggleGroupItem[];
  /** Vybraná hodnota. */
  value: string;
  /** Dostane hodnotu vybrané možnosti. */
  onChange: (value: string) => void;
  /** Vlastní CSS třída přidaná ke kořenovému prvku. */
  className?: string;
  /** Název skupiny pro čtečky obrazovky. */
  "aria-label"?: string;
}

/** Přepínač jedné z možností (seznam / mřížka / tabulka). */
export function ToggleGroup({ items, value, onChange, className, ...rest }: ToggleGroupProps) {
  return (
    <div role="group" aria-label={rest["aria-label"]} className={cn("cbb-togglegroup", className)}>
      {items.map((it) => (
        <button
          key={it.value}
          type="button"
          disabled={it.disabled}
          aria-pressed={value === it.value}
          className={cn("cbb-togglegroup__item", value === it.value && "is-on")}
          onClick={() => onChange(it.value)}
        >
          {it.label}
        </button>
      ))}
    </div>
  );
}
