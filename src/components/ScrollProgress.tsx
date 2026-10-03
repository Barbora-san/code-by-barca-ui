import { useEffect, useState } from "react";
import { cn } from "../lib/cn";

export interface ScrollProgressProps {
  position?: "top" | "bottom";
  /** Výška lišty v px. */
  height?: number;
  className?: string;
}

/** Tenká lišta u okraje okna, která ukazuje, kolik stránky už je odscrollováno. */
export function ScrollProgress({ position = "top", height = 3, className }: ScrollProgressProps) {
  const [pct, setPct] = useState(0);
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const el = document.documentElement;
      const max = el.scrollHeight - el.clientHeight;
      setPct(max > 0 ? Math.min(100, (el.scrollTop / max) * 100) : 0);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);
  return (
    <div
      className={cn("cbb-scrollprogress", `cbb-scrollprogress--${position}`, className)}
      style={{ height }}
      role="progressbar"
      aria-label="Průběh scrollování"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(pct)}
    >
      <div style={{ width: `${pct}%` }} />
    </div>
  );
}
