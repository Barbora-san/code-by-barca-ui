import type { ElementType, ReactNode } from "react";
import { cn } from "../lib/cn";
import { Badge, Tag } from "./Badge";
import { isExternalHref, useLinkComponent } from "../lib/link";

export interface ProjectCardProps {
  title: ReactNode;
  description?: ReactNode;
  /** URL náhledového obrázku (16:9). */
  image?: string;
  imageAlt?: string;
  /** Vlastní náhled místo obrázku (např. `<LazyImage />`). */
  media?: ReactNode;
  category?: ReactNode;
  /** Rok / datum vpravo nahoře (mono písmo). */
  year?: ReactNode;
  tags?: string[];
  maxTags?: number;
  href?: string;
  onClick?: () => void;
  className?: string;
}

export function ProjectCard({
  title,
  description,
  image,
  imageAlt = "",
  media,
  category,
  year,
  tags = [],
  maxTags = 3,
  href,
  onClick,
  className,
}: ProjectCardProps) {
  const LinkComponent = useLinkComponent();
  const Wrapper: ElementType = href ? (isExternalHref(href) ? "a" : LinkComponent) : "div";
  const interactive = Boolean(href || onClick);
  const hasMedia = Boolean(media || image);

  return (
    <Wrapper
      className={cn("cbb-card cbb-card--flush cbb-project", interactive && "cbb-card--hover-border", className)}
      {...(href ? { href } : {})}
      {...(!href && onClick ? { onClick, role: "button", tabIndex: 0 } : {})}
    >
      {hasMedia && (
        <div className="cbb-project__media">
          {media ?? <img src={image} alt={imageAlt} loading="lazy" className="cbb-project__img" />}
        </div>
      )}
      <div className="cbb-project__body">
        {(category || year) && (
          <div className="cbb-project__meta">
            {category && <Badge>{category}</Badge>}
            {year && <span className="cbb-project__year">{year}</span>}
          </div>
        )}
        <h3 className="cbb-project__title">{title}</h3>
        {description && <p className="cbb-project__desc">{description}</p>}
        {tags.length > 0 && (
          <div className="cbb-project__tags">
            {tags.slice(0, maxTags).map((tag) => (
              <Tag key={tag}>{tag}</Tag>
            ))}
            {tags.length > maxTags && <Tag>+{tags.length - maxTags}</Tag>}
          </div>
        )}
      </div>
    </Wrapper>
  );
}
