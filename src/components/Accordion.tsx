import { useId, useState, type ReactNode } from "react";
import { ChevronDownIcon } from "./Icons";
import { cn } from "../lib/cn";

export interface AccordionItem {
  title: ReactNode;
  content: ReactNode;
  defaultOpen?: boolean;
  disabled?: boolean;
}

export interface AccordionProps {
  items: AccordionItem[];
  /** Může být otevřených víc položek najednou. */
  multiple?: boolean;
  className?: string;
}

export function Accordion({ items, multiple = false, className }: AccordionProps) {
  const uid = useId();
  const [open, setOpen] = useState<Set<number>>(() => new Set(items.flatMap((it, i) => (it.defaultOpen ? [i] : []))));

  const toggle = (i: number) =>
    setOpen((prev) => {
      const next = new Set(multiple ? prev : []);
      if (prev.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });

  return (
    <div className={cn("cbb-accordion", className)}>
      {items.map((it, i) => {
        const isOpen = open.has(i);
        return (
          <div key={i} className={cn("cbb-accordion__item", isOpen && "is-open")}>
            <h3 className="cbb-accordion__h">
              <button type="button" id={`${uid}-h-${i}`} aria-expanded={isOpen} aria-controls={`${uid}-p-${i}`} disabled={it.disabled} className="cbb-accordion__trigger" onClick={() => toggle(i)}>
                <span>{it.title}</span>
                <ChevronDownIcon size={18} className="cbb-accordion__chev" />
              </button>
            </h3>
            <div id={`${uid}-p-${i}`} role="region" aria-labelledby={`${uid}-h-${i}`} className="cbb-collapse" data-open={isOpen}>
              <div className="cbb-collapse__inner">
                <div className="cbb-accordion__content">{it.content}</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
