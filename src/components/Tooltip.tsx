import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { Floating, type Align, type Side } from "../lib/floating";
import { cn } from "../lib/cn";

export interface TooltipProps {
  /** Text nebo prvek v bublině. */
  content: ReactNode;
  /** Prvek, ke kterému bublina patří. */
  children: ReactNode;
  /** Strana bubliny. */
  side?: Side;
  /** Zarovnání bubliny. */
  align?: Align;
  /** Zpoždění zobrazení v ms. */
  delay?: number;
  /** Bublinu nezobrazuje. */
  disabled?: boolean;
  /** Vlastní CSS třída přidaná ke kořenovému prvku. */
  className?: string;
}

/** Krátký popisek při najetí myší / focusu klávesnicí. */
export function Tooltip({ content, children, side = "top", align = "center", delay = 150, disabled, className }: TooltipProps) {
  const id = useId();
  const anchor = useRef<HTMLSpanElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const [open, setOpen] = useState(false);

  useEffect(() => () => clearTimeout(timer.current), []);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const show = () => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setOpen(true), delay);
  };
  const hide = () => {
    clearTimeout(timer.current);
    setOpen(false);
  };

  return (
    <>
      <span
        ref={anchor}
        className={cn("cbb-anchor", className)}
        aria-describedby={open ? id : undefined}
        onMouseEnter={disabled ? undefined : show}
        onMouseLeave={hide}
        onFocus={disabled ? undefined : show}
        onBlur={hide}
      >
        {children}
      </span>
      <Floating anchorRef={anchor} open={open && !disabled} side={side} align={align} offset={8} id={id} role="tooltip" className="cbb-tooltip">
        {content}
      </Floating>
    </>
  );
}
