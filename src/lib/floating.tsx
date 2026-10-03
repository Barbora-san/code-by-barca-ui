import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type ReactNode,
  type RefObject,
} from "react";
import { createPortal } from "react-dom";
import { cn } from "./cn";

export type Side = "top" | "bottom" | "left" | "right";
export type Align = "start" | "center" | "end";

export interface FloatingProps extends Omit<HTMLAttributes<HTMLDivElement>, "style"> {
  /** Prvek, ke kterému se plovoucí panel přichytí. */
  anchorRef: RefObject<HTMLElement | null>;
  open: boolean;
  side?: Side;
  align?: Align;
  /** Vzdálenost od kotvy v px. */
  offset?: number;
  /** Panel bude stejně široký jako kotva (dropdowny, autocomplete). */
  matchWidth?: boolean;
  /** Pozice kurzoru (kontextové menu) – má přednost před `anchorRef`. */
  point?: { x: number; y: number } | null;
  panelRef?: RefObject<HTMLDivElement | null>;
  children: ReactNode;
}

const MARGIN = 8;

/**
 * Plovoucí panel vykreslený do `document.body` (portál) s `position: fixed`.
 * Sám se otočí na druhou stranu, když se nevejde, a drží se uvnitř okna.
 * Základ pro Tooltip, Popover, HoverCard, Dropdown, ContextMenu, Menubar a Autocomplete.
 */
export function Floating({
  anchorRef,
  open,
  side = "bottom",
  align = "start",
  offset = 8,
  matchWidth,
  point,
  panelRef,
  className,
  children,
  ...rest
}: FloatingProps) {
  const innerRef = useRef<HTMLDivElement | null>(null);
  const ref = panelRef ?? innerRef;
  const [pos, setPos] = useState<{ top: number; left: number; side: Side; width?: number } | null>(null);

  const place = useCallback(() => {
    const panel = ref.current;
    if (!panel) return;
    let rect: { top: number; left: number; right: number; bottom: number; width: number; height: number };
    if (point) {
      rect = { top: point.y, left: point.x, right: point.x, bottom: point.y, width: 0, height: 0 };
    } else if (anchorRef.current) {
      rect = anchorRef.current.getBoundingClientRect();
    } else return;

    const pw = panel.offsetWidth;
    const ph = panel.offsetHeight;
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    let s: Side = side;
    if (s === "bottom" && rect.bottom + offset + ph > vh - MARGIN && rect.top - offset - ph >= MARGIN) s = "top";
    else if (s === "top" && rect.top - offset - ph < MARGIN && rect.bottom + offset + ph <= vh - MARGIN) s = "bottom";
    else if (s === "right" && rect.right + offset + pw > vw - MARGIN && rect.left - offset - pw >= MARGIN) s = "left";
    else if (s === "left" && rect.left - offset - pw < MARGIN && rect.right + offset + pw <= vw - MARGIN) s = "right";

    let top = 0;
    let left = 0;
    if (s === "top" || s === "bottom") {
      top = s === "bottom" ? rect.bottom + offset : rect.top - offset - ph;
      left = align === "start" ? rect.left : align === "end" ? rect.right - pw : rect.left + rect.width / 2 - pw / 2;
    } else {
      left = s === "right" ? rect.right + offset : rect.left - offset - pw;
      top = align === "start" ? rect.top : align === "end" ? rect.bottom - ph : rect.top + rect.height / 2 - ph / 2;
    }
    left = Math.max(MARGIN, Math.min(left, vw - pw - MARGIN));
    top = Math.max(MARGIN, Math.min(top, vh - ph - MARGIN));
    setPos({ top, left, side: s, width: matchWidth ? rect.width : undefined });
  }, [anchorRef, align, matchWidth, offset, point, ref, side]);

  useLayoutEffect(() => {
    if (!open) {
      setPos(null);
      return;
    }
    place();
  }, [open, place, children]);

  useEffect(() => {
    if (!open) return;
    const onMove = () => place();
    window.addEventListener("scroll", onMove, true);
    window.addEventListener("resize", onMove);
    return () => {
      window.removeEventListener("scroll", onMove, true);
      window.removeEventListener("resize", onMove);
    };
  }, [open, place]);

  if (!open || typeof document === "undefined") return null;

  const style: CSSProperties = pos
    ? { top: pos.top, left: pos.left, width: pos.width }
    : { top: 0, left: 0, visibility: "hidden" };

  return createPortal(
    <div
      ref={ref}
      className={cn("cbb-floating", pos && `cbb-floating--${pos.side}`, className)}
      style={style}
      {...rest}
    >
      {children}
    </div>,
    document.body
  );
}

/** Zavolá `handler`, když uživatel klikne mimo všechny zadané prvky. */
export function useClickOutside(
  refs: RefObject<HTMLElement | null>[],
  handler: () => void,
  active: boolean
) {
  const handlerRef = useRef(handler);
  handlerRef.current = handler;
  useEffect(() => {
    if (!active) return;
    const onDown = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Node;
      if (refs.some((r) => r.current?.contains(target))) return;
      handlerRef.current();
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("touchstart", onDown);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("touchstart", onDown);
    };
    // refs jsou stabilní objekty
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);
}

/** Řízený i neřízený stav v jednom (`value` vs. `defaultValue`). */
export function useControllable<T>(
  value: T | undefined,
  defaultValue: T,
  onChange?: (v: T) => void
): [T, (v: T) => void] {
  const [inner, setInner] = useState(defaultValue);
  const controlled = value !== undefined;
  const current = controlled ? (value as T) : inner;
  const set = useCallback(
    (v: T) => {
      if (!controlled) setInner(v);
      onChange?.(v);
    },
    [controlled, onChange]
  );
  return [current, set];
}
