import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties, type RefObject } from "react";
import { cn } from "../lib/cn";

export interface DateTimePickerProps {
  /** ISO řetězec (např. `2026-09-30T14:30:00.000Z`). Bez hodnoty se použije aktuální čas. */
  value?: string | null;
  /** Dostane ISO řetězec (`toISOString()`). */
  onChange: (iso: string) => void;
  /** Locale pro zobrazení (výchozí `cs-CZ`). */
  locale?: string;
  /** Názvy měsíců v kolečku měsíc/rok (výchozí česky). */
  monthNames?: string[];
  /** Zkratky dnů od pondělí. */
  weekdayNames?: string[];
  placeholder?: string;
  /** Kolik let před a po aktuálním roce nabídnout (výchozí 5). */
  yearRange?: number;
  disabled?: boolean;
  className?: string;
  id?: string;
  name?: string;
}

const ITEM_HEIGHT = 40;
const WHEEL_HEIGHT = 256;
const PADDING = (WHEEL_HEIGHT - ITEM_HEIGHT) / 2;
const spacerStyle: CSSProperties = { height: PADDING };

const DEFAULT_MONTHS = [
  "leden", "únor", "březen", "duben", "květen", "červen",
  "červenec", "srpen", "září", "říjen", "listopad", "prosinec",
];
const DEFAULT_WEEKDAYS = ["Po", "Út", "St", "Čt", "Pá", "So", "Ne"];

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const MINUTES = Array.from({ length: 60 }, (_, i) => i);

interface WheelProps {
  items: (string | number)[];
  selectedIndex: number;
  wheelRef: RefObject<HTMLDivElement | null>;
  onScroll: () => void;
}

function Wheel({ items, selectedIndex, wheelRef, onScroll }: WheelProps) {
  return (
    <div ref={wheelRef} onScroll={onScroll} className="cbb-dtp__wheel">
      <div style={spacerStyle} />
      {items.map((item, i) => (
        <div key={`${item}-${i}`} className={cn("cbb-dtp__item", i === selectedIndex && "is-selected")}>
          {item}
        </div>
      ))}
      <div style={spacerStyle} />
    </div>
  );
}

/**
 * Výběr data a času s kalendářem a „kolečky“ pro hodiny/minuty (scroll-snap).
 * Kliknutím na měsíc v hlavičce se kalendář přepne na kolečka měsíc/rok
 * a po 2 s nečinnosti se sám vrátí zpět na dny.
 */
export function DateTimePicker({
  value,
  onChange,
  locale = "cs-CZ",
  monthNames = DEFAULT_MONTHS,
  weekdayNames = DEFAULT_WEEKDAYS,
  placeholder,
  yearRange = 5,
  disabled,
  className,
  id,
  name,
}: DateTimePickerProps) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"days" | "monthYear">("days");

  const selectedDate = useMemo(() => {
    const d = value ? new Date(value) : new Date();
    return Number.isNaN(d.getTime()) ? new Date() : d;
  }, [value]);

  const [viewMonth, setViewMonth] = useState(
    () => new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1)
  );

  const years = useMemo(() => {
    const now = new Date().getFullYear();
    return Array.from({ length: yearRange * 2 + 1 }, (_, i) => now - yearRange + i);
  }, [yearRange]);

  const rootRef = useRef<HTMLDivElement>(null);
  const hourRef = useRef<HTMLDivElement>(null);
  const minuteRef = useRef<HTMLDivElement>(null);
  const monthRef = useRef<HTMLDivElement>(null);
  const yearRef = useRef<HTMLDivElement>(null);
  const idleRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const debounceRefs = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  // Uložíme si poslední hodnoty, ať efekty při otevření nereagují na každou změnu.
  const selectedRef = useRef(selectedDate);
  selectedRef.current = selectedDate;

  const close = useCallback(() => {
    setOpen(false);
    setMode("days");
  }, []);

  // klik mimo / Escape
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) close();
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, close]);

  const resetIdle = useCallback(() => {
    clearTimeout(idleRef.current);
    idleRef.current = setTimeout(() => setMode("days"), 2000);
  }, []);

  useEffect(() => {
    if (open && mode === "monthYear") resetIdle();
    return () => clearTimeout(idleRef.current);
  }, [open, mode, resetIdle]);

  useEffect(() => () => Object.values(debounceRefs.current).forEach(clearTimeout), []);

  // při otevření: měsíc zobrazený v kalendáři = vybraný měsíc, kolečka na vybraný čas
  useEffect(() => {
    if (!open) return;
    const d = selectedRef.current;
    setViewMonth(new Date(d.getFullYear(), d.getMonth(), 1));
    const raf = requestAnimationFrame(() => {
      if (hourRef.current) hourRef.current.scrollTop = d.getHours() * ITEM_HEIGHT;
      if (minuteRef.current) minuteRef.current.scrollTop = d.getMinutes() * ITEM_HEIGHT;
    });
    return () => cancelAnimationFrame(raf);
  }, [open]);

  // při přepnutí na měsíc/rok: kolečka na zobrazený měsíc
  useEffect(() => {
    if (!open || mode !== "monthYear") return;
    const raf = requestAnimationFrame(() => {
      if (monthRef.current) monthRef.current.scrollTop = viewMonth.getMonth() * ITEM_HEIGHT;
      const yi = years.indexOf(viewMonth.getFullYear());
      if (yearRef.current && yi >= 0) yearRef.current.scrollTop = yi * ITEM_HEIGHT;
    });
    return () => cancelAnimationFrame(raf);
    // záměrně jen při změně režimu, jinak by kolečko „skákalo“ pod prstem
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, mode]);

  const indexOf = (el: HTMLElement) => Math.round(el.scrollTop / ITEM_HEIGHT);
  const debounce = (key: string, fn: () => void, delay = 90) => {
    clearTimeout(debounceRefs.current[key]);
    debounceRefs.current[key] = setTimeout(fn, delay);
  };

  const handleHour = () => {
    if (!hourRef.current) return;
    const hour = Math.max(0, Math.min(23, indexOf(hourRef.current)));
    if (hour !== selectedDate.getHours()) {
      const d = new Date(selectedDate);
      d.setHours(hour);
      onChange(d.toISOString());
    }
  };
  const handleMinute = () => {
    if (!minuteRef.current) return;
    const minute = Math.max(0, Math.min(59, indexOf(minuteRef.current)));
    if (minute !== selectedDate.getMinutes()) {
      const d = new Date(selectedDate);
      d.setMinutes(minute);
      onChange(d.toISOString());
    }
  };
  const handleMonth = () => {
    if (!monthRef.current) return;
    resetIdle();
    debounce("month", () => {
      if (!monthRef.current) return;
      const month = Math.max(0, Math.min(11, indexOf(monthRef.current)));
      setViewMonth((v) => (month !== v.getMonth() ? new Date(v.getFullYear(), month, 1) : v));
    });
  };
  const handleYear = () => {
    if (!yearRef.current) return;
    resetIdle();
    debounce("year", () => {
      if (!yearRef.current) return;
      const idx = Math.max(0, Math.min(years.length - 1, indexOf(yearRef.current)));
      const year = years[idx];
      setViewMonth((v) => (year !== v.getFullYear() ? new Date(year, v.getMonth(), 1) : v));
    });
  };

  // dny v měsíci (týden začíná pondělím)
  const daysInMonth = new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 0).getDate();
  const firstDay = new Date(viewMonth.getFullYear(), viewMonth.getMonth(), 1).getDay();
  const offset = firstDay === 0 ? 6 : firstDay - 1;
  const cells: (Date | null)[] = [
    ...Array.from({ length: offset }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => new Date(viewMonth.getFullYear(), viewMonth.getMonth(), i + 1)),
  ];

  const selectDay = (day: Date) => {
    const d = new Date(selectedDate);
    // nejdřív den na 1, ať se při přetečení (31. → únor) nepřeskočí měsíc
    d.setDate(1);
    d.setFullYear(day.getFullYear());
    d.setMonth(day.getMonth());
    d.setDate(day.getDate());
    onChange(d.toISOString());
  };

  const shiftMonth = (delta: number) =>
    setViewMonth((v) => new Date(v.getFullYear(), v.getMonth() + delta, 1));

  const renderNav = (invisible: boolean) => (
    <div
      className={cn("cbb-dtp__nav", invisible && "cbb-dtp__nav--ghost")}
      aria-hidden={invisible || undefined}
    >
      <button type="button" tabIndex={invisible ? -1 : 0} onClick={() => !invisible && shiftMonth(-1)} aria-label="Předchozí měsíc">
        ←
      </button>
      <button
        type="button"
        tabIndex={invisible ? -1 : 0}
        className="cbb-dtp__nav-title"
        onClick={() => !invisible && setMode((m) => (m === "days" ? "monthYear" : "days"))}
      >
        {viewMonth.toLocaleDateString(locale, { month: "long", year: "numeric" })}
      </button>
      <button type="button" tabIndex={invisible ? -1 : 0} onClick={() => !invisible && shiftMonth(1)} aria-label="Další měsíc">
        →
      </button>
    </div>
  );

  const display = value
    ? selectedDate.toLocaleString(locale, {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  return (
    <div className={cn("cbb-dtp", className)} ref={rootRef}>
      <input
        readOnly
        id={id}
        name={name}
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
        }}
        className="cbb-input cbb-dtp__input"
      />

      {open && (
        <div className="cbb-dtp__panel" role="dialog" aria-label="Výběr data a času">
          <div className="cbb-dtp__layout">
            <div className="cbb-dtp__cal">
              {renderNav(false)}

              {mode === "days" ? (
                <>
                  <div className="cbb-dtp__weekdays">
                    {weekdayNames.map((d) => (
                      <div key={d}>{d}</div>
                    ))}
                  </div>
                  <div className="cbb-dtp__days">
                    {cells.map((day, i) => {
                      if (!day) return <div key={`e${i}`} className="cbb-dtp__blank" />;
                      const isSelected = day.toDateString() === selectedDate.toDateString();
                      const isToday = day.toDateString() === new Date().toDateString();
                      return (
                        <button
                          key={day.getTime()}
                          type="button"
                          onClick={() => selectDay(day)}
                          aria-pressed={isSelected}
                          className={cn("cbb-dtp__day", isSelected && "is-selected", isToday && !isSelected && "is-today")}
                        >
                          {day.getDate()}
                        </button>
                      );
                    })}
                  </div>
                </>
              ) : (
                <div className="cbb-dtp__wheels">
                  <div className="cbb-dtp__highlight" />
                  <Wheel items={monthNames} selectedIndex={viewMonth.getMonth()} wheelRef={monthRef} onScroll={handleMonth} />
                  <Wheel items={years} selectedIndex={years.indexOf(viewMonth.getFullYear())} wheelRef={yearRef} onScroll={handleYear} />
                </div>
              )}
            </div>

            <div className="cbb-dtp__time">
              {renderNav(true)}
              <div className="cbb-dtp__wheels cbb-dtp__wheels--time">
                <div className="cbb-dtp__highlight" />
                <Wheel
                  items={HOURS.map((h) => String(h).padStart(2, "0"))}
                  selectedIndex={selectedDate.getHours()}
                  wheelRef={hourRef}
                  onScroll={handleHour}
                />
                <Wheel
                  items={MINUTES.map((m) => String(m).padStart(2, "0"))}
                  selectedIndex={selectedDate.getMinutes()}
                  wheelRef={minuteRef}
                  onScroll={handleMinute}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
