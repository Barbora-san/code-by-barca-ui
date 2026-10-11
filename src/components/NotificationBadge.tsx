import type { ReactNode } from "react";
import { cn } from "../lib/cn";

export interface NotificationBadgeProps {
  /** Prvek, ke kterému se odznak přilepí. */
  children: ReactNode;
  /** Počet. Nad `max` zobrazí „99+“. */
  count?: number;
  /** Jen tečka bez čísla. */
  dot?: boolean;
  /** Nad tuto hodnotu se zobrazí „99+“. */
  max?: number;
  /** Vlastní CSS třída přidaná ke kořenovému prvku. */
  className?: string;
}

/** Číslo / tečka v rohu libovolného prvku (zvonek, e-mail…). Při `count = 0` se skryje. */
export function NotificationBadge({ children, count, dot, max = 99, className }: NotificationBadgeProps) {
  const show = dot || (count ?? 0) > 0;
  return (
    <span className={cn("cbb-nbadge", className)}>
      {children}
      {show && (
        <span className={cn("cbb-nbadge__mark", dot && "is-dot")} aria-label={dot ? "Nové" : `${count} nových`}>
          {!dot && ((count ?? 0) > max ? `${max}+` : count)}
        </span>
      )}
    </span>
  );
}
