import { useEffect, useRef, useState, type ReactNode } from "react";
import { Floating, type Align, type Side } from "../lib/floating";
import { cn } from "../lib/cn";

export interface HoverCardProps {
  /** Prvek, na který se najíždí. */
  trigger: ReactNode;
  /** Obsah karty. */
  children: ReactNode;
  /** Strana karty. */
  side?: Side;
  /** Zarovnání karty. */
  align?: Align;
  /** Zpoždění otevření (ms). */
  openDelay?: number;
  /** Zpoždění zavření (ms). */
  closeDelay?: number;
  /** Vlastní CSS třída přidaná ke kořenovému prvku. */
  className?: string;
}

/** Bohatší karta, která se objeví při najetí (náhled profilu, odkazu…) a zůstane, dokud na ní držíš myš. */
export function HoverCard({ trigger, children, side = "bottom", align = "center", openDelay = 200, closeDelay = 150, className }: HoverCardProps) {
  const anchor = useRef<HTMLSpanElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const [open, setOpen] = useState(false);
  useEffect(() => () => clearTimeout(timer.current), []);

  const enter = () => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setOpen(true), openDelay);
  };
  const leave = () => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setOpen(false), closeDelay);
  };

  return (
    <>
      <span ref={anchor} className="cbb-anchor" onMouseEnter={enter} onMouseLeave={leave} onFocus={enter} onBlur={leave}>
        {trigger}
      </span>
      <Floating anchorRef={anchor} open={open} side={side} align={align} className={cn("cbb-popover cbb-hovercard", className)} onMouseEnter={enter} onMouseLeave={leave}>
        {children}
      </Floating>
    </>
  );
}
