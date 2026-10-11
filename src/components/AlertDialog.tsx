import { useEffect, useId, useRef, type ReactNode } from "react";
import { cn } from "../lib/cn";
import { useEscape } from "../hooks/useEscape";
import { useLockBodyScroll } from "../hooks/useLockBodyScroll";
import { useFocusTrap } from "../hooks/useFocusTrap";
import { AlertTriangleIcon, CheckCircleIcon, InfoIcon, XCircleIcon } from "./Icons";
import { Button } from "./Button";

export type AlertDialogVariant = "default" | "destructive" | "info" | "success" | "warning" | "error";

const ICONS = { default: InfoIcon, info: InfoIcon, success: CheckCircleIcon, warning: AlertTriangleIcon, error: XCircleIcon, destructive: AlertTriangleIcon } as const;

export interface AlertDialogProps {
  /** Zda je dialog otevřený. */
  open: boolean;
  /** Zavolá se při zavření (Zrušit, Esc). */
  onClose: () => void;
  /** Otázka. */
  title: ReactNode;
  /** Vysvětlení důsledků. */
  description?: ReactNode;
  /** Barva a ikona (`destructive` pro mazání). */
  variant?: AlertDialogVariant;
  /** Vlastní ikona, nebo `null` pro žádnou. */
  icon?: ReactNode | null;
  /** Text potvrzovacího tlačítka. */
  confirmLabel?: ReactNode;
  /** `null` = jen jedno tlačítko (informační okno). */
  cancelLabel?: ReactNode | null;
  /** Zavolá se po potvrzení. */
  onConfirm?: () => void;
  /** Zavře se i kliknutím mimo okno / Escapem (výchozí true). */
  dismissible?: boolean;
  /** Vlastní obsah pod popisem. */
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
  const panelRef = useRef<HTMLDivElement>(null);
  useFocusTrap(panelRef, open);
  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    panelRef.current?.focus();
    return () => previous?.focus?.();
  }, [open]);
  if (!open) return null;
  const Icon = ICONS[variant];

  return (
    <div className="cbb-overlay" onMouseDown={(e) => dismissible && e.target === e.currentTarget && onClose()}>
      <div ref={panelRef} tabIndex={-1} role="alertdialog" aria-modal="true" aria-labelledby={`${id}-t`} aria-describedby={description ? `${id}-d` : undefined} className="cbb-modal cbb-modal--sm cbb-alertdialog">
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
