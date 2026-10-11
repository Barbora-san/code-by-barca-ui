import type { ElementType, KeyboardEvent, ReactNode } from "react";
import { cn } from "../lib/cn";
import { ChevronRightIcon } from "./Icons";
import { SkillLevelBar, type SkillLevelBarProps } from "./SkillLevelBar";
import { Reveal } from "./Reveal";
import { Tag } from "./Badge";
import { isExternalHref, useLinkComponent } from "../lib/link";

export interface SkillCardProps {
  /** Název dovednosti. */
  title: ReactNode;
  /** Krátký popis (max. 3 řádky). */
  description?: ReactNode;
  /** Ikona uvnitř žlutého čtverce (např. `<CodeIcon />`). */
  icon?: ReactNode;
  /** Úroveň 1–4 (viz SkillLevelBar). */
  level?: number;
  /** Vlastní popisky úrovní. */
  levels?: SkillLevelBarProps["levels"];
  /** Nástroje zobrazené jako tagy. */
  tools?: string[];
  /** Kolik nástrojů zobrazit, zbytek se sloučí do „+N“. */
  maxTools?: number;
  /** Pořadí v mřížce pro postupné najíždění. */
  index?: number;
  /** Text „Zobrazit detail“ dole na kartě. */
  detailLabel?: ReactNode;
  /** Celá karta bude odkaz. */
  href?: string;
  /** Celá karta bude tlačítko. */
  onClick?: () => void;
  /** Vlastní CSS třída přidaná ke kořenovému prvku. */
  className?: string;
}

/** Karta dovednosti z homepage – ikona, úroveň, nástroje a postupné zobrazování podle index. */
export function SkillCard({
  title,
  description,
  icon,
  level,
  levels,
  tools = [],
  maxTools = 3,
  index = 0,
  detailLabel = "Zobrazit detail",
  href,
  onClick,
  className,
}: SkillCardProps) {
  const LinkComponent = useLinkComponent();
  const interactive = Boolean(href || onClick);
  const Wrapper: ElementType = href ? (isExternalHref(href) ? "a" : LinkComponent) : "div";
  const extra = tools.length - maxTools;

  return (
    <Reveal index={index} className={cn("cbb-skill-wrap", className)}>
      <Wrapper
        className={cn("cbb-card cbb-skill", interactive && "cbb-card--interactive")}
        {...(href ? { href } : {})}
        {...(!href && onClick ? { onClick, role: "button", tabIndex: 0 } : {})}
        {...(!href && onClick
          ? {
              onKeyDown: (e: KeyboardEvent) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onClick();
                }
              },
            }
          : {})}
      >
        <span className="cbb-skill__glow" aria-hidden="true" />
        <div className="cbb-skill__inner">
          {icon && <div className="cbb-skill__icon">{icon}</div>}
          <h3 className="cbb-skill__title">{title}</h3>
          {description && <p className="cbb-skill__desc">{description}</p>}
          {level !== undefined && <SkillLevelBar level={level} levels={levels} className="cbb-skill__level" />}
          {tools.length > 0 && (
            <div className="cbb-skill__tools">
              {tools.slice(0, maxTools).map((tool) => (
                <Tag key={tool} interactive>
                  {tool}
                </Tag>
              ))}
              {extra > 0 && <Tag>+{extra}</Tag>}
            </div>
          )}
          {interactive && (
            <div className="cbb-skill__more">
              <span>{detailLabel}</span>
              <ChevronRightIcon size={16} />
            </div>
          )}
        </div>
      </Wrapper>
    </Reveal>
  );
}
