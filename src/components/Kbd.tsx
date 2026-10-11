import type { HTMLAttributes } from "react";
import { cn } from "../lib/cn";

/** Klávesová zkratka v rámečku: `<Kbd>⌘K</Kbd>`.  */
export function Kbd({ className, ...rest }: HTMLAttributes<HTMLElement>) {
  return <kbd className={cn("cbb-kbd", className)} {...rest} />;
}
