import type { CSSProperties, HTMLAttributes } from "react";
import { cn } from "../lib/cn";

export interface ScrollAreaProps extends HTMLAttributes<HTMLDivElement> {
  maxHeight?: CSSProperties["maxHeight"];
  /** Obě osy (výchozí jen svisle). */
  both?: boolean;
}

/** Oblast s vlastním tenkým scrollbarem v barvách knihovny. */
export function ScrollArea({ maxHeight = 200, both, className, style, children, ...rest }: ScrollAreaProps) {
  return (
    <div tabIndex={0} className={cn("cbb-scrollarea", both && "cbb-scrollarea--both", className)} style={{ maxHeight, ...style }} {...rest}>
      {children}
    </div>
  );
}
