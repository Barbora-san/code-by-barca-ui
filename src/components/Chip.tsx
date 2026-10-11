import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "../lib/cn";
import { XIcon } from "./Icons";

export interface ChipProps extends Omit<HTMLAttributes<HTMLSpanElement>, "onClick"> {
  /** Když je zadáno, ukáže se křížek pro odebrání. */
  onRemove?: () => void;
  /** Přístupný popisek křížku (výchozí „Odebrat“). */
  removeLabel?: string;
  /** Ikona před textem. */
  icon?: ReactNode;
}

/** Odebíratelný štítek (aktivní filtr, vybraná položka). */
export function Chip({ onRemove, removeLabel = "Odebrat", icon, className, children, ...rest }: ChipProps) {
  return (
    <span className={cn("cbb-chip", className)} {...rest}>
      {icon}
      <span className="cbb-chip__text">{children}</span>
      {onRemove && (
        <button type="button" className="cbb-chip__x" onClick={onRemove} aria-label={removeLabel}>
          <XIcon size={12} />
        </button>
      )}
    </span>
  );
}
