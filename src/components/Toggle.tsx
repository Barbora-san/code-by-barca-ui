import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "../lib/cn";

export interface ToggleProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onChange"> {
  pressed: boolean;
  onChange: (pressed: boolean) => void;
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
  value: string;
  label: ReactNode;
  disabled?: boolean;
}

export interface ToggleGroupProps {
  items: ToggleGroupItem[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
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
