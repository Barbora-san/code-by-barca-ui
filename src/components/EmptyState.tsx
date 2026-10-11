import type { ReactNode } from "react";
import { cn } from "../lib/cn";
import { Button } from "./Button";

export interface EmptyStateProps {
  /** Velká ikona nahoře. */
  icon?: ReactNode;
  /** Nadpis. */
  title: ReactNode;
  /** Vysvětlení. */
  description?: ReactNode;
  /** Tlačítko `{ label, onClick }`, nebo vlastní prvek. */
  action?: { label: ReactNode; onClick?: () => void; href?: string } | ReactNode;
  /** Vlastní CSS třída přidaná ke kořenovému prvku. */
  className?: string;
}

function isActionObject(a: EmptyStateProps["action"]): a is { label: ReactNode; onClick?: () => void; href?: string } {
  return typeof a === "object" && a !== null && "label" in (a as object);
}

/** Prázdný stav – žádné výsledky, žádné projekty. */
export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn("cbb-empty", className)}>
      {icon && <div className="cbb-empty__icon">{icon}</div>}
      <h3 className="cbb-empty__title">{title}</h3>
      {description && <p className="cbb-empty__desc">{description}</p>}
      {action &&
        (isActionObject(action) ? (
          <Button size="sm" onClick={action.onClick} href={action.href}>
            {action.label}
          </Button>
        ) : (
          action
        ))}
    </div>
  );
}
