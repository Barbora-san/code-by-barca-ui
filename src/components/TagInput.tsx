import { useId, useState, type KeyboardEvent, type ReactNode } from "react";
import { cn } from "../lib/cn";
import { Chip } from "./Chip";

export interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  maxTags?: number;
  label?: ReactNode;
  /** Povolit duplicity (výchozí ne, porovnává se bez ohledu na velikost písmen). */
  allowDuplicates?: boolean;
  disabled?: boolean;
  className?: string;
}

/** Zadávání štítků – Enter nebo čárka přidá, Backspace v prázdném poli odebere poslední. */
export function TagInput({ tags, onChange, placeholder = "Přidat štítek…", maxTags, label, allowDuplicates, disabled, className }: TagInputProps) {
  const [draft, setDraft] = useState("");
  const id = useId();
  const full = maxTags !== undefined && tags.length >= maxTags;

  const add = (raw: string) => {
    const value = raw.trim().replace(/,$/, "").trim();
    if (!value || full) return;
    if (!allowDuplicates && tags.some((t) => t.toLowerCase() === value.toLowerCase())) {
      setDraft("");
      return;
    }
    onChange([...tags, value]);
    setDraft("");
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      add(draft);
    } else if (e.key === "Backspace" && !draft && tags.length) {
      onChange(tags.slice(0, -1));
    }
  };

  return (
    <div className={cn("cbb-field", className)}>
      {label && (
        <label htmlFor={id} className="cbb-label">
          {label}
        </label>
      )}
      <div className={cn("cbb-input cbb-taginput", disabled && "is-disabled")}>
        {tags.map((t) => (
          <Chip key={t} onRemove={disabled ? undefined : () => onChange(tags.filter((x) => x !== t))} removeLabel={`Odebrat ${t}`}>
            {t}
          </Chip>
        ))}
        <input
          id={id}
          value={draft}
          disabled={disabled || full}
          placeholder={full ? `Maximum ${maxTags}` : tags.length ? "" : placeholder}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={onKeyDown}
          onBlur={() => add(draft)}
          className="cbb-taginput__field"
        />
      </div>
      {maxTags !== undefined && (
        <p className="cbb-field__hint">
          {tags.length} / {maxTags}
        </p>
      )}
    </div>
  );
}
