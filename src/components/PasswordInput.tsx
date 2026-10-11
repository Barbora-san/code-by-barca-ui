import { forwardRef, useId, useState, type InputHTMLAttributes, type ReactNode } from "react";
import { cn } from "../lib/cn";
import { Field } from "./Field";
import { EyeIcon, EyeOffIcon } from "./Icons";

export interface PasswordInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  /** Popisek / text. */
  label?: ReactNode;
  /** Nápověda pod polem. */
  hint?: ReactNode;
  /** Chybová hláška – zvýrazní pole červeně a připojí text pod něj. */
  error?: ReactNode;
  /** Přístupný název tlačítka, když je heslo skryté. */
  showLabel?: string;
  /** Přístupný název tlačítka, když je heslo vidět. */
  hideLabel?: string;
  /** Třída pro obalující `.cbb-field`. */
  wrapperClassName?: string;
}

/** Pole pro heslo s okem, které heslo zobrazí nebo skryje. Tlačítko nezachytává Tab, takže formulář zůstane plynulý. */
export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(function PasswordInput(
  { label, hint, error, showLabel = "Zobrazit heslo", hideLabel = "Skrýt heslo", wrapperClassName, className, id, autoComplete = "current-password", ...rest },
  ref
) {
  const auto = useId();
  const inputId = id ?? auto;
  const [visible, setVisible] = useState(false);
  const control = (
    <div className="cbb-pw">
      <input
        ref={ref}
        id={inputId}
        type={visible ? "text" : "password"}
        autoComplete={autoComplete}
        className={cn("cbb-input cbb-pw__input", error && "is-invalid", className)}
        aria-invalid={error ? true : undefined}
        {...rest}
      />
      <button
        type="button"
        className="cbb-pw__toggle"
        aria-label={visible ? hideLabel : showLabel}
        aria-pressed={visible}
        tabIndex={-1}
        disabled={rest.disabled}
        onClick={() => setVisible((v) => !v)}
      >
        {visible ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
      </button>
    </div>
  );
  if (!label && !hint && !error) return control;
  return (
    <Field label={label} hint={hint} error={error} htmlFor={inputId} className={wrapperClassName}>
      {control}
    </Field>
  );
});
