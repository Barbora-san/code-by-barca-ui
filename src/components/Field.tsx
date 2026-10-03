import {
  forwardRef,
  useId,
  type InputHTMLAttributes,
  type ReactNode,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
} from "react";
import { cn } from "../lib/cn";
import { ChevronDownIcon } from "./Icons";

export interface FieldProps {
  label?: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  /** Id ovládacího prvku (pro `label htmlFor`). Když ho nezadáš, vygeneruje se. */
  htmlFor?: string;
  className?: string;
  children: ReactNode;
}

/** Štítek + ovládací prvek + nápověda / chyba. */
export function Field({ label, hint, error, htmlFor, className, children }: FieldProps) {
  return (
    <div className={cn("cbb-field", className)}>
      {label && (
        <label className="cbb-label" htmlFor={htmlFor}>
          {label}
        </label>
      )}
      {children}
      {error ? (
        <p className="cbb-field__error" role="alert">
          {error}
        </p>
      ) : (
        hint && <p className="cbb-field__hint">{hint}</p>
      )}
    </div>
  );
}

interface ControlExtras {
  label?: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  /** Třída pro obalující `.cbb-field`. */
  wrapperClassName?: string;
}

export interface InputProps extends InputHTMLAttributes<HTMLInputElement>, ControlExtras {}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, hint, error, wrapperClassName, className, id, ...rest },
  ref
) {
  const auto = useId();
  const inputId = id ?? auto;
  const control = (
    <input
      ref={ref}
      id={inputId}
      className={cn("cbb-input", error && "is-invalid", className)}
      aria-invalid={error ? true : undefined}
      {...rest}
    />
  );
  if (!label && !hint && !error) return control;
  return (
    <Field label={label} hint={hint} error={error} htmlFor={inputId} className={wrapperClassName}>
      {control}
    </Field>
  );
});

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement>, ControlExtras {}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { label, hint, error, wrapperClassName, className, id, rows = 5, ...rest },
  ref
) {
  const auto = useId();
  const inputId = id ?? auto;
  const control = (
    <textarea
      ref={ref}
      id={inputId}
      rows={rows}
      className={cn("cbb-input cbb-textarea", error && "is-invalid", className)}
      aria-invalid={error ? true : undefined}
      {...rest}
    />
  );
  if (!label && !hint && !error) return control;
  return (
    <Field label={label} hint={hint} error={error} htmlFor={inputId} className={wrapperClassName}>
      {control}
    </Field>
  );
});

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement>, ControlExtras {
  /** Zkratka místo `<option>` potomků. */
  options?: { value: string; label: ReactNode; disabled?: boolean }[];
  placeholder?: string;
}

/** Nativní `<select>` ve stylu knihovny (pro jednoduché formuláře; pro filtry viz FilterDropdown). */
export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { label, hint, error, wrapperClassName, className, id, children, options, placeholder, ...rest },
  ref
) {
  const auto = useId();
  const inputId = id ?? auto;
  const control = (
    <div className="cbb-select">
      <select
        ref={ref}
        id={inputId}
        className={cn("cbb-input", error && "is-invalid", className)}
        aria-invalid={error ? true : undefined}
        {...rest}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options?.map((o) => (
          <option key={o.value} value={o.value} disabled={o.disabled}>
            {o.label}
          </option>
        ))}
        {children}
      </select>
      <ChevronDownIcon size={16} className="cbb-select__chevron" />
    </div>
  );
  if (!label && !hint && !error) return control;
  return (
    <Field label={label} hint={hint} error={error} htmlFor={inputId} className={wrapperClassName}>
      {control}
    </Field>
  );
});
