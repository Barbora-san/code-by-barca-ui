import { useRef, useState, type KeyboardEvent } from "react";
import { Floating, useClickOutside } from "../lib/floating";
import { MenuList, type MenuItem } from "./Menu";
import { cn } from "../lib/cn";

export interface MenubarMenu {
  /** Název nabídky (Soubor, Úpravy…). */
  label: string;
  /** Položky nabídky. */
  items: MenuItem[];
}

export interface MenubarProps {
  /** Nabídky v liště. */
  menus: MenubarMenu[];
  /** Vlastní CSS třída přidaná ke kořenovému prvku. */
  className?: string;
}

/** Vodorovná lišta menu jako v desktopové aplikaci (Soubor / Úpravy / Zobrazení). */
export function Menubar({ menus, className }: MenubarProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const bar = useRef<HTMLDivElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const triggers = useRef<(HTMLButtonElement | null)[]>([]);
  const anchor = useRef<HTMLElement | null>(null);

  useClickOutside([bar, panel], () => setOpenIndex(null), openIndex !== null);

  const openAt = (i: number) => {
    anchor.current = triggers.current[i];
    setOpenIndex(i);
  };

  const onKey = (i: number) => (e: KeyboardEvent) => {
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      e.preventDefault();
      const n = (i + (e.key === "ArrowRight" ? 1 : -1) + menus.length) % menus.length;
      triggers.current[n]?.focus();
      if (openIndex !== null) openAt(n);
    } else if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openAt(i);
    }
  };

  const current = openIndex !== null ? menus[openIndex] : null;

  return (
    <>
      <div ref={bar} role="menubar" className={cn("cbb-menubar", className)}>
        {menus.map((m, i) => (
          <button
            key={m.label}
            ref={(el) => {
              triggers.current[i] = el;
            }}
            type="button"
            role="menuitem"
            aria-haspopup="menu"
            aria-expanded={openIndex === i}
            className={cn("cbb-menubar__trigger", openIndex === i && "is-open")}
            onClick={() => (openIndex === i ? setOpenIndex(null) : openAt(i))}
            onMouseEnter={() => openIndex !== null && openAt(i)}
            onKeyDown={onKey(i)}
          >
            {m.label}
          </button>
        ))}
      </div>
      <Floating anchorRef={anchor} panelRef={panel} open={current !== null} side="bottom" align="start" offset={4}>
        {current && (
          <MenuList
            key={openIndex}
            items={current.items}
            onClose={() => {
              const i = openIndex;
              setOpenIndex(null);
              if (i !== null) triggers.current[i]?.focus();
            }}
          />
        )}
      </Floating>
    </>
  );
}
