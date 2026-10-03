import type { ElementType, ReactNode } from "react";
import { isExternalHref, useLinkComponent } from "../lib/link";
import { PanelLeftIcon } from "./Icons";
import { cn } from "../lib/cn";
import { Tooltip } from "./Tooltip";

export interface SidebarItem {
  label: ReactNode;
  icon?: ReactNode;
  href?: string;
  onClick?: () => void;
  active?: boolean;
  /** Číslo / text vpravo (počet zpráv…). */
  badge?: ReactNode;
  disabled?: boolean;
}

export interface SidebarGroup {
  title?: ReactNode;
  items: SidebarItem[];
}

export interface SidebarProps {
  groups: SidebarGroup[];
  header?: ReactNode;
  footer?: ReactNode;
  /** Zúžená verze jen s ikonami. */
  collapsed?: boolean;
  /** Když zadáš, zobrazí se tlačítko pro sbalení. */
  onCollapsedChange?: (collapsed: boolean) => void;
  className?: string;
  "aria-label"?: string;
}

/** Svislá navigační lišta (admin, dokumentace). V režimu `collapsed` ukazuje popisky v tooltipu. */
export function Sidebar({ groups, header, footer, collapsed, onCollapsedChange, className, ...rest }: SidebarProps) {
  const LinkComponent = useLinkComponent();

  const renderItem = (it: SidebarItem, key: number) => {
    const Tag: ElementType = it.href ? (isExternalHref(it.href) || it.href.startsWith("#") ? "a" : LinkComponent) : "button";
    const content = (
      <Tag
        {...(it.href ? { href: it.href } : { type: "button" })}
        onClick={it.onClick}
        disabled={!it.href ? it.disabled : undefined}
        aria-current={it.active ? "page" : undefined}
        aria-disabled={it.disabled || undefined}
        className={cn("cbb-sidebar__item", it.active && "is-active", it.disabled && "is-disabled")}
      >
        {it.icon && <span className="cbb-sidebar__icon">{it.icon}</span>}
        {!collapsed && <span className="cbb-sidebar__label">{it.label}</span>}
        {it.badge !== undefined && it.badge !== null && !collapsed && <span className="cbb-sidebar__badge">{it.badge}</span>}
      </Tag>
    );
    return collapsed ? (
      <Tooltip key={key} content={it.label} side="right">
        {content}
      </Tooltip>
    ) : (
      <div key={key}>{content}</div>
    );
  };

  return (
    <nav aria-label={rest["aria-label"] ?? "Hlavní navigace"} className={cn("cbb-sidebar", collapsed && "is-collapsed", className)}>
      {(header || onCollapsedChange) && (
        <div className="cbb-sidebar__header">
          {!collapsed && <div className="cbb-sidebar__brand">{header}</div>}
          {onCollapsedChange && (
            <button type="button" className="cbb-iconbtn" onClick={() => onCollapsedChange(!collapsed)} aria-label={collapsed ? "Rozbalit menu" : "Sbalit menu"} aria-expanded={!collapsed}>
              <PanelLeftIcon size={18} />
            </button>
          )}
        </div>
      )}
      <div className="cbb-sidebar__scroll">
        {groups.map((g, gi) => (
          <div key={gi} className="cbb-sidebar__group">
            {g.title && !collapsed && <p className="cbb-sidebar__title">{g.title}</p>}
            {g.items.map(renderItem)}
          </div>
        ))}
      </div>
      {footer && !collapsed && <div className="cbb-sidebar__footer">{footer}</div>}
    </nav>
  );
}
