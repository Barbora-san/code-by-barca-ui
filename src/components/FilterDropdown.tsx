import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { cn } from "../lib/cn";
import { CheckIcon, ChevronDownIcon } from "./Icons";

export interface FilterOption {
  value: string;
  label: string;
  count?: number;
  icon?: ReactNode;
  /** CSS třída barevné tečky před popiskem. */
  dotClass?: string;
}

interface BaseProps {
  label: string;
  icon?: ReactNode;
  options: FilterOption[];
  placeholder?: string;
  selectAllLabel?: string;
  clearLabel?: string;
  selectedLabel?: (count: number) => string;
  className?: string;
}

export type FilterDropdownProps = BaseProps &
  (
    | { multiple?: false; value: string; onChange: (value: string) => void }
    | { multiple: true; value: string[]; onChange: (value: string[]) => void }
  );

/**
 * Vlastní dropdown filtr (bez externích knihoven) – jedna nebo více voleb,
 * zavírá se klikem mimo a Escapem, ovládá se šipkami.
 */
export function FilterDropdown(props: FilterDropdownProps) {
  const {
    label,
    icon,
    options,
    placeholder = "Vše",
    selectAllLabel = "Vybrat vše",
    clearLabel = "Zrušit výběr",
    selectedLabel = (n) => `${n} vybráno`,
    className,
  } = props;
  const multiple = props.multiple === true;
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const selected: string[] = multiple ? (props.value as string[]) : [props.value as string];
  const isActive = (v: string) => selected.includes(v);

  let display: string;
  if (multiple) {
    if (selected.length === 0) display = placeholder;
    else if (selected.length === 1) display = options.find((o) => o.value === selected[0])?.label ?? placeholder;
    else display = selectedLabel(selected.length);
  } else {
    display = (options.find((o) => o.value === props.value) ?? options[0])?.label ?? placeholder;
  }

  const select = (value: string) => {
    if (props.multiple) {
      const next = new Set(props.value);
      if (next.has(value)) next.delete(value);
      else next.add(value);
      props.onChange([...next]);
    } else {
      (props as { onChange: (v: string) => void }).onChange(value);
      setOpen(false);
    }
  };

  const allValues = options.map((o) => o.value);
  const allSelected = allValues.length > 0 && allValues.every((v) => selected.includes(v));

  return (
    <div className={cn("cbb-dropdown", className)} ref={rootRef}>
      <button
        type="button"
        className={cn("cbb-dropdown__trigger", open && "is-open")}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        onClick={() => setOpen((o) => !o)}
      >
        <span className="cbb-dropdown__value">
          {icon}
          <span className="cbb-dropdown__label">{label}:</span>
          <span className="cbb-dropdown__current">{display}</span>
          {multiple && selected.length > 1 && <span className="cbb-dropdown__count">{selected.length}</span>}
        </span>
        <ChevronDownIcon size={16} className={cn("cbb-dropdown__chevron", open && "is-open")} />
      </button>

      {open && (
        <div id={listId} role="listbox" aria-multiselectable={multiple || undefined} className="cbb-dropdown__menu">
          {props.multiple && (
            <div className="cbb-dropdown__head">
              <span>{selectedLabel(selected.length)}</span>
              <button
                type="button"
                onClick={() => props.onChange(allSelected ? [] : allValues)}
              >
                {allSelected ? clearLabel : selectAllLabel}
              </button>
            </div>
          )}
          {options.map((opt) => {
            const active = isActive(opt.value);
            return (
              <button
                key={opt.value}
                type="button"
                role="option"
                aria-selected={active}
                className={cn("cbb-dropdown__option", active && "is-active")}
                onClick={() => select(opt.value)}
              >
                {multiple && (
                  <span className={cn("cbb-dropdown__check", active && "is-on")}>
                    {active && <CheckIcon size={12} />}
                  </span>
                )}
                {opt.dotClass && <span className={cn("cbb-dropdown__dot", opt.dotClass)} />}
                {opt.icon}
                <span className="cbb-dropdown__text">{opt.label}</span>
                {typeof opt.count === "number" && <span className="cbb-dropdown__n">{opt.count}</span>}
                {!multiple && active && <CheckIcon size={16} />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
