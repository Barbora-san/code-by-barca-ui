import { useEffect, useId, useRef, type ReactNode } from "react";
import { cn } from "../lib/cn";
import { useEscape } from "../hooks/useEscape";
import { useLockBodyScroll } from "../hooks/useLockBodyScroll";
import { XIcon } from "./Icons";

export interface SheetProps {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  description?: ReactNode;
  side?: "left" | "right" | "top" | "bottom";
  footer?: ReactNode;
  className?: string;
  children?: ReactNode;
}

/** Boční panel vyjíždějící z okraje obrazovky (nastavení, menu na mobilu, detail). */
export function Sheet({ open, onClose, title, description, side = "right", footer, className, children }: SheetProps) {
  const id = useId();
  const ref = useRef<HTMLDivElement>(null);
  useEscape(open, onClose);
  useLockBodyScroll(open);

  useEffect(() => {
    if (!open) return;
    const prev = document.activeElement as HTMLElement | null;
    ref.current?.focus();
    return () => prev?.focus?.();
  }, [open]);

  if (!open) return null;
  return (
    <div className="cbb-overlay cbb-overlay--sheet" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <aside ref={ref} role="dialog" aria-modal="true" aria-labelledby={title ? id : undefined} tabIndex={-1} className={cn("cbb-sheet", `cbb-sheet--${side}`, className)}>
        <button type="button" className="cbb-modal__close" onClick={onClose} aria-label="Zavřít">
          <XIcon size={18} />
        </button>
        {(title || description) && (
          <div className="cbb-sheet__head">
            {title && (
              <h3 id={id} className="cbb-modal__title">
                {title}
              </h3>
            )}
            {description && <p className="cbb-modal__desc">{description}</p>}
          </div>
        )}
        <div className="cbb-sheet__body">{children}</div>
        {footer && <div className="cbb-modal__footer">{footer}</div>}
      </aside>
    </div>
  );
}

/** @deprecated Starší název – použij `Sheet`. */
export const Drawer = Sheet;
