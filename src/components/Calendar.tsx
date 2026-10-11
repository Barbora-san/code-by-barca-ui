import { useState } from "react";
import { cn } from "../lib/cn";
import { ChevronLeftIcon, ChevronRightIcon } from "./Icons";

export interface DateRange {
  /** Začátek rozsahu (nebo `null`). */
  from: Date | null;
  /** Konec rozsahu (nebo `null`). */
  to: Date | null;
}

export interface CalendarProps {
  /** `single` = jedno datum (výchozí), `range` = výběr od–do s vyznačeným pásem mezi dny. */
  mode?: "single" | "range";
  /** Vybrané datum (`mode="single"`). */
  selected?: Date | null;
  /** Dostane kliknutý den (`mode="single"`). */
  onSelect?: (date: Date) => void;
  /** Vybraný rozsah (`mode="range"`). */
  range?: DateRange;
  /** První klik nastaví začátek, druhý konec (opačné pořadí se samo prohodí). */
  onRangeChange?: (range: DateRange) => void;
  /** Kolik měsíců vedle sebe (na úzkém displeji se druhý schová). */
  months?: 1 | 2;
  /** Locale pro názvy měsíců (výchozí `cs-CZ`). */
  locale?: string;
  /** Zkratky dnů od pondělí. */
  weekdayNames?: string[];
  /** Zakáže výběr dnů před tímto datem. */
  min?: Date;
  /** Zakáže výběr dnů po tomto datu. */
  max?: Date;
  /** Vlastní CSS třída přidaná ke kořenovému prvku. */
  className?: string;
}

const WEEKDAYS = ["Po", "Út", "St", "Čt", "Pá", "So", "Ne"];
const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

/** Měsíční kalendář (týden začíná pondělím). Pro výběr data + času viz `DateTimePicker`. */
export function Calendar({
  mode = "single",
  selected,
  onSelect,
  range,
  onRangeChange,
  months = 1,
  locale = "cs-CZ",
  weekdayNames = WEEKDAYS,
  min,
  max,
  className,
}: CalendarProps) {
  const [view, setView] = useState(() => {
    const d = (mode === "range" ? range?.from : selected) ?? new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });
  const [hover, setHover] = useState<number | null>(null);

  const today = startOfDay(new Date()).getTime();
  const sel = selected ? startOfDay(selected).getTime() : null;
  const from = range?.from ? startOfDay(range.from).getTime() : null;
  const to = range?.to ? startOfDay(range.to).getTime() : null;
  const lo = min ? startOfDay(min).getTime() : null;
  const hi = max ? startOfDay(max).getTime() : null;
  const shift = (n: number) => setView((v) => new Date(v.getFullYear(), v.getMonth() + n, 1));

  // během výběru konce ukazuje pás i na dny pod kurzorem
  const previewTo = from !== null && to === null && hover !== null && hover >= from ? hover : to;

  const pick = (d: Date) => {
    if (mode === "single") return onSelect?.(d);
    const t = d.getTime();
    if (from === null || to !== null) onRangeChange?.({ from: d, to: null });
    else if (t < from) onRangeChange?.({ from: d, to: null });
    else onRangeChange?.({ from: range!.from, to: d });
  };

  const renderMonth = (offset: number) => {
    const m = new Date(view.getFullYear(), view.getMonth() + offset, 1);
    const first = m.getDay() === 0 ? 6 : m.getDay() - 1;
    const days = new Date(m.getFullYear(), m.getMonth() + 1, 0).getDate();
    const cells: (Date | null)[] = [
      ...Array.from({ length: first }, () => null),
      ...Array.from({ length: days }, (_, i) => new Date(m.getFullYear(), m.getMonth(), i + 1)),
    ];
    return (
      <div key={offset} className={cn("cbb-cal__month", offset > 0 && "cbb-cal__month--second")}>
        <div className="cbb-cal__title" aria-live="polite">
          {m.toLocaleDateString(locale, { month: "long", year: "numeric" })}
        </div>
        <div className="cbb-cal__weekdays">
          {weekdayNames.map((d) => (
            <span key={d}>{d}</span>
          ))}
        </div>
        <div className="cbb-cal__grid" onMouseLeave={() => setHover(null)}>
          {cells.map((d, i) => {
            if (!d) return <span key={`e${i}`} />;
            const t = d.getTime();
            const disabled = (lo !== null && t < lo) || (hi !== null && t > hi);
            const isStart = mode === "range" && from === t;
            const isEnd = mode === "range" && previewTo === t && from !== null;
            const inRange = mode === "range" && from !== null && previewTo !== null && t > from && t < previewTo;
            const selectedDay = mode === "single" ? sel === t : isStart || (to !== null && isEnd);
            return (
              <span
                key={t}
                className={cn(
                  "cbb-cal__cell",
                  inRange && "is-in-range",
                  isStart && previewTo !== null && previewTo !== from && "is-band-start",
                  isEnd && previewTo !== from && "is-band-end"
                )}
              >
                <button
                  type="button"
                  disabled={disabled}
                  aria-pressed={selectedDay}
                  onClick={() => pick(d)}
                  onMouseEnter={() => setHover(t)}
                  onFocus={() => setHover(t)}
                  className={cn(
                    "cbb-cal__day",
                    selectedDay && "is-selected",
                    mode === "range" && isEnd && to === null && "is-preview-end",
                    today === t && !selectedDay && "is-today"
                  )}
                >
                  {d.getDate()}
                </button>
              </span>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className={cn("cbb-cal", months === 2 && "cbb-cal--two", className)}>
      <button type="button" className="cbb-cal__nav cbb-cal__nav--prev" onClick={() => shift(-1)} aria-label="Předchozí měsíc">
        <ChevronLeftIcon size={16} />
      </button>
      <button type="button" className="cbb-cal__nav cbb-cal__nav--next" onClick={() => shift(1)} aria-label="Další měsíc">
        <ChevronRightIcon size={16} />
      </button>
      <div className="cbb-cal__months">{Array.from({ length: months }, (_, i) => renderMonth(i))}</div>
    </div>
  );
}
