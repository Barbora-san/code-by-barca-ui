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
}

export function Card({
  as: Tag = "div",
  interactive,
  flush,
  raised,
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
        className
      )}
      {...rest}
    >
      {children}
    </Tag>
  );
}

export function CardMedia({ className, children, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("cbb-card__media", className)} {...rest}>
      {children}
    </div>
  );
}

export function CardBody({ className, children, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("cbb-card__body", className)} {...rest}>
      {children}
    </div>
  );
}
