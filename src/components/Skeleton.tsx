import type { CSSProperties, HTMLAttributes } from "react";
import { cn } from "../lib/cn";

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  /** Šířka (číslo = px, nebo CSS hodnota). */
  width?: CSSProperties["width"];
  /** Výška (číslo = px, nebo CSS hodnota). */
  height?: CSSProperties["height"];
  /** Zaoblení rohů. */
  rounded?: "sm" | "md" | "full";
  /** Zkratka: `circle` = kulatý 40px, `text` = řádek textu, `rect` = obdélník. */
  variant?: "circle" | "text" | "rect";
}

/** Pulzující placeholder – základní stavební kámen. */
export function Skeleton({ width, height, rounded = "sm", variant, className, style, ...rest }: SkeletonProps) {
  if (variant === "circle") {
    width = width ?? 40;
    height = height ?? 40;
    rounded = "full";
  } else if (variant === "text") {
    height = height ?? 14;
    width = width ?? "100%";
  } else if (variant === "rect") {
    height = height ?? 120;
    width = width ?? "100%";
    rounded = "md";
  }
  return (
    <div
      aria-hidden="true"
      className={cn("cbb-skeleton", `cbb-skeleton--${rounded}`, className)}
      style={{ width, height, ...style }}
      {...rest}
    />
  );
}

/** Skeleton (zástupná kostra) karty projektu pro dobu načítání. */
export function ProjectCardSkeleton() {
  return (
    <div className="cbb-card cbb-card--flush" aria-busy="true">
      <Skeleton height={208} rounded="sm" style={{ borderRadius: 0 }} />
      <div className="cbb-project__body">
        <Skeleton width={96} height={12} />
        <Skeleton width="75%" height={24} />
        <Skeleton width="100%" height={16} />
        <Skeleton width="83%" height={16} />
        <div className="cbb-project__tags">
          <Skeleton width={64} height={24} rounded="full" />
          <Skeleton width={80} height={24} rounded="full" />
        </div>
      </div>
    </div>
  );
}

/** Skeleton (zástupná kostra) karty dovednosti pro dobu načítání. */
export function SkillCardSkeleton() {
  return (
    <div className="cbb-card cbb-skill" aria-busy="true">
      <div className="cbb-skill__inner">
        <Skeleton width={56} height={56} rounded="md" />
        <Skeleton width="66%" height={24} />
        <Skeleton width="100%" height={16} />
        <Skeleton width="75%" height={16} />
        <Skeleton width="100%" height={8} rounded="full" />
      </div>
    </div>
  );
}

export interface SkeletonGridProps {
  /** Kolik karet vykreslit. */
  count?: number;
  /** Tvar karty: `project` (s obrázkem) nebo `skill`. */
  variant?: "project" | "skill";
  /** Počet sloupců na širokém displeji (na tabletu 2, na mobilu 1). */
  columns?: 2 | 3 | 4;
  /** Vlastní CSS třída přidaná ke kořenovému prvku. */
  className?: string;
}

/** Mřížka zástupných karet. Sama se roztáhne na celou šířku – nevkládej ji do další mřížky. */
export function SkeletonGrid({ count = 3, variant = "project", columns = 3, className }: SkeletonGridProps) {
  const Item = variant === "project" ? ProjectCardSkeleton : SkillCardSkeleton;
  return (
    <div className={cn("cbb-grid", `cbb-grid--${columns}`, className)}>
      {Array.from({ length: count }, (_, i) => (
        <Item key={i} />
      ))}
    </div>
  );
}
