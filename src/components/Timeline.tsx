import type { ReactNode } from "react";
import { cn } from "../lib/cn";
import { Reveal } from "./Reveal";

export interface TimelineEntry {
  period?: ReactNode;
  title: ReactNode;
  subtitle?: ReactNode;
  description?: ReactNode;
}

/** Časová osa zkušeností (svislá linka + tečky + karty). */
export function Timeline({ entries, className }: { entries: TimelineEntry[]; className?: string }) {
  return (
    <div className={cn("cbb-timeline", className)}>
      <div className="cbb-timeline__rail" aria-hidden="true" />
      <ol className="cbb-timeline__list">
        {entries.map((e, i) => (
          <Reveal as="li" key={i} index={i} className="cbb-timeline__item">
            <span className="cbb-timeline__dot" aria-hidden="true" />
            <div className="cbb-card cbb-card--raised cbb-timeline__card">
              {e.period && <p className="cbb-timeline__period">{e.period}</p>}
              <h3 className="cbb-timeline__title">{e.title}</h3>
              {e.subtitle && <p className="cbb-timeline__sub">{e.subtitle}</p>}
              {e.description && <p className="cbb-timeline__desc">{e.description}</p>}
            </div>
          </Reveal>
        ))}
      </ol>
    </div>
  );
}
