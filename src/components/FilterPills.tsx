import { cn } from "../lib/cn";

export interface FilterPillOption {
  /** Hodnota, kterou `onChange` vrátí. */
  value: string;
  /** Text pilulky. */
  label: string;
  /** Počet za textem. */
  count?: number;
}

export interface FilterPillsProps {
  /** Možnosti jako pilulky. */
  options: FilterPillOption[];
  /** Vybraná hodnota. */
  value: string;
  /** Dostane hodnotu vybrané pilulky. */
  onChange: (value: string) => void;
  /** Vlastní CSS třída přidaná ke kořenovému prvku. */
  className?: string;
  /** Název skupiny pro čtečky obrazovky. */
  "aria-label"?: string;
}

/** Řada pill tlačítek pro filtrování (All / Web Design / Web Development …). */
export function FilterPills({ options, value, onChange, className, ...rest }: FilterPillsProps) {
  return (
    <div className={cn("cbb-pills", className)} role="group" aria-label={rest["aria-label"]}>
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            aria-pressed={active}
            className={cn("cbb-pill", active && "is-active")}
            onClick={() => onChange(opt.value)}
          >
            {opt.label}
            {typeof opt.count === "number" && <span className="cbb-pill__count">{opt.count}</span>}
          </button>
        );
      })}
    </div>
  );
}
