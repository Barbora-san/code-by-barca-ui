import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "../lib/cn";

export interface DividerProps extends HTMLAttributes<HTMLDivElement> {
  /** Text uprostřed čáry (např. „NEBO“). */
  label?: ReactNode;
  /** Vodorovná čára, nebo svislá (potřebuje rodiče s výškou). */
  orientation?: "horizontal" | "vertical";
}

/** Oddělovač, volitelně s popiskem uprostřed nebo svislý. */
export function Divider({ label, orientation = "horizontal", className, ...rest }: DividerProps) {
  if (orientation === "vertical") {
    return <div role="separator" aria-orientation="vertical" className={cn("cbb-divider cbb-divider--v", className)} {...rest} />;
  }
  return (
    <div role="separator" className={cn("cbb-divider", label && "cbb-divider--label", className)} {...rest}>
      {label && <span>{label}</span>}
    </div>
  );
}
