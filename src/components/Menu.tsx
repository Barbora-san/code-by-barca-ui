import { useEffect, useRef, type KeyboardEvent, type ReactNode } from "react";
import { cn } from "../lib/cn";

export interface MenuItem {
  label: ReactNode;
  icon?: ReactNode;
  /** Klávesová zkratka jen jako text (např. `⌘N`). */
  shortcut?: string;
  onSelect?: () => void;
  variant?: "default" | "destructive";
  disabled?: boolean;
  /** Místo položky vykreslí oddělovač. */
  separator?: boolean;
}

export interface MenuListProps {
  items: MenuItem[];
  /** Zavolá se po výběru položky nebo Escapu / Tabu. */
  onClose: () => void;
  /** Při Escape vrátit focus na trigger. */
  autoFocus?: boolean;
  className?: string;
}

/** Seznam položek s ovládáním šipkami – sdílený základ pro Dropdown, ContextMenu a Menubar. */
export function MenuList({ items, onClose, autoFocus = true, className }: MenuListProps) {
  const ref = useRef<HTMLDivElement>(null);

  const buttons = () => Array.from(ref.current?.querySelectorAll<HTMLButtonElement>('button[role="menuitem"]:not(:disabled)') ?? []);

  useEffect(() => {
    if (autoFocus) buttons()[0]?.focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const list = buttons();
    const i = list.indexOf(document.activeElement as HTMLButtonElement);
    if (e.key === "ArrowDown") {
      e.preventDefault();
      list[(i + 1) % list.length]?.focus();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      list[(i - 1 + list.length) % list.length]?.focus();
    } else if (e.key === "Home") {
      e.preventDefault();
      list[0]?.focus();
    } else if (e.key === "End") {
      e.preventDefault();
      list[list.length - 1]?.focus();
    } else if (e.key === "Escape" || e.key === "Tab") {
      if (e.key === "Escape") e.preventDefault();
      onClose();
    }
  };

  return (
    // eslint-disable-next-line jsx-a11y/interactive-supports-focus
    <div ref={ref} role="menu" className={cn("cbb-menu", className)} onKeyDown={onKeyDown}>
      {items.map((it, i) =>
        it.separator ? (
          <div key={i} role="separator" className="cbb-menu__sep" />
        ) : (
          <button
            key={i}
            type="button"
            role="menuitem"
            disabled={it.disabled}
            className={cn("cbb-menu__item", it.variant === "destructive" && "is-destructive")}
            onClick={() => {
              it.onSelect?.();
              onClose();
            }}
          >
            {it.icon && <span className="cbb-menu__icon">{it.icon}</span>}
            <span className="cbb-menu__label">{it.label}</span>
            {it.shortcut && <kbd className="cbb-kbd">{it.shortcut}</kbd>}
          </button>
        )
      )}
    </div>
  );
}
