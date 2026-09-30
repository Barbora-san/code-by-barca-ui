import type { HTMLAttributes } from "react";
import { cn } from "../lib/cn";

export interface SectionProps extends HTMLAttributes<HTMLElement> {
  /** `base` = #0a0a0a, `alt` = #0f0f0f – střídají se pod sebou. */
  tone?: "base" | "alt";
  /** Tenká žlutá linka na horním okraji. */
  topLine?: boolean;
  /** Rozmazané žluté „světlo“ v pozadí. */
  glow?: "left" | "right" | "center" | "none";
  /** Jemná mřížka v pozadí. */
  grid?: boolean;
  /** Bez vnitřního kontejneru (max-width) – pro full-bleed obsah. */
  bleed?: boolean;
}

export function Section({
  tone = "base",
  topLine = true,
  glow = "right",
  grid,
  bleed,
  className,
  children,
  ...rest
}: SectionProps) {
  return (
    <section className={cn("cbb-section", `cbb-section--${tone}`, className)} {...rest}>
      {/* dekorace jsou v ořezané vrstvě, aby popupy uvnitř sekce (dropdown, date picker) nebyly useknuté */}
      <div className="cbb-section__decor" aria-hidden="true">
        {topLine && <div className="cbb-section__line" />}
        {glow !== "none" && <div className={cn("cbb-section__glow", `cbb-section__glow--${glow}`)} />}
        {grid && <div className="cbb-section__grid" />}
      </div>
      {bleed ? children : <div className="cbb-container">{children}</div>}
    </section>
  );
}
