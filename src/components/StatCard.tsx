import type { ReactNode } from "react";
import { cn } from "../lib/cn";

export interface StatCardProps {
  /** Popisek čísla. */
  label: ReactNode;
  /** Hlavní hodnota (velké číslo). */
  value: ReactNode;
  /** Změna, např. `+8.2%` nebo `-3.1%` – znaménko určí barvu. */
  change?: string;
  /** Vlastní směr, když text změny nezačíná + / -. */
  trend?: "up" | "down" | "neutral";
  /** Ikona v rohu. */
  icon?: ReactNode;
  /** Šedý text pod hodnotou. */
  hint?: ReactNode;
  /** Vlastní CSS třída přidaná ke kořenovému prvku. */
  className?: string;
}

/** Číslo s popiskem a změnou. Znaménko + / − určí barvu trendu. */
export function StatCard({ label, value, change, trend, icon, hint, className }: StatCardProps) {
  const dir = trend ?? (change?.trim().startsWith("-") ? "down" : change?.trim().startsWith("+") ? "up" : "neutral");
  return (
    <div className={cn("cbb-card cbb-stat", className)}>
      <div className="cbb-stat__top">
        <span className="cbb-stat__label">{label}</span>
        {icon && <span className="cbb-stat__icon">{icon}</span>}
      </div>
      <div className="cbb-stat__value">{value}</div>
      {(change || hint) && (
        <div className="cbb-stat__foot">
          {change && <span className={cn("cbb-stat__change", `is-${dir}`)}>{change}</span>}
          {hint && <span className="cbb-stat__hint">{hint}</span>}
        </div>
      )}
    </div>
  );
}
