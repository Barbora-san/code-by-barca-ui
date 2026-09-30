import type { ReactNode } from "react";
import { cn } from "../lib/cn";
import { isExternalHref, useLinkComponent } from "../lib/link";

export interface FooterLink {
  label: ReactNode;
  href?: string;
  onClick?: () => void;
}

export interface FooterColumn {
  title: ReactNode;
  links?: FooterLink[];
  /** Volný obsah místo odkazů (text, sociální ikony…). */
  content?: ReactNode;
}

export interface FooterProps {
  columns?: FooterColumn[];
  /** Spodní řádek (copyright). */
  bottom?: ReactNode;
  /** Odkazy ve spodním řádku (GDPR, Nastavení cookies…). */
  bottomLinks?: FooterLink[];
  className?: string;
}

export function Footer({ columns = [], bottom, bottomLinks = [], className }: FooterProps) {
  const LinkComponent = useLinkComponent();

  const renderLink = (l: FooterLink, i: number) => {
    if (l.href) {
      const Tag = isExternalHref(l.href) || l.href.startsWith("#") ? "a" : LinkComponent;
      return (
        <Tag key={i} href={l.href} className="cbb-footer__link">
          {l.label}
        </Tag>
      );
    }
    return (
      <button key={i} type="button" onClick={l.onClick} className="cbb-footer__link">
        {l.label}
      </button>
    );
  };

  return (
    <footer className={cn("cbb-footer", className)}>
      <div className="cbb-container">
        {columns.length > 0 && (
          <div className="cbb-footer__grid">
            {columns.map((col, i) => (
              <div key={i}>
                <h4 className="cbb-footer__title">{col.title}</h4>
                {col.links && <div className="cbb-footer__links">{col.links.map(renderLink)}</div>}
                {col.content}
              </div>
            ))}
          </div>
        )}
        {(bottom || bottomLinks.length > 0) && (
          <div className="cbb-footer__bottom">
            {bottom && <span>{bottom}</span>}
            {bottomLinks.length > 0 && <div className="cbb-footer__blinks">{bottomLinks.map(renderLink)}</div>}
          </div>
        )}
      </div>
    </footer>
  );
}
