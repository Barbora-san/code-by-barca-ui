import type { ElementType, HTMLAttributes } from "react";
import { cn } from "../lib/cn";

export interface CardProps extends HTMLAttributes<HTMLElement> {
  /** Element, který se vykreslí (výchozí `div`). */
  as?: ElementType;
  /** Hover efekt – akcentový okraj + jemné zvětšení. */
  interactive?: boolean;
  /** Ořízne obsah (užitečné pro karty s obrázkem). */
  flush?: boolean;
  /** Světlejší povrch (#1a1a1a) – pro karty uvnitř karet. */
  raised?: boolean;
  /** Stín pod kartou. */
  shadow?: boolean;
  /** Padding jako u formulářové karty. */
  form?: boolean;
  /** Žlutá záře při hoveru (jako u karet dovedností). */
  glow?: boolean;
  /** „Geeky“ rohové závorky v levém horním a pravém dolním rohu. */
  corners?: boolean;
}

/** Základní karta. Přepínače glow, corners a interactive dělají karty z webu (dovednosti, formuláře, projekty). */
export function Card({
  as: Tag = "div",
  interactive,
  flush,
  raised,
  shadow,
  form,
  glow,
  corners,
  className,
  children,
  ...rest
}: CardProps) {
  return (
    <Tag
      className={cn(
        "cbb-card",
        interactive && "cbb-card--interactive",
        flush && "cbb-card--flush",
        raised && "cbb-card--raised",
        shadow && "cbb-card--shadow",
        form && "cbb-card--form",
        glow && "cbb-card--glow",
        corners && "cbb-card--corners",
        className
      )}
      {...rest}
    >
      {children}
    </Tag>
  );
}

/** Obrázková část `Card` (nahoře, bez paddingu). */
export function CardMedia({ className, children, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("cbb-card__media", className)} {...rest}>
      {children}
    </div>
  );
}

/** Textová část `Card` s paddingem. */
export function CardBody({ className, children, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("cbb-card__body", className)} {...rest}>
      {children}
    </div>
  );
}
