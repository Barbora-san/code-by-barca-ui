import { useRef, useState, type KeyboardEvent, type PointerEvent, type ReactNode } from "react";
import { cn } from "../lib/cn";

export interface ResizableProps {
  firstPanel: ReactNode;
  secondPanel: ReactNode;
  direction?: "horizontal" | "vertical";
  /** Počáteční velikost prvního panelu v %. */
  defaultSize?: number;
  minSize?: number;
  maxSize?: number;
  className?: string;
}

/** Dva panely s tahacím oddělovačem (myš, dotyk i šipky na klávesnici). */
export function Resizable({ firstPanel, secondPanel, direction = "horizontal", defaultSize = 50, minSize = 15, maxSize = 85, className }: ResizableProps) {
  const [size, setSize] = useState(defaultSize);
  const box = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const horizontal = direction === "horizontal";
  const clamp = (v: number) => Math.max(minSize, Math.min(maxSize, v));

  const move = (e: PointerEvent) => {
    if (!dragging.current || !box.current) return;
    const r = box.current.getBoundingClientRect();
    const pct = horizontal ? ((e.clientX - r.left) / r.width) * 100 : ((e.clientY - r.top) / r.height) * 100;
    setSize(clamp(pct));
  };

  const onKey = (e: KeyboardEvent) => {
    const step = e.shiftKey ? 10 : 2;
    const dec = horizontal ? "ArrowLeft" : "ArrowUp";
    const inc = horizontal ? "ArrowRight" : "ArrowDown";
    if (e.key === dec) (e.preventDefault(), setSize((s) => clamp(s - step)));
    else if (e.key === inc) (e.preventDefault(), setSize((s) => clamp(s + step)));
    else if (e.key === "Home") (e.preventDefault(), setSize(minSize));
    else if (e.key === "End") (e.preventDefault(), setSize(maxSize));
  };

  return (
    <div ref={box} className={cn("cbb-resizable", `cbb-resizable--${direction}`, className)}>
      <div className="cbb-resizable__panel" style={{ flexBasis: `${size}%` }}>
        {firstPanel}
      </div>
      <div
        role="separator"
        tabIndex={0}
        aria-orientation={horizontal ? "vertical" : "horizontal"}
        aria-valuenow={Math.round(size)}
        aria-valuemin={minSize}
        aria-valuemax={maxSize}
        className="cbb-resizable__handle"
        onPointerDown={(e) => {
          dragging.current = true;
          e.currentTarget.setPointerCapture(e.pointerId);
        }}
        onPointerMove={move}
        onPointerUp={(e) => {
          dragging.current = false;
          e.currentTarget.releasePointerCapture(e.pointerId);
        }}
        onKeyDown={onKey}
      >
        <span />
      </div>
      <div className="cbb-resizable__panel cbb-resizable__panel--grow">{secondPanel}</div>
    </div>
  );
}
