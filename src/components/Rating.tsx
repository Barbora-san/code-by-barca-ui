import { useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { cn } from "../lib/cn";
import { useControllable } from "../lib/floating";
import { StarIcon } from "./Icons";

export interface RatingProps {
  /** Řízená hodnota (0 = nic nevybráno). */
  value?: number;
  /** Počáteční hodnota (neřízené použití). */
  defaultValue?: number;
  /** Zavolá se po výběru hodnoty. */
  onChange?: (value: number) => void;
  /** Počet hvězdiček. */
  max?: number;
  /** `1` = celé hvězdičky, `0.5` = půlhvězdičky. */
  precision?: 1 | 0.5;
  /** Jen zobrazení – hodnotu nejde měnit (průměr z recenzí). */
  readOnly?: boolean;
  /** Zakáže prvek (nejde ho použít, je ztlumený). */
  disabled?: boolean;
  /** Klik na už vybranou hodnotu ji zruší (0). */
  allowClear?: boolean;
  /** Velikost jedné hvězdičky v px. */
  size?: number;
  /** Přístupný název hodnocení, např. „Hodnocení produktu“. */
  "aria-label"?: string;
  /** Vlastní CSS třída přidaná ke kořenovému prvku. */
  className?: string;
}

/** Hodnocení hvězdičkami – myší, dotykem i šipkami. Podporuje půlhvězdičky a režim jen pro čtení. */
export function Rating({
  value,
  defaultValue = 0,
  onChange,
  max = 5,
  precision = 1,
  readOnly,
  disabled,
  allowClear = true,
  size = 24,
  "aria-label": ariaLabel = "Hodnocení",
  className,
}: RatingProps) {
  const [val, setVal] = useControllable<number>(value, defaultValue, onChange);
  const [hover, setHover] = useState<number | null>(null);
  const row = useRef<HTMLDivElement>(null);
  const interactive = !readOnly && !disabled;
  const shown = hover ?? val;

  const fromPointer = (e: PointerEvent) => {
    const r = row.current?.getBoundingClientRect();
    if (!r || !r.width) return 0;
    const frac = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width)) * max;
    return Math.min(max, Math.max(precision, Math.ceil(frac / precision) * precision));
  };
  const pick = (n: number) => setVal(allowClear && n === val ? 0 : n);
  const onKey = (e: KeyboardEvent) => {
    const step = precision;
    let next: number | null = null;
    if (e.key === "ArrowRight" || e.key === "ArrowUp") next = Math.min(max, val + step);
    else if (e.key === "ArrowLeft" || e.key === "ArrowDown") next = Math.max(0, val - step);
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = max;
    if (next !== null) {
      e.preventDefault();
      setVal(next);
    }
  };

  return (
    <div
      ref={row}
      className={cn("cbb-rating", interactive && "is-interactive", disabled && "is-disabled", className)}
      style={{ "--cbb-rating-size": `${size}px` } as React.CSSProperties}
      role={interactive ? "slider" : "img"}
      aria-label={interactive ? ariaLabel : `${ariaLabel}: ${val} z ${max}`}
      aria-valuemin={interactive ? 0 : undefined}
      aria-valuemax={interactive ? max : undefined}
      aria-valuenow={interactive ? val : undefined}
      aria-valuetext={interactive ? `${val} z ${max}` : undefined}
      aria-disabled={disabled || undefined}
      tabIndex={interactive ? 0 : undefined}
      onKeyDown={interactive ? onKey : undefined}
      onPointerMove={interactive ? (e) => e.pointerType !== "touch" && setHover(fromPointer(e)) : undefined}
      onPointerLeave={interactive ? () => setHover(null) : undefined}
      onClick={interactive ? (e) => pick(fromPointer(e as unknown as PointerEvent)) : undefined}
    >
      {Array.from({ length: max }, (_, i) => {
        const fill = Math.min(1, Math.max(0, shown - i));
        return (
          <span key={i} className="cbb-rating__star">
            <StarIcon size={size} className="cbb-rating__bg" />
            <span className="cbb-rating__fill" style={{ width: `${fill * 100}%` }}>
              <StarIcon size={size} />
            </span>
          </span>
        );
      })}
    </div>
  );
}
