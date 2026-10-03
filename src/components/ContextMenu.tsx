import { useEffect, useRef, useState, type ReactNode } from "react";
import { Floating, useClickOutside } from "../lib/floating";
import { MenuList, type MenuItem } from "./Menu";
import { cn } from "../lib/cn";

export interface ContextMenuProps {
  items: MenuItem[];
  children: ReactNode;
  disabled?: boolean;
  className?: string;
}

/** Menu na pravé tlačítko myši (na dotyku dlouhý stisk). */
export function ContextMenu({ items, children, disabled, className }: ContextMenuProps) {
  const area = useRef<HTMLDivElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const press = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const [point, setPoint] = useState<{ x: number; y: number } | null>(null);

  useClickOutside([panel], () => setPoint(null), point !== null);
  useEffect(() => () => clearTimeout(press.current), []);
  useEffect(() => {
    if (!point) return;
    const close = () => setPoint(null);
    window.addEventListener("resize", close);
    window.addEventListener("blur", close);
    return () => {
      window.removeEventListener("resize", close);
      window.removeEventListener("blur", close);
    };
  }, [point]);

  return (
    <>
      <div
        ref={area}
        className={cn("cbb-contextarea", className)}
        onContextMenu={(e) => {
          if (disabled) return;
          e.preventDefault();
          setPoint({ x: e.clientX, y: e.clientY });
        }}
        onTouchStart={(e) => {
          if (disabled) return;
          const t = e.touches[0];
          press.current = setTimeout(() => setPoint({ x: t.clientX, y: t.clientY }), 500);
        }}
        onTouchEnd={() => clearTimeout(press.current)}
        onTouchMove={() => clearTimeout(press.current)}
      >
        {children}
      </div>
      <Floating anchorRef={area} panelRef={panel} open={point !== null} point={point} side="bottom" align="start" offset={2}>
        <MenuList items={items} onClose={() => setPoint(null)} />
      </Floating>
    </>
  );
}
