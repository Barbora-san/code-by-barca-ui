import { useEffect, useState, type ElementType, type ReactNode } from "react";
import { cn } from "../lib/cn";
import { isExternalHref, useLinkComponent } from "../lib/link";
import { AlertTriangleIcon, CheckCircleIcon, InfoIcon, SparklesIcon, XCircleIcon, XIcon } from "./Icons";

export type AlertBarVariant = "brand" | "info" | "success" | "warning" | "error";

const ICONS = { brand: SparklesIcon, info: InfoIcon, success: CheckCircleIcon, warning: AlertTriangleIcon, error: XCircleIcon } as const;

export interface AlertBarProps {
  children: ReactNode;
  variant?: AlertBarVariant;
  /** `static` = v toku stránky, `top` / `bottom` = přilepená k okraji okna. */
  position?: "static" | "top" | "bottom";
  icon?: ReactNode | null;
  /** Odkaz / akce na konci lišty. */
  action?: { label: ReactNode; href?: string; onClick?: () => void };
  dismissible?: boolean;
  /** Když zadáš, zavření se zapamatuje v localStorage (lišta se už neukáže). */
  storageKey?: string;
  onDismiss?: () => void;
  className?: string;
}

/** Oznamovací lišta přes celou šířku – novinky, výpadky, upozornění na údržbu… */
export function AlertBar({ children, variant = "brand", position = "static", icon, action, dismissible = true, storageKey, onDismiss, className }: AlertBarProps) {
  const Link = useLinkComponent();
  const [visible, setVisible] = useState(!storageKey);

  useEffect(() => {
    if (!storageKey) return;
    try {
      setVisible(localStorage.getItem(storageKey) !== "dismissed");
    } catch {
      setVisible(true);
    }
  }, [storageKey]);

  if (!visible) return null;
  const Icon = ICONS[variant];

  const close = () => {
    setVisible(false);
    if (storageKey) {
      try {
        localStorage.setItem(storageKey, "dismissed");
      } catch {
        /* ignorováno */
      }
    }
    onDismiss?.();
  };

  const ActionTag: ElementType = action?.href ? (isExternalHref(action.href) ? "a" : Link) : "button";

  return (
    <div role={variant === "error" ? "alert" : "status"} className={cn("cbb-alertbar", `cbb-alertbar--${variant}`, position !== "static" && `cbb-alertbar--${position}`, className)}>
      <div className="cbb-alertbar__inner">
        {icon !== null && <span className="cbb-alertbar__icon">{icon ?? <Icon size={16} />}</span>}
        <span className="cbb-alertbar__text">{children}</span>
        {action && (
          <ActionTag
            className="cbb-alertbar__action"
            {...(action.href ? { href: action.href } : { type: "button" })}
            onClick={action.onClick}
          >
            {action.label}
          </ActionTag>
        )}
      </div>
      {dismissible && (
        <button type="button" className="cbb-alertbar__close" onClick={close} aria-label="Zavřít lištu">
          <XIcon size={16} />
        </button>
      )}
    </div>
  );
}
