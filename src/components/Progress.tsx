import type { ReactNode } from "react";
import { cn } from "../lib/cn";

export interface ProgressProps {
  /** 0–100. Bez hodnoty je indikátor neurčitý (animovaný). */
  value?: number;
  label?: ReactNode;
  showValue?: boolean;
  variant?: "default" | "success" | "destructive";
  size?: "sm" | "md";
  className?: string;
}

export function Progress({ value, label, showValue = true, variant = "default", size = "md", className }: ProgressProps) {
  const indeterminate = value === undefined;
  const pct = indeterminate ? 0 : Math.max(0, Math.min(100, value));
  return (
    <div className={cn("cbb-progress", className)}>
      {(label || (showValue && !indeterminate)) && (
        <div className="cbb-progress__head">
          {label && <span>{label}</span>}
          {showValue && !indeterminate && <span className="cbb-progress__pct">{Math.round(pct)}%</span>}
        </div>
      )}
      <div
        className={cn("cbb-progress__track", `cbb-progress__track--${size}`)}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={indeterminate ? undefined : pct}
      >
        <div
          className={cn("cbb-progress__bar", `is-${variant}`, indeterminate && "is-indeterminate")}
          style={indeterminate ? undefined : { width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
