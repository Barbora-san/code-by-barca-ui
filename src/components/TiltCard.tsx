import { useRef, useState, type CSSProperties, type HTMLAttributes, type PointerEvent, type ReactNode } from "react";
import { cn } from "../lib/cn";

export interface TiltCardProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Co se hýbe: `card` = celá karta se 3D naklání (vrstvy vystupují dopředu),
   * `layers` = karta zůstane rovná a hýbou se jen jednotlivé vrstvy (`TiltLayer`) jako paralaxa.
   */
  mode?: "card" | "layers";
  /** Maximální náklon ve stupních (na každou stranu). Platí pro `mode="card"`. */
  maxTilt?: number;
  /** Odlesk, který sleduje kurzor. */
  glare?: boolean;
  /** Zvětšení karty při najetí (1 = beze změny). Platí pro `mode="card"`. */
  scale?: number;
  /** Vypne pohyb – karta zůstane rovná. */
  disabled?: boolean;
}

export interface TiltLayerProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Hloubka vrstvy v px. V režimu `card` o tolik vystoupí z karty, v režimu `layers`
   * určuje, jak moc se vrstva posouvá za kurzorem (větší = výraznější paralaxa). Záporná hodnota jde dozadu.
   */
  depth?: number;
  /** Obsah komponenty. */
  children?: ReactNode;
}

const REST = { x: 0, y: 0, gx: 50, gy: 50, px: 0, py: 0, active: false };

/**
 * 3D karta reagující na kurzor. Obsah můžeš rozdělit na vrstvy pomocí `TiltLayer`:
 * buď se naklání celá karta, nebo zůstane rovná a hýbou se jen vrstvy.
 * Na dotykových zařízeních a při `prefers-reduced-motion` zůstává klidná.
 */
export function TiltCard({
  mode = "card",
  maxTilt = 14,
  glare = true,
  scale = 1.03,
  disabled,
  className,
  children,
  style,
  onPointerMove,
  onPointerLeave,
  ...rest
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [t, setT] = useState(REST);
  const whole = mode === "card";

  const move = (e: PointerEvent<HTMLDivElement>) => {
    onPointerMove?.(e);
    if (disabled || e.pointerType === "touch") return;
    if (typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    const r = ref.current?.getBoundingClientRect();
    if (!r || !r.width || !r.height) return;
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    setT({
      x: (0.5 - py) * maxTilt * 2,
      y: (px - 0.5) * maxTilt * 2,
      gx: px * 100,
      gy: py * 100,
      px: (px - 0.5) * 2,
      py: (py - 0.5) * 2,
      active: true,
    });
  };

  const transform = whole
    ? `perspective(900px) rotateX(${t.x}deg) rotateY(${t.y}deg) scale(${t.active ? scale : 1})`
    : undefined;

  return (
    <div
      {...rest}
      ref={ref}
      className={cn("cbb-tilt", whole ? "is-card" : "is-layers", t.active && "is-active", className)}
      onPointerMove={move}
      onPointerLeave={(e) => {
        onPointerLeave?.(e);
        setT(REST);
      }}
      style={{ ...style, transform, "--cbb-px": t.px, "--cbb-py": t.py } as CSSProperties}
    >
      {children}
      {glare && (
        <span
          className="cbb-tilt__glare"
          aria-hidden="true"
          style={{ background: `radial-gradient(circle at ${t.gx}% ${t.gy}%, rgba(255, 255, 255, 0.2), transparent 55%)` }}
        />
      )}
    </div>
  );
}

/** Vrstva uvnitř `TiltCard` – vystupuje z karty, nebo se posouvá jako paralaxa (podle `mode` karty). */
export function TiltLayer({ depth = 40, className, style, children, ...rest }: TiltLayerProps) {
  return (
    <div {...rest} className={cn("cbb-tilt__layer", className)} style={{ ...style, "--cbb-d": depth } as CSSProperties}>
      {children}
    </div>
  );
}
