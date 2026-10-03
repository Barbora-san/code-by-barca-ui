import { useId, type ReactNode } from "react";
import { cn } from "../lib/cn";

export interface RadioOption {
  value: string;
  label: ReactNode;
  description?: ReactNode;
  disabled?: boolean;
}

export interface RadioProps {
  options: RadioOption[];
  value?: string;
  onChange?: (value: string) => void;
  name?: string;
  orientation?: "vertical" | "horizontal";
  disabled?: boolean;
  className?: string;
  "aria-label"?: string;
}

/** Skupina radio tlačítek (nativní inputy → funguje klávesnice i formuláře). */
export function Radio({ options, value, onChange, name, orientation = "vertical", disabled, className, ...rest }: RadioProps) {
  const auto = useId();
  const group = name ?? auto;
  return (
    <div role="radiogroup" aria-label={rest["aria-label"]} className={cn("cbb-radio-group", `cbb-radio-group--${orientation}`, className)}>
      {options.map((o) => {
        const off = disabled || o.disabled;
        return (
          <label key={o.value} className={cn("cbb-radio", off && "is-disabled")}>
            <input
              type="radio"
              name={group}
              value={o.value}
              checked={value === o.value}
              disabled={off}
              onChange={() => onChange?.(o.value)}
              className="cbb-radio__input"
            />
            <span className="cbb-radio__dot" aria-hidden="true" />
            <span className="cbb-check__text">
              <span className="cbb-check__label">{o.label}</span>
              {o.description && <span className="cbb-check__desc">{o.description}</span>}
            </span>
          </label>
        );
      })}
    </div>
  );
}
