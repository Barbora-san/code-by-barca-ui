import { useEffect, useRef, useState, type ReactNode } from "react";
import { Floating, useClickOutside, type Align, type Side } from "../lib/floating";
import { MenuList, type MenuItem } from "./Menu";

export interface DropdownProps {
  /** Prvek, který menu otevírá. */
  trigger: ReactNode;
  /** Položky menu. */
  items: MenuItem[];
  /** Strana menu. */
  side?: Side;
  /** Zarovnání menu. */
  align?: Align;
  /** Vlastní CSS třída přidaná ke kořenovému prvku. */
  className?: string;
}

/** Menu s akcemi otevřené kliknutím na trigger. Ovládá se šipkami, Enter vybírá, Escape zavírá. */
export function Dropdown({ trigger, items, side = "bottom", align = "start", className }: DropdownProps) {
  const anchor = useRef<HTMLSpanElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  useClickOutside([anchor, panel], () => setOpen(false), open);
  const close = () => {
    setOpen(false);
    anchor.current?.querySelector<HTMLElement>("button, a, [tabindex]")?.focus();
  };

  useEffect(() => {
    if (!open) return;
    const onScroll = () => setOpen(false);
    window.addEventListener("resize", onScroll);
    return () => window.removeEventListener("resize", onScroll);
  }, [open]);

  return (
    <>
      <span
        ref={anchor}
        className="cbb-anchor"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown" && !open) {
            e.preventDefault();
            setOpen(true);
          }
        }}
      >
        {trigger}
      </span>
      <Floating anchorRef={anchor} panelRef={panel} open={open} side={side} align={align} offset={6} className={className}>
        <MenuList items={items} onClose={close} />
      </Floating>
    </>
  );
}
