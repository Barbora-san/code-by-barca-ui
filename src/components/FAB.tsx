import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "../lib/cn";

export interface FABProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Ikona tlačítka. */
  icon: ReactNode;
  /** Text vedle ikony (rozšířený FAB). */
  label?: ReactNode;
  /** Barva tlačítka. */
  variant?: "primary" | "secondary";
  /** Roh obrazovky (jen s `fixed`). */
  position?: "bottom-right" | "bottom-left" | "bottom-center";
  /** `false` = zůstane v toku stránky (hodí se do ukázek). */
  fixed?: boolean;
  /** Přístupný název pro čtečky obrazovky (když není vidět text). */
  "aria-label"?: string;
}

/** Plovoucí akční tlačítko. Bez `label` musí mít `aria-label`. */
export function FAB({ icon, label, variant = "primary", position = "bottom-right", fixed = true, className, ...rest }: FABProps) {
  return (
    <button type="button" className={cn("cbb-fab", `cbb-fab--${variant}`, fixed && `cbb-fab--${position}`, label && "cbb-fab--extended", className)} {...rest}>
      {icon}
      {label && <span>{label}</span>}
    </button>
  );
}
