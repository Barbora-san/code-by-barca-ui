import type { ElementType, ReactNode } from "react";
import { cn } from "../lib/cn";
import { ArrowDownIcon, SparklesIcon } from "./Icons";
import { isExternalHref, useLinkComponent } from "../lib/link";

export interface HeroProps {
  /** Pill s ikonou jiskry nad nadpisem (např. „Otevřena novým nápadům“). */
  badge?: ReactNode;
  /** Hlavní nadpis – bílý. */
  title: ReactNode;
  /** Druhá část nadpisu – šedá, za žlutou tečkou. */
  titleMuted?: ReactNode;
  /** Řádek pod nadpisem – typicky `<Typewriter />` nebo krátká věta. */
  tagline?: ReactNode;
  description?: ReactNode;
  /** Tlačítka (CTA). */
  actions?: ReactNode;
  /** Odkaz „Scroll“ dole (kotva nebo URL). */
  scrollHref?: string;
  scrollLabel?: ReactNode;
  /** Plná výška obrazovky (výchozí true). */
  fullscreen?: boolean;
  className?: string;
  children?: ReactNode;
}

export function Hero({
  badge,
  title,
  titleMuted,
  tagline,
  description,
  actions,
  scrollHref,
  scrollLabel = "Scroll",
  fullscreen = true,
  className,
  children,
}: HeroProps) {
  const LinkComponent = useLinkComponent();
  const ScrollTag: ElementType = scrollHref && !isExternalHref(scrollHref) && !scrollHref.startsWith("#") ? LinkComponent : "a";

  return (
    <header className={cn("cbb-hero", fullscreen && "cbb-hero--full", className)}>
      <div className="cbb-hero__decor" aria-hidden="true">
        <div className="cbb-hero__line cbb-hero__line--h1" />
        <div className="cbb-hero__line cbb-hero__line--h2" />
        <div className="cbb-hero__line cbb-hero__line--v1" />
        <div className="cbb-hero__line cbb-hero__line--v2" />
        <div className="cbb-hero__glow cbb-hero__glow--1" />
        <div className="cbb-hero__glow cbb-hero__glow--2" />
        <div className="cbb-hero__corner cbb-hero__corner--tl" />
        <div className="cbb-hero__corner cbb-hero__corner--br" />
      </div>

      <div className="cbb-hero__content">
        {badge && (
          <div className="cbb-hero__badge cbb-fade-in">
            <SparklesIcon size={16} />
            <span>{badge}</span>
          </div>
        )}
        <h1 className="cbb-hero__title">
          {title}
          <span className="cbb-accent">.</span>
          {titleMuted && (
            <>
              {" "}
              <span className="cbb-hero__title-muted">{titleMuted}</span>
            </>
          )}
        </h1>
        {tagline && <div className="cbb-hero__tagline">{tagline}</div>}
        {description && <p className="cbb-hero__desc">{description}</p>}
        {actions && <div className="cbb-hero__actions">{actions}</div>}
        {children}
        {scrollHref && (
          <div className="cbb-hero__scroll">
            <ScrollTag href={scrollHref}>
              <span>{scrollLabel}</span>
              <ArrowDownIcon size={20} className="cbb-bounce" />
            </ScrollTag>
          </div>
        )}
      </div>
    </header>
  );
}
