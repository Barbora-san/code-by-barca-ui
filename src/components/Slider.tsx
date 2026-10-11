import { useId, type CSSProperties, type InputHTMLAttributes, type ReactNode } from "react";
import { cn } from "../lib/cn";

export interface SliderProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange" | "value" | "type"> {
  /** Aktuální hodnota. */
  value: number;
  /** Dostane novou hodnotu. */
  onChange: (value: number) => void;
  /** Popisek nad posuvníkem. */
  label?: ReactNode;
  /** Nejmenší hodnota (výchozí 0). */
  min?: number;
  /** Největší hodnota (výchozí 100). */
  max?: number;
  /** Krok (výchozí 1). */
  step?: number;
  /** Zobrazí aktuální hodnotu vpravo od popisku. */
  showValue?: boolean;
  /** Formát zobrazené hodnoty (např. `v => v + " %"`). */
  formatValue?: (value: number) => ReactNode;
}

/** Posuvník s volitelným formátem hodnoty. */
export function Slider({
  value,
  onChange,
  label,
  min = 0,
  max = 100,
  step = 1,
  showValue = true,
  formatValue = (v) => v,
  className,
  id,
  ...rest
}: SliderProps) {
  const auto = useId();
  const inputId = id ?? auto;
  const pct = max === min ? 0 : ((value - min) / (max - min)) * 100;
  return (
    <div className={cn("cbb-slider", className)}>
      {(label || showValue) && (
        <div className="cbb-slider__head">
          {label && (
            <label htmlFor={inputId} className="cbb-label">
              {label}
            </label>
          )}
          {showValue && <span className="cbb-slider__value">{formatValue(value)}</span>}
        </div>
      )}
      <input
        {...rest}
        id={inputId}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="cbb-slider__input"
        style={{ "--cbb-fill": `${pct}%` } as CSSProperties}
      />
    </div>
  );
}
