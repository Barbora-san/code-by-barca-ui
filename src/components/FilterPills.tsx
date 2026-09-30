import { cn } from "../lib/cn";

export interface FilterPillOption {
  value: string;
  label: string;
  count?: number;
}

export interface FilterPillsProps {
  options: FilterPillOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
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
