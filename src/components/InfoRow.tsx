import type { ElementType, ReactNode } from "react";
import { isExternalHref, useLinkComponent } from "../lib/link";
import { cn } from "../lib/cn";

export interface InfoRowProps {
  icon: ReactNode;
  label: ReactNode;
  value: ReactNode;
  href?: string;
  className?: string;
}

/** Řádek kontaktní informace (ikona ve žlutém čtverci + popisek + hodnota). */
export function InfoRow({ icon, label, value, href, className }: InfoRowProps) {
  const LinkComponent = useLinkComponent();
  const Tag: ElementType = href ? (isExternalHref(href) ? "a" : LinkComponent) : "div";
  const external = href && isExternalHref(href) && /^https?:/i.test(href);
  return (
    <Tag
      className={cn("cbb-info", href && "cbb-info--link", className)}
      {...(href ? { href } : {})}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      <div className="cbb-info__icon">{icon}</div>
      <div className="cbb-info__text">
        <p className="cbb-info__label">{label}</p>
        <p className="cbb-info__value">{value}</p>
      </div>
    </Tag>
  );
}

export interface SocialLink {
  label: string;
  href: string;
  icon: ReactNode;
}

/** Řada čtvercových ikon sociálních sítí. */
export function SocialLinks({ links, className }: { links: SocialLink[]; className?: string }) {
  return (
    <div className={cn("cbb-social", className)}>
      {links.map((l) => (
        <a key={l.href} href={l.href} aria-label={l.label} title={l.label} target="_blank" rel="noopener noreferrer" className="cbb-social__item">
          {l.icon}
        </a>
      ))}
    </div>
  );
}
