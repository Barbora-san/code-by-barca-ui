import { useEffect, useId, useRef, type ReactNode } from "react";
import { Floating, useClickOutside, useControllable, type Align, type Side } from "../lib/floating";
import { cn } from "../lib/cn";

export interface PopoverProps {
  /** Prvek, na který se klikne (tlačítko…). */
  trigger: ReactNode;
  children: ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  side?: Side;
  align?: Align;
  className?: string;
  /** Třída obalu kolem triggeru. */
  anchorClassName?: string;
}

/** Plovoucí panel s libovolným obsahem, otevírá se kliknutím. Zavře klik mimo nebo Escape. */
export function Popover({ trigger, children, open: openProp, defaultOpen = false, onOpenChange, side = "bottom", align = "start", className, anchorClassName }: PopoverProps) {
  const id = useId();
  const anchor = useRef<HTMLSpanElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useControllable(openProp, defaultOpen, onOpenChange);

  useClickOutside([anchor, panel], () => setOpen(false), open);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, setOpen]);

  return (
    <>
      <span ref={anchor} className={cn("cbb-anchor", anchorClassName)} aria-haspopup="dialog" aria-expanded={open} aria-controls={open ? id : undefined} onClick={() => setOpen(!open)}>
        {trigger}
      </span>
      <Floating anchorRef={anchor} panelRef={panel} open={open} side={side} align={align} id={id} role="dialog" className={cn("cbb-popover", className)}>
        {children}
      </Floating>
    </>
  );
}
