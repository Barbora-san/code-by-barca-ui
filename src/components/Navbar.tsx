import { useState, type ReactNode } from "react";
import { cn } from "../lib/cn";
import { isExternalHref, useLinkComponent } from "../lib/link";
import { MenuIcon, XIcon } from "./Icons";
import { useEscape } from "../hooks/useEscape";

export interface NavItem {
  label: ReactNode;
  href: string;
  /** Označí položku jako aktuální (`aria-current="page"`). */
  active?: boolean;
}

export interface NavbarProps {
  /** Logo / název vlevo. */
  brand: ReactNode;
  brandHref?: string;
  items: NavItem[];
  /** CTA vpravo (např. `<Button size="sm">Kontakt</Button>`). */
  cta?: ReactNode;
  /** Vpravo vedle CTA, např. přepínač jazyka. */
  extras?: ReactNode;
  /** Pevně přilepená nahoře (výchozí true). */
  fixed?: boolean;
  className?: string;
}

export function Navbar({ brand, brandHref = "/", items, cta, extras, fixed = true, className }: NavbarProps) {
  const LinkComponent = useLinkComponent();
  const [open, setOpen] = useState(false);
  useEscape(open, () => setOpen(false));

  const renderLink = (item: NavItem, onClick?: () => void) => {
    const Tag = isExternalHref(item.href) || item.href.startsWith("#") ? "a" : LinkComponent;
    return (
      <Tag
        key={item.href}
        href={item.href}
        onClick={onClick}
        aria-current={item.active ? "page" : undefined}
        className={cn("cbb-nav__link", item.active && "is-active")}
      >
        {item.label}
      </Tag>
    );
  };

  const BrandTag = isExternalHref(brandHref) ? "a" : LinkComponent;

  return (
    <nav className={cn("cbb-nav", fixed && "cbb-nav--fixed", className)}>
      <div className="cbb-nav__inner">
        <BrandTag href={brandHref} className="cbb-nav__brand">
          {brand}
        </BrandTag>

        <div className="cbb-nav__links">{items.map((i) => renderLink(i))}</div>

        <div className="cbb-nav__right">
          {extras}
          {cta && <div className="cbb-nav__cta">{cta}</div>}
          <button
            type="button"
            className="cbb-nav__toggle"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-label={open ? "Zavřít menu" : "Otevřít menu"}
          >
            {open ? <XIcon size={22} /> : <MenuIcon size={22} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="cbb-nav__mobile">
          {items.map((i) => renderLink(i, () => setOpen(false)))}
          {cta && <div className="cbb-nav__mobile-cta">{cta}</div>}
        </div>
      )}
    </nav>
  );
}
