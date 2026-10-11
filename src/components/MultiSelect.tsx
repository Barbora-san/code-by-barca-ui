import { useId, useMemo, useRef, useState, type ReactNode } from "react";
import { cn } from "../lib/cn";
import { Floating, useClickOutside, useControllable } from "../lib/floating";
import { Field } from "./Field";
import { CheckIcon, ChevronDownIcon, XIcon } from "./Icons";

export interface MultiSelectOption {
  /** Unikátní hodnota (to, co se ukládá). */
  value: string;
  /** Text v nabídce a na štítku. */
  label: string;
  /** Znepřístupní volbu. */
  disabled?: boolean;
}

export interface MultiSelectProps {
  /** Nabídka voleb. */
  options: MultiSelectOption[];
  /** Řízené vybrané hodnoty. */
  value?: string[];
  /** Počáteční výběr (neřízené použití). */
  defaultValue?: string[];
  /** Zavolá se při každé změně výběru. */
  onChange?: (value: string[]) => void;
  /** Text zobrazený v prázdném poli. */
  placeholder?: string;
  /** Pole pro hledání v nabídce. Vypni, když je voleb málo. */
  searchable?: boolean;
  /** Nejvíc voleb, které jde vybrat. Po dosažení se zbylé znepřístupní. */
  max?: number;
  /** Tlačítko pro zrušení celého výběru. */
  clearable?: boolean;
  /** Kolik štítků ukázat, zbytek se sbalí do „+N“. Bez čísla se ukážou všechny. */
  maxChips?: number;
  /** Text, když hledání nic nenajde. */
  emptyLabel?: string;
  /** Popisek / text. */
  label?: ReactNode;
  /** Nápověda pod polem. */
  hint?: ReactNode;
  /** Chybová hláška – zvýrazní pole červeně a připojí text pod něj. */
  error?: ReactNode;
  /** Zakáže prvek (nejde ho použít, je ztlumený). */
  disabled?: boolean;
  /** Jméno pole – pro každou vybranou hodnotu se vloží skrytý input (odeslání formuláře). */
  name?: string;
  /** Atribut `id` prvku (pro propojení s `<label htmlFor>`). */
  id?: string;
  /** Vlastní CSS třída přidaná ke kořenovému prvku. */
  className?: string;
}

/** Výběr více hodnot ze seznamu – štítky, hledání, klávesnice (šipky, Enter, Backspace, Esc) a limit počtu. */
export function MultiSelect({
  options,
  value,
  defaultValue = [],
  onChange,
  placeholder = "Vybrat…",
  searchable = true,
  max,
  clearable = true,
  maxChips,
  emptyLabel = "Nic nenalezeno",
  label,
  hint,
  error,
  disabled,
  name,
  id,
  className,
}: MultiSelectProps) {
  const auto = useId();
  const inputId = id ?? auto;
  const listId = `${inputId}-list`;
  const [sel, setSel] = useControllable<string[]>(value, defaultValue, onChange);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const wrap = useRef<HTMLDivElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);

  useClickOutside([wrap, panel], () => setOpen(false), open);

  const byValue = useMemo(() => new Map(options.map((o) => [o.value, o])), [options]);
  const filtered = useMemo(() => {
    const q = query.trim().toLocaleLowerCase();
    return q ? options.filter((o) => o.label.toLocaleLowerCase().includes(q)) : options;
  }, [options, query]);
  const full = max !== undefined && sel.length >= max;

  const toggle = (v: string) => {
    if (sel.includes(v)) setSel(sel.filter((x) => x !== v));
    else if (!full) setSel([...sel, v]);
  };
  const isOff = (o: MultiSelectOption) => !!o.disabled || (full && !sel.includes(o.value));
  const move = (dir: 1 | -1) => {
    if (!filtered.length) return;
    let i = active;
    for (let n = 0; n < filtered.length; n++) {
      i = (i + dir + filtered.length) % filtered.length;
      if (!isOff(filtered[i]!)) break;
    }
    setActive(i);
  };

  const chips = sel.filter((v) => byValue.has(v));
  const shownChips = maxChips !== undefined ? chips.slice(0, maxChips) : chips;
  const hidden = chips.length - shownChips.length;

  const control = (
    <div
      ref={wrap}
      className={cn("cbb-multi", open && "is-open", error && "is-invalid", disabled && "is-disabled", className)}
      onMouseDown={(e) => {
        if (disabled) return;
        if ((e.target as HTMLElement).closest("button")) return;
        e.preventDefault();
        input.current?.focus();
        setOpen(true);
      }}
    >
      <div className="cbb-multi__value">
        {shownChips.map((v) => (
          <span key={v} className="cbb-multi__chip">
            {byValue.get(v)!.label}
            <button type="button" aria-label={`Odebrat ${byValue.get(v)!.label}`} disabled={disabled} onClick={() => toggle(v)}>
              <XIcon size={12} />
            </button>
          </span>
        ))}
        {hidden > 0 && <span className="cbb-multi__chip is-more">+{hidden}</span>}
        <input
          ref={input}
          id={inputId}
          className="cbb-multi__input"
          role="combobox"
          aria-expanded={open}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={open && filtered[active] ? `${listId}-${active}` : undefined}
          aria-invalid={error ? true : undefined}
          readOnly={!searchable}
          disabled={disabled}
          autoComplete="off"
          placeholder={sel.length ? "" : placeholder}
          value={query}
          onFocus={() => !disabled && setOpen(true)}
          onChange={(e) => {
            setQuery(e.target.value);
            setActive(0);
            setOpen(true);
          }}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") (e.preventDefault(), setOpen(true), move(1));
            else if (e.key === "ArrowUp") (e.preventDefault(), setOpen(true), move(-1));
            else if (e.key === "Enter" && open && filtered[active] && !isOff(filtered[active]!)) (e.preventDefault(), toggle(filtered[active]!.value));
            else if (e.key === "Escape" && open) (e.preventDefault(), e.stopPropagation(), setOpen(false));
            else if (e.key === "Backspace" && !query && sel.length) setSel(sel.slice(0, -1));
            else if (e.key === "Tab") setOpen(false);
          }}
        />
      </div>
      {clearable && sel.length > 0 && !disabled && (
        <button type="button" className="cbb-multi__clear" aria-label="Zrušit výběr" onClick={() => setSel([])}>
          <XIcon size={14} />
        </button>
      )}
      <ChevronDownIcon size={16} className="cbb-multi__chevron" />
      {name && sel.map((v) => <input key={v} type="hidden" name={name} value={v} />)}
      <Floating anchorRef={wrap} open={open} matchWidth panelRef={panel} className="cbb-multi__panel" role="listbox" id={listId} aria-multiselectable="true">
        {filtered.length === 0 ? (
          <p className="cbb-autocomplete__empty">{emptyLabel}</p>
        ) : (
          filtered.map((o, i) => {
            const on = sel.includes(o.value);
            return (
              <div
                key={o.value}
                id={`${listId}-${i}`}
                role="option"
                aria-selected={on}
                aria-disabled={isOff(o) || undefined}
                className={cn("cbb-multi__opt", i === active && "is-active", on && "is-selected", isOff(o) && "is-disabled")}
                onMouseDown={(e) => e.preventDefault()}
                onMouseEnter={() => setActive(i)}
                onClick={() => !isOff(o) && toggle(o.value)}
              >
                <span className="cbb-multi__tick">{on && <CheckIcon size={12} strokeWidth={3} />}</span>
                {o.label}
              </div>
            );
          })
        )}
      </Floating>
    </div>
  );
  if (!label && !hint && !error) return control;
  return (
    <Field label={label} hint={hint} error={error} htmlFor={inputId}>
      {control}
    </Field>
  );
}
