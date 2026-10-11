import { useState, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "../lib/cn";
import { AlertTriangleIcon, CheckCircleIcon, InfoIcon, XCircleIcon, XIcon } from "./Icons";

export type AlertVariant = "info" | "success" | "warning" | "error";

const ICONS = { info: InfoIcon, success: CheckCircleIcon, warning: AlertTriangleIcon, error: XCircleIcon } as const;

export interface AlertProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  /** Typ hlášky: `info`, `success`, `warning`, `error`. */
  variant?: AlertVariant;
  /** Tučný nadpis. */
  title?: ReactNode;
  /** Text hlášky (alternativa k `children`). */
  description?: ReactNode;
  /** Vlastní ikona, nebo `null` pro žádnou. */
  icon?: ReactNode | null;
  /** Zobrazí křížek; vrací se `onDismiss`. */
  dismissible?: boolean;
  /** Zavolá se po zavření křížkem (potřebuje `dismissible`). */
  onDismiss?: () => void;
  /** Tlačítko / odkaz vpravo. */
  action?: ReactNode;
}

/** Inline hláška uvnitř stránky (info / úspěch / varování / chyba). */
export function Alert({ variant = "info", title, description, icon, dismissible, onDismiss, action, className, children, ...rest }: AlertProps) {
  const [hidden, setHidden] = useState(false);
  if (hidden) return null;
  const Icon = ICONS[variant];
  return (
    <div role={variant === "error" ? "alert" : "status"} className={cn("cbb-alert", `cbb-alert--${variant}`, className)} {...rest}>
      {icon !== null && <span className="cbb-alert__icon">{icon ?? <Icon size={18} />}</span>}
      <div className="cbb-alert__body">
        {title && <p className="cbb-alert__title">{title}</p>}
        {description && <p className="cbb-alert__desc">{description}</p>}
        {children}
      </div>
      {action && <div className="cbb-alert__action">{action}</div>}
      {dismissible && (
        <button
          type="button"
          className="cbb-alert__close"
          aria-label="Zavřít"
          onClick={() => {
            setHidden(true);
            onDismiss?.();
          }}
        >
          <XIcon size={16} />
        </button>
      )}
    </div>
  );
}
