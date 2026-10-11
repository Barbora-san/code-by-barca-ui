import { useRef, useState } from "react";
import { cn } from "../lib/cn";
import { Floating, useClickOutside } from "../lib/floating";
import { Calendar, type DateRange } from "./Calendar";
import { Button } from "./Button";

export interface DateRangePickerProps {
  /** Vybraný rozsah `{ from, to }`. */
  value?: DateRange;
  /** Dostane nový rozsah (po prvním kliku `to` je `null`). */
  onChange: (range: DateRange) => void;
  /** Locale pro formátování (výchozí `cs-CZ`). */
  locale?: string;
  /** Text v prázdném poli. */
  placeholder?: string;
  /** Oddělovač mezi daty v poli (výchozí „ – “). */
  separator?: string;
  /** Text tlačítka pro smazání výběru. */
  clearLabel?: string;
  /** Text tlačítka pro potvrzení. */
  applyLabel?: string;
  /** Dny před tímto datem nejdou vybrat. */
  min?: Date;
  /** Dny po tomto datu nejdou vybrat. */
  max?: Date;
  /** Zakáže výběr. */
  disabled?: boolean;
  /** Vlastní CSS třída přidaná ke kořenovému prvku. */
  className?: string;
  /** Atribut `id` prvku (pro propojení s `<label htmlFor>`). */
  id?: string;
}

/** Výběr rozsahu „od – do“ přes kalendář s vyznačeným pásem mezi dny. */
export function DateRangePicker({
  value = { from: null, to: null },
  onChange,
  locale = "cs-CZ",
  placeholder = "Vyber rozsah",
  separator = " – ",
  clearLabel = "Zrušit",
  applyLabel = "Použít",
  min,
  max,
  disabled,
  className,
  id,
}: DateRangePickerProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  useClickOutside([rootRef, panelRef], () => setOpen(false), open);

  const fmt = (d: Date) => d.toLocaleDateString(locale, { day: "numeric", month: "numeric", year: "numeric" });
  const display = value.from ? `${fmt(value.from)}${value.to ? `${separator}${fmt(value.to)}` : `${separator}…`}` : "";

  return (
    <div className={cn("cbb-dtp", className)} ref={rootRef}>
      <input
        readOnly
        id={id}
        disabled={disabled}
        value={display}
        placeholder={placeholder}
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => !disabled && setOpen((v) => !v)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
            e.preventDefault();
            if (!disabled) setOpen(true);
          }
          if (e.key === "Escape") setOpen(false);
        }}
        className="cbb-input cbb-dtp__input"
      />
      <Floating anchorRef={rootRef} panelRef={panelRef} open={open} side="bottom" align="start" offset={8} className="cbb-floating--dtp">
        <div className="cbb-dtp__panel cbb-dtp__panel--range" role="dialog" aria-label="Výběr rozsahu dat">
          <Calendar mode="range" months={2} range={value} onRangeChange={onChange} locale={locale} min={min} max={max} className="cbb-cal--bare" />
          <div className="cbb-dtp__footer">
            <Button size="sm" variant="ghost" onClick={() => onChange({ from: null, to: null })}>{clearLabel}</Button>
            <Button size="sm" disabled={!value.from || !value.to} onClick={() => setOpen(false)}>{applyLabel}</Button>
          </div>
        </div>
      </Floating>
    </div>
  );
}
