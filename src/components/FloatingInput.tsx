import { forwardRef, useId, type InputHTMLAttributes } from "react";
import { cn } from "../lib/cn";

export interface FloatingInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "placeholder"> {
  /** Popisek, který po fokusu nebo zápisu vyjede nad pole. */
  label: string;
  /** Chybová hláška pod polem; zároveň pole označí jako neplatné. */
  error?: string;
  /** Pomocný text pod polem (skryje se, když je zobrazena chyba). */
  hint?: string;
}

/** Input jako podtržení; label po fokusu nebo zápisu vyjede nahoru a změní barvu. */
export const FloatingInput = forwardRef<HTMLInputElement, FloatingInputProps>(function FloatingInput(
  { label, error, hint, className, id, ...rest },
  ref,
) {
  const auto = useId();
  const inputId = id ?? auto;
  const msgId = `${inputId}-msg`;
  const message = error ?? hint;
  return (
    <div className={cn("cbb-float", error && "is-error", className)}>
      <input
        {...rest}
        ref={ref}
        id={inputId}
        placeholder=" "
        aria-invalid={!!error || undefined}
        aria-describedby={message ? msgId : undefined}
      />
      <label htmlFor={inputId}>{label}</label>
      {message && (
        <small id={msgId} role={error ? "alert" : undefined}>
          {message}
        </small>
      )}
    </div>
  );
});
