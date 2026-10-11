import { useId, type ReactNode } from "react";
import { cn } from "../lib/cn";

export interface RadioOption {
  /** Hodnota, kterou `onChange` vrátí. */
  value: string;
  /** Text možnosti. */
  label: ReactNode;
  /** Doplňující text. */
  description?: ReactNode;
  /** Zakáže jen tuto možnost. */
  disabled?: boolean;
}

export interface RadioProps {
  /** Možnosti skupiny. */
  options: RadioOption[];
  /** Vybraná hodnota. */
  value?: string;
  /** Dostane hodnotu vybrané možnosti. */
  onChange?: (value: string) => void;
  /** Společné `name` skupiny (výchozí se vygeneruje). */
  name?: string;
  /** Možnosti pod sebou, nebo vedle sebe. */
  orientation?: "vertical" | "horizontal";
  /** Zakáže celou skupinu. */
  disabled?: boolean;
  /** Vlastní CSS třída přidaná ke kořenovému prvku. */
  className?: string;
  /** Název skupiny pro čtečky obrazovky. */
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
