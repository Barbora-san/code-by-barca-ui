import { type CSSProperties, type ReactNode } from "react";
import { cn } from "../lib/cn";

export interface SpinnerProps {
  /**
   * Podoba loaderu: `ring` = točící se kroužek, `dots` = tři poskakující tečky, `bars` = vlnící se sloupce,
   * `pulse` = pulzující kruh, `custom` = tvoje vlastní značka z `children` (např. logo) s pohybem podle `motion`.
   */
  variant?: "ring" | "dots" | "bars" | "pulse" | "custom";
  /** Velikost: `sm` 16 px, `md` 24 px, `lg` 40 px, nebo vlastní číslo v px. */
  size?: "sm" | "md" | "lg" | number;
  /** Viditelný text vedle loaderu (např. „Načítám…“). Bez něj zůstane jen přístupný popisek. */
  label?: ReactNode;
  /** Přístupný popisek pro čtečky obrazovky, když není vidět `label`. */
  "aria-label"?: string;
  /** Doba jednoho cyklu v sekundách – menší číslo = rychlejší. */
  duration?: number;
  /** Barva loaderu (CSS barva). Výchozí je akcentová žlutá. */
  color?: string;
  /** Pohyb vlastní značky u `variant="custom"`: otáčení, pulz, nebo vznášení. */
  motion?: "spin" | "pulse" | "float";
  /** Zarovná loader na střed rodiče a text dá pod něj. */
  center?: boolean;
  /** Překryje celého rodiče (musí mít `position: relative`) poloprůhledným pozadím – pro načítání karty nebo tabulky. */
  overlay?: boolean;
  /** Vlastní značka pro `variant="custom"` – SVG, obrázek, text. */
  children?: ReactNode;
  /** Vlastní CSS třída přidaná ke kořenovému prvku. */
  className?: string;
}

const SIZES = { sm: 16, md: 24, lg: 40 } as const;

/**
 * Univerzální loader. Čtyři vestavěné podoby a `custom` pro vlastní značku (logo).
 * Respektuje `prefers-reduced-motion` (zpomalí a zjednoduší animaci).
 */
export function Spinner({
  variant = "ring",
  size = "md",
  label,
  "aria-label": ariaLabel = "Načítání",
  duration,
  color,
  motion = "spin",
  center,
  overlay,
  children,
  className,
}: SpinnerProps) {
  const px = typeof size === "number" ? size : SIZES[size];
  const style = {
    "--cbb-spin-size": `${px}px`,
    ...(color ? { "--cbb-spin-color": color } : null),
    ...(duration ? { "--cbb-spin-duration": `${duration}s` } : null),
  } as CSSProperties;
  const mark =
    variant === "dots" ? (
      <span className="cbb-spin__dots" aria-hidden="true"><i /><i /><i /></span>
    ) : variant === "bars" ? (
      <span className="cbb-spin__bars" aria-hidden="true"><i /><i /><i /><i /></span>
    ) : variant === "pulse" ? (
      <span className="cbb-spin__pulse" aria-hidden="true" />
    ) : variant === "custom" ? (
      <span className={cn("cbb-spin__custom", `is-${motion}`)} aria-hidden="true">{children}</span>
    ) : (
      <span className="cbb-spin__ring" aria-hidden="true" />
    );
  return (
    <span
      role="status"
      aria-live="polite"
      aria-label={label ? undefined : ariaLabel}
      className={cn("cbb-spin", center && "is-center", overlay && "is-overlay", className)}
      style={style}
    >
      {mark}
      {label && <span className="cbb-spin__label">{label}</span>}
    </span>
  );
}
