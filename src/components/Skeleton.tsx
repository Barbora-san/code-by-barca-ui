import type { CSSProperties, HTMLAttributes } from "react";
import { cn } from "../lib/cn";

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  width?: CSSProperties["width"];
  height?: CSSProperties["height"];
  rounded?: "sm" | "md" | "full";
}

/** Pulzující placeholder – základní stavební kámen. */
export function Skeleton({ width, height, rounded = "sm", className, style, ...rest }: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={cn("cbb-skeleton", `cbb-skeleton--${rounded}`, className)}
      style={{ width, height, ...style }}
      {...rest}
    />
  );
}

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

export function SkeletonGrid({ count = 3, variant = "project" }: { count?: number; variant?: "project" | "skill" }) {
  const Item = variant === "project" ? ProjectCardSkeleton : SkillCardSkeleton;
  return (
    <div className="cbb-grid cbb-grid--3">
      {Array.from({ length: count }, (_, i) => (
        <Item key={i} />
      ))}
    </div>
  );
}
