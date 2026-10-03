import { useState } from "react";
import { cn } from "../lib/cn";
import { ChevronLeftIcon, ChevronRightIcon } from "./Icons";

export interface CalendarProps {
  selected?: Date | null;
  onSelect?: (date: Date) => void;
  locale?: string;
  /** Zkratky dnů od pondělí. */
  weekdayNames?: string[];
  /** Zakáže výběr dnů před tímto datem. */
  min?: Date;
  /** Zakáže výběr dnů po tomto datu. */
  max?: Date;
  className?: string;
}

const WEEKDAYS = ["Po", "Út", "St", "Čt", "Pá", "So", "Ne"];
const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

/** Měsíční kalendář (týden začíná pondělím). Pro výběr data + času viz `DateTimePicker`. */
export function Calendar({ selected, onSelect, locale = "cs-CZ", weekdayNames = WEEKDAYS, min, max, className }: CalendarProps) {
  const [view, setView] = useState(() => {
    const d = selected ?? new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });

  const first = view.getDay() === 0 ? 6 : view.getDay() - 1;
  const days = new Date(view.getFullYear(), view.getMonth() + 1, 0).getDate();
  const cells: (Date | null)[] = [
    ...Array.from({ length: first }, () => null),
    ...Array.from({ length: days }, (_, i) => new Date(view.getFullYear(), view.getMonth(), i + 1)),
  ];
  const today = startOfDay(new Date()).getTime();
  const sel = selected ? startOfDay(selected).getTime() : null;
  const lo = min ? startOfDay(min).getTime() : null;
  const hi = max ? startOfDay(max).getTime() : null;
  const shift = (n: number) => setView((v) => new Date(v.getFullYear(), v.getMonth() + n, 1));

  return (
    <div className={cn("cbb-cal", className)}>
      <div className="cbb-cal__head">
        <button type="button" onClick={() => shift(-1)} aria-label="Předchozí měsíc">
          <ChevronLeftIcon size={16} />
        </button>
        <span aria-live="polite">{view.toLocaleDateString(locale, { month: "long", year: "numeric" })}</span>
        <button type="button" onClick={() => shift(1)} aria-label="Další měsíc">
          <ChevronRightIcon size={16} />
        </button>
      </div>
      <div className="cbb-cal__weekdays">
        {weekdayNames.map((d) => (
          <span key={d}>{d}</span>
        ))}
      </div>
      <div className="cbb-cal__grid">
        {cells.map((d, i) => {
          if (!d) return <span key={`e${i}`} />;
          const t = d.getTime();
          const disabled = (lo !== null && t < lo) || (hi !== null && t > hi);
          return (
            <button
              key={t}
              type="button"
              disabled={disabled}
              aria-pressed={sel === t}
              onClick={() => onSelect?.(d)}
              className={cn("cbb-cal__day", sel === t && "is-selected", today === t && sel !== t && "is-today")}
            >
              {d.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}
