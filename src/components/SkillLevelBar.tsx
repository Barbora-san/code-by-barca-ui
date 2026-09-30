import { cn } from "../lib/cn";

export const DEFAULT_SKILL_LEVELS = ["Hobby", "Učím se", "Pracuji s tím", "Hlavní"] as const;

export interface SkillLevelBarProps {
  /** Aktuální úroveň 1–N (počet segmentů = počet `levels`). */
  level: number;
  /** Popisky úrovní zleva doprava. */
  levels?: readonly string[];
  /** Skryje popisky pod lištou. */
  hideLabels?: boolean;
  className?: string;
}

export function SkillLevelBar({
  level,
  levels = DEFAULT_SKILL_LEVELS,
  hideLabels,
  className,
}: SkillLevelBarProps) {
  const current = Math.max(0, Math.min(levels.length, Number(level) || 0));
  return (
    <div
      className={cn("cbb-level", className)}
      role="meter"
      aria-valuemin={0}
      aria-valuemax={levels.length}
      aria-valuenow={current}
      aria-valuetext={current ? levels[current - 1] : undefined}
    >
      <div className="cbb-level__bars">
        {levels.map((label, i) => (
          <div key={label} className={cn("cbb-level__bar", i < current && "is-on")} />
        ))}
      </div>
      {!hideLabels && (
        <div className="cbb-level__labels">
          {levels.map((label, i) => (
            <span key={label} className={cn(i + 1 === current && "is-current")}>
              {label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
