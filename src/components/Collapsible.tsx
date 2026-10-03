import { useId, type ReactNode } from "react";
import { useControllable } from "../lib/floating";
import { ChevronDownIcon } from "./Icons";
import { cn } from "../lib/cn";

export interface CollapsibleProps {
  trigger: ReactNode;
  children: ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
}

/** Jedna rozbalovací oblast (na rozdíl od Accordion bez rámečku a skupiny). */
export function Collapsible({ trigger, children, open: openProp, defaultOpen = false, onOpenChange, className }: CollapsibleProps) {
  const id = useId();
  const [open, setOpen] = useControllable(openProp, defaultOpen, onOpenChange);
  return (
    <div className={cn("cbb-collapsible", open && "is-open", className)}>
      <button type="button" className="cbb-collapsible__trigger" aria-expanded={open} aria-controls={id} onClick={() => setOpen(!open)}>
        <span>{trigger}</span>
        <ChevronDownIcon size={16} className="cbb-accordion__chev" />
      </button>
      <div id={id} className="cbb-collapse" data-open={open}>
        <div className="cbb-collapse__inner">
          <div className="cbb-collapsible__content">{children}</div>
        </div>
      </div>
    </div>
  );
}
