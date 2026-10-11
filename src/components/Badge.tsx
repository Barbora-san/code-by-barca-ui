import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "../lib/cn";

export type BadgeVariant = "default" | "secondary" | "outline" | "destructive" | "success" | "info" | "warning";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  /** Barva a styl odznaku. */
  variant?: BadgeVariant;
  /** Malá tečka před textem (např. stav „volný“). */
  dot?: boolean;
  /** Ikona před textem. */
  icon?: ReactNode;
}

/** Pill štítek – kategorie projektu, stav, počet… */
export function Badge({ variant = "default", dot, icon, className, children, ...rest }: BadgeProps) {
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
