import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "../lib/cn";

export type BadgeVariant = "accent" | "outline" | "muted" | "success" | "danger" | "info";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  /** Malá tečka před textem (např. stav „volný“). */
  dot?: boolean;
  icon?: ReactNode;
}

/** Pill štítek – kategorie projektu, stav, počet… */
export function Badge({ variant = "accent", dot, icon, className, children, ...rest }: BadgeProps) {
  return (
    <span className={cn("cbb-badge", `cbb-badge--${variant}`, className)} {...rest}>
      {dot && <span className="cbb-badge__dot" />}
      {icon}
      {children}
    </span>
  );
}

export interface TagProps extends HTMLAttributes<HTMLSpanElement> {
  /** Zvýrazní se při hoveru v akcentové barvě. */
  interactive?: boolean;
}

/** Drobný štítek technologie (např. „React“, „Figma“). */
export function Tag({ interactive, className, children, ...rest }: TagProps) {
  return (
    <span className={cn("cbb-tag", interactive && "cbb-tag--interactive", className)} {...rest}>
      {children}
    </span>
  );
}
