import { useId, type ReactNode } from "react";
import { cn } from "../lib/cn";
import { useEscape } from "../hooks/useEscape";
import { useLockBodyScroll } from "../hooks/useLockBodyScroll";
import { AlertTriangleIcon, CheckCircleIcon, InfoIcon, XCircleIcon } from "./Icons";
import { Button } from "./Button";

export type AlertDialogVariant = "default" | "destructive" | "info" | "success" | "warning" | "error";

const ICONS = { default: InfoIcon, info: InfoIcon, success: CheckCircleIcon, warning: AlertTriangleIcon, error: XCircleIcon, destructive: AlertTriangleIcon } as const;

export interface AlertDialogProps {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  description?: ReactNode;
  variant?: AlertDialogVariant;
  /** Vlastní ikona, nebo `null` pro žádnou. */
  icon?: ReactNode | null;
  confirmLabel?: ReactNode;
  /** `null` = jen jedno tlačítko (informační okno). */
  cancelLabel?: ReactNode | null;
  onConfirm?: () => void;
  /** Zavře se i kliknutím mimo okno / Escapem (výchozí true). */
  dismissible?: boolean;
  children?: ReactNode;
}

/**
 * Potvrzovací okno („Opravdu smazat?“). Nelze ho minout – klik mimo ho nezavře,
 * pokud nastavíš `dismissible={false}`. Pro imperativní použití viz `messageBox`.
 */
export function AlertDialog({
  open,
  onClose,
  title,
  description,
  variant = "default",
  icon,
  confirmLabel = "OK",
  cancelLabel = "Zrušit",
  onConfirm,
  dismissible = true,
  children,
}: AlertDialogProps) {
  const id = useId();
  useEscape(open && dismissible, onClose);
  useLockBodyScroll(open);
  if (!open) return null;
  const Icon = ICONS[variant];

  return (
    <div className="cbb-overlay" onMouseDown={(e) => dismissible && e.target === e.currentTarget && onClose()}>
      <div role="alertdialog" aria-modal="true" aria-labelledby={`${id}-t`} aria-describedby={description ? `${id}-d` : undefined} className="cbb-modal cbb-modal--sm cbb-alertdialog">
        <div className="cbb-alertdialog__body">
          {icon !== null && <span className={cn("cbb-alertdialog__icon", `is-${variant}`)}>{icon ?? <Icon size={22} />}</span>}
          <div>
            <h3 id={`${id}-t`} className="cbb-modal__title">
              {title}
            </h3>
            {description && (
              <p id={`${id}-d`} className="cbb-modal__desc">
                {description}
              </p>
            )}
            {children}
          </div>
        </div>
        <div className="cbb-modal__footer">
          {cancelLabel !== null && (
            <Button variant="secondary" size="sm" onClick={onClose}>
              {cancelLabel}
            </Button>
          )}
          <Button
            size="sm"
            variant={variant === "destructive" || variant === "error" ? "destructive" : "primary"}
            onClick={() => {
              onConfirm?.();
              onClose();
            }}
            autoFocus
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
