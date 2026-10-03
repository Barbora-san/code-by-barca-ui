import type { ElementType, ReactNode } from "react";
import { isExternalHref, useLinkComponent } from "../lib/link";
import { ChevronRightIcon } from "./Icons";
import { cn } from "../lib/cn";

export interface BreadcrumbItem {
  label: ReactNode;
  href?: string;
  icon?: ReactNode;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  separator?: ReactNode;
  className?: string;
}

/** Drobečková navigace. Poslední položka je aktuální stránka (`aria-current`). */
export function Breadcrumb({ items, separator, className }: BreadcrumbProps) {
  const LinkComponent = useLinkComponent();
  return (
    <nav aria-label="Drobečková navigace" className={cn("cbb-breadcrumb", className)}>
      <ol>
        {items.map((it, i) => {
          const last = i === items.length - 1;
          const Tag: ElementType = isExternalHref(it.href) || it.href?.startsWith("#") ? "a" : LinkComponent;
          return (
            <li key={i}>
              {it.href && !last ? (
                <Tag href={it.href} className="cbb-breadcrumb__link">
                  {it.icon}
                  {it.label}
                </Tag>
              ) : (
                <span className="cbb-breadcrumb__current" aria-current={last ? "page" : undefined}>
                  {it.icon}
                  {it.label}
                </span>
              )}
              {!last && <span className="cbb-breadcrumb__sep">{separator ?? <ChevronRightIcon size={14} />}</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
