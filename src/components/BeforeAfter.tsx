import { useState, type ReactNode } from "react";
import { cn } from "../lib/cn";
import { ArrowLeftRightIcon } from "./Icons";

export interface BeforeAfterProps {
  /** Obsah vlevo od lišty (stav „před“) – obrázek, graf, cokoli. Obrázky se roztáhnou na celou plochu. */
  before: ReactNode;
  /** Obsah vpravo od lišty (stav „po“). */
  after: ReactNode;
  /** Počáteční poloha lišty v % (0–100), neřízené použití. */
  initial?: number;
  /** Řízená poloha lišty v %. */
  value?: number;
  /** Zavolá se při posunu lišty, dostane polohu v %. */
  onChange?: (value: number) => void;
  /** Popisek levé strany. */
  beforeLabel?: ReactNode;
  /** Popisek pravé strany. */
  afterLabel?: ReactNode;
  /** Skryje oba popisky. */
  hideLabels?: boolean;
  /** Výška (číslo = px). Šířku určuje rodič. */
  height?: number | string;
  /** Přístupný název posuvníku pro čtečky obrazovky. */
  "aria-label"?: string;
  /** Vlastní CSS třída přidaná ke kořenovému prvku. */
  className?: string;
}

/** Srovnání dvou stavů s přetahovací svislou lištou (myš, dotyk i šipky na klávesnici). */
export function BeforeAfter({
  before,
  after,
  initial = 50,
  value,
  onChange,
  beforeLabel = "PŘED",
  afterLabel = "PO",
  hideLabels,
  height = 280,
  "aria-label": ariaLabel = "Poměr srovnání",
  className,
}: BeforeAfterProps) {
  const [inner, setInner] = useState(initial);
  const p = Math.min(100, Math.max(0, value ?? inner));
  const set = (n: number) => {
    setInner(n);
    onChange?.(n);
  };
  return (
    <div className={cn("cbb-compare", className)} style={{ height }}>
      <div className="cbb-compare__layer">
        <div className="cbb-compare__content">{after}</div>
        {!hideLabels && <span className="cbb-compare__tag is-right">{afterLabel}</span>}
      </div>
      <div className="cbb-compare__layer" style={{ clipPath: `inset(0 ${100 - p}% 0 0)` }}>
        <div className="cbb-compare__content">{before}</div>
        {!hideLabels && <span className="cbb-compare__tag">{beforeLabel}</span>}
      </div>
      <div className="cbb-compare__handle" style={{ left: `${p}%` }} aria-hidden="true">
        <span className="cbb-compare__knob">
          <ArrowLeftRightIcon size={16} />
        </span>
      </div>
      <input
        type="range"
        min={0}
        max={100}
        step={1}
        value={p}
        onChange={(e) => set(Number(e.target.value))}
        aria-label={ariaLabel}
        aria-valuetext={`${Math.round(p)} %`}
      />
    </div>
  );
}
