import { useId, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "../lib/cn";

export interface SwitchProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onChange" | "role"> {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: ReactNode;
  description?: ReactNode;
}

export function Switch({ checked, onChange, label, description, disabled, className, id, ...rest }: SwitchProps) {
  const auto = useId();
  const switchId = id ?? auto;
  return (
    <div className={cn("cbb-switch", disabled && "is-disabled", className)}>
      <button
        {...rest}
        id={switchId}
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        className={cn("cbb-switch__track", checked && "is-on")}
        onClick={() => onChange(!checked)}
      >
        <span className="cbb-switch__thumb" />
      </button>
      {(label || description) && (
        <label htmlFor={switchId} className="cbb-check__text">
          {label && <span className="cbb-check__label">{label}</span>}
          {description && <span className="cbb-check__desc">{description}</span>}
        </label>
      )}
    </div>
  );
}
