import { Children, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { cn } from "../lib/cn";

export interface MarqueeItem {
  /** Ikona před textem (nebo samotná ikona, když je zapnuté `iconOnly`). */
  icon?: ReactNode;
  /** Text položky. U `iconOnly` slouží jako přístupný popisek. */
  label?: string;
}

export interface MarqueeProps {
  /** Položky pásu jako data (ikona + text). Alternativa k `children`. */
  items?: MarqueeItem[];
  /** Vlastní položky pásu (cokoli). Použije se, když není zadané `items`. */
  children?: ReactNode;
  /** Vzhled položky: `plain` = jen ikona a text, `pill` = v zaoblené „pilulce“ s rámečkem. */
  variant?: "plain" | "pill";
  /** Zobrazí jen ikony bez textu (text zůstane jako přístupný popisek). */
  iconOnly?: boolean;
  /** Rychlost v pixelech za sekundu – stejná bez ohledu na šířku pásu. */
  speed?: number;
  /** Počet řádků (1–4). Položky se opakují a každý řádek začíná jinde. */
  rows?: number;
  /** Směr pohybu prvního řádku. */
  direction?: "left" | "right";
  /** Další řádky se střídavě pohybují opačným směrem. */
  alternate?: boolean;
  /** Zastaví pás, když na něj uživatel najede myší nebo ho zaostří. */
  pauseOnHover?: boolean;
  /** Mezera mezi položkami (číslo = px). */
  gap?: number;
  /** Vyblednutí okrajů pásu. */
  fade?: boolean;
  /** Vlastní CSS třída přidaná ke kořenovému prvku. */
  className?: string;
}

function Row({
  nodes,
  speed,
  gap,
  reverse,
}: {
  nodes: ReactNode[];
  speed: number;
  gap: number;
  reverse: boolean;
}) {
  const wrap = useRef<HTMLDivElement>(null);
  const group = useRef<HTMLDivElement>(null);
  const [copies, setCopies] = useState(2);
  const [base, setBase] = useState(0);

  useLayoutEffect(() => {
    const w = wrap.current;
    const g = group.current;
    if (!w || !g) return;
    const measure = () => {
      const one = g.scrollWidth / copies;
      if (!one) return;
      setBase(one);
      // jedna polovina smyčky musí být aspoň tak široká jako pás, jinak by vpravo vznikla mezera
      setCopies(Math.max(1, Math.ceil(w.clientWidth / one)));
    };
    measure();
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(measure) : null;
    ro?.observe(w);
    return () => ro?.disconnect();
  }, [copies, nodes.length, gap]);

  const duration = base > 0 ? (base * copies) / Math.max(1, speed) : 20;
  const set = (hidden?: boolean) => (
    <div className="cbb-marquee__group" aria-hidden={hidden || undefined} ref={hidden ? undefined : group}>
      {Array.from({ length: copies }, (_, c) => nodes.map((n, i) => <span key={`${c}-${i}`}>{n}</span>))}
    </div>
  );
  return (
    <div className="cbb-marquee__row" ref={wrap}>
      <div
        className={cn("cbb-marquee__track", reverse && "is-reverse")}
        style={{ animationDuration: `${duration}s`, "--cbb-marquee-gap": `${gap}px` } as CSSProperties}
      >
        {set()}
        {set(true)}
      </div>
    </div>
  );
}

/**
 * Nekonečný běžící pás (jen CSS animace). Šedne do stran, plní celou šířku bez mezer,
 * umí víc řádků, pilulky a režim jen s ikonami. Při `prefers-reduced-motion` zpomalí.
 */
export function Marquee({
  items,
  children,
  variant = "plain",
  iconOnly = false,
  speed = 60,
  rows = 1,
  direction = "left",
  alternate = true,
  pauseOnHover = true,
  gap = 32,
  fade = true,
  className,
}: MarqueeProps) {
  const base: ReactNode[] = items
    ? items.map((it, i) => (
        <span
          key={i}
          className="cbb-marquee__item"
          title={iconOnly ? it.label : undefined}
          aria-label={iconOnly ? it.label : undefined}
        >
          {it.icon}
          {!iconOnly && it.label}
        </span>
      ))
    : Children.toArray(children).map((c, i) => (
        <span key={i} className="cbb-marquee__item">
          {c}
        </span>
      ));
  const count = Math.min(4, Math.max(1, Math.round(rows)));
  const lines = Array.from({ length: count }, (_, r) => {
    if (!base.length) return [];
    const shift = (r * 2) % base.length;
    return [...base.slice(shift), ...base.slice(0, shift)];
  });
  return (
    <div
      className={cn(
        "cbb-marquee",
        variant === "pill" && "is-pill",
        iconOnly && "is-icon-only",
        fade && "has-fade",
        pauseOnHover && "pause-on-hover",
        className,
      )}
    >
      {lines.map((nodes, r) => (
        <Row
          key={r}
          nodes={nodes}
          speed={speed}
          gap={gap}
          reverse={(direction === "right") !== (alternate && r % 2 === 1)}
        />
      ))}
    </div>
  );
}
