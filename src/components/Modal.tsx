import { useEffect, useId, useRef, type ReactNode } from "react";
import { cn } from "../lib/cn";
import { useEscape } from "../hooks/useEscape";
import { useLockBodyScroll } from "../hooks/useLockBodyScroll";
import { XIcon } from "./Icons";

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  description?: ReactNode;
  /** Zavřít kliknutím na pozadí (výchozí true). */
  closeOnBackdrop?: boolean;
  size?: "sm" | "md" | "lg" | "xl";
  footer?: ReactNode;
  className?: string;
  children?: ReactNode;
}

export function Modal({
  open,
  onClose,
  title,
  description,
  closeOnBackdrop = true,
  size = "md",
  footer,
  className,
  children,
}: ModalProps) {
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  useEscape(open, onClose);
  useLockBodyScroll(open);

  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    panelRef.current?.focus();
    return () => previous?.focus?.();
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="cbb-overlay"
      onMouseDown={(e) => {
        if (closeOnBackdrop && e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        tabIndex={-1}
        className={cn("cbb-modal", `cbb-modal--${size}`, className)}
      >
        <button type="button" className="cbb-modal__close" onClick={onClose} aria-label="Zavřít">
          <XIcon size={18} />
        </button>
        {(title || description) && (
          <div className="cbb-modal__head">
            {title && (
              <h3 id={titleId} className="cbb-modal__title">
                {title}
              </h3>
            )}
            {description && <p className="cbb-modal__desc">{description}</p>}
          </div>
        )}
        <div className="cbb-modal__body">{children}</div>
        {footer && <div className="cbb-modal__footer">{footer}</div>}
      </div>
    </div>
  );
}
