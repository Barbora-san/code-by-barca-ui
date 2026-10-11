import type { ReactNode } from "react";
import { cn } from "../lib/cn";

export interface SectionHeadingProps {
  /** Mono štítek nad nadpisem, např. „// About Me“. */
  eyebrow?: ReactNode;
  /** Běžná část nadpisu. */
  title: ReactNode;
  /** Část nadpisu ve žluté barvě (vykreslí se za `title`). */
  accent?: ReactNode;
  /** Popis pod nadpisem. */
  description?: ReactNode;
  /** Zarovnání textu: na střed, nebo vlevo (s `action` vpravo). */
  align?: "center" | "left";
  /** Volitelný prvek vpravo (např. tlačítko „Zobrazit vše“). */
  action?: ReactNode;
  /** Vlastní CSS třída přidaná ke kořenovému prvku. */
  className?: string;
}

/** Nadpis oddílu: mono eyebrow, nadpis se žlutým slovem a popis. Samotné oddíly stránky si skládáš po svém. */
export function SectionHeading({
  eyebrow,
  title,
  accent,
  description,
  align = "center",
  action,
  className,
}: SectionHeadingProps) {
  return (
    <div className={cn("cbb-heading", `cbb-heading--${align}`, action && "cbb-heading--with-action", className)}>
      <div className="cbb-heading__text">
        {eyebrow && <span className="cbb-eyebrow">{eyebrow}</span>}
        <h2 className="cbb-heading__title">
          {title}
          {accent && (
            <>
              {" "}
              <span className="cbb-accent">{accent}</span>
            </>
          )}
        </h2>
        {description && <p className="cbb-heading__desc">{description}</p>}
      </div>
      {action && <div className="cbb-heading__action">{action}</div>}
    </div>
  );
}
