import { forwardRef, useEffect, useId, useRef, type InputHTMLAttributes, type ReactNode } from "react";
import { cn } from "../lib/cn";
import { CheckIcon } from "./Icons";

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange" | "type" | "size"> {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  label?: ReactNode;
  description?: ReactNode;
  /** Částečně zaškrtnuto (např. „vybrat vše“). */
  indeterminate?: boolean;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { checked, onChange, label, description, indeterminate, className, id, disabled, ...rest },
  ref
) {
  const auto = useId();
  const inputId = id ?? auto;
  const inner = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (inner.current) inner.current.indeterminate = Boolean(indeterminate);
  }, [indeterminate]);

  return (
    <label htmlFor={inputId} className={cn("cbb-check", disabled && "is-disabled", className)}>
      <input
        ref={(node) => {
          inner.current = node;
          if (typeof ref === "function") ref(node);
          else if (ref) ref.current = node;
        }}
        id={inputId}
        type="checkbox"
        className="cbb-check__input"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange?.(e.target.checked)}
        {...rest}
      />
      <span className="cbb-check__box" aria-hidden="true">
        {indeterminate ? <span className="cbb-check__dash" /> : <CheckIcon size={12} strokeWidth={3} />}
      </span>
      {(label || description) && (
        <span className="cbb-check__text">
          {label && <span className="cbb-check__label">{label}</span>}
          {description && <span className="cbb-check__desc">{description}</span>}
        </span>
      )}
    </label>
  );
});
