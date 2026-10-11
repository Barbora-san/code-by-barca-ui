import type { CSSProperties, ElementType, HTMLAttributes } from "react";
import { cn } from "../lib/cn";
import { useScrollReveal } from "../hooks/useScrollReveal";

export interface RevealProps extends HTMLAttributes<HTMLElement> {
  /** HTML prvek nebo komponenta, ve které se obsah vykreslí. */
  as?: ElementType;
  /** Pořadí v mřížce – dopočítá zpoždění (stagger), max 8 kroků. */
  index?: number;
  /** Zpoždění jednoho kroku v ms (výchozí 80). */
  step?: number;
  /** Okraj viewportu pro spuštění animace (např. `0px 0px -10% 0px`). */
  rootMargin?: string;
}

/** Fade-up při vjezdu do viewportu. Respektuje `prefers-reduced-motion`. */
export function Reveal({
  as: Tag = "div",
  index = 0,
  step = 80,
  rootMargin,
  className,
  style,
  children,
  ...rest
}: RevealProps) {
  const [ref, visible] = useScrollReveal<HTMLElement>({ rootMargin });
  const merged: CSSProperties = {
    ...style,
    transitionDelay: visible ? `${Math.min(index, 8) * step}ms` : "0ms",
  };
  return (
    <Tag
      ref={ref}
      className={cn("cbb-reveal", visible && "is-visible", className)}
      style={merged}
      {...rest}
    >
      {children}
    </Tag>
  );
}
