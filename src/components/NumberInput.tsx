import { forwardRef, useId, useState, type ReactNode } from "react";
import { cn } from "../lib/cn";
import { useControllable } from "../lib/floating";
import { Field } from "./Field";
import { MinusIcon, PlusIcon } from "./Icons";

export interface NumberInputProps {
  /** Řízená hodnota (`null` = prázdné pole). */
  value?: number | null;
  /** Počáteční hodnota (neřízené použití). */
  defaultValue?: number | null;
  /** Zavolá se po potvrzení hodnoty (tlačítka, šipky, opuštění pole, Enter) s hodnotou po omezení na min / max. */
  onChange?: (value: number | null) => void;
  /** Nejmenší povolená hodnota. */
  min?: number;
  /** Největší povolená hodnota. */
  max?: number;
  /** Krok tlačítek a šipek na klávesnici (Shift = 10×). */
  step?: number;
  /** Počet desetinných míst. Výchozí se odvodí z `step`. */
  precision?: number;
  /** Jazyk pro zápis čísla (desetinná čárka / tečka). Zadávat jde vždy čárkou i tečkou. */
  locale?: string;
  /** Popisek / text. */
  label?: ReactNode;
  /** Nápověda pod polem. */
  hint?: ReactNode;
  /** Chybová hláška – zvýrazní pole červeně a připojí text pod něj. */
  error?: ReactNode;
  /** Text zobrazený v prázdném poli. */
  placeholder?: string;
  /** Zakáže prvek (nejde ho použít, je ztlumený). */
  disabled?: boolean;
  /** Jméno pole pro odeslání formuláře (odešle se číslo s tečkou). */
  name?: string;
  /** Atribut `id` prvku (pro propojení s `<label htmlFor>`). */
  id?: string;
  /** Text tlačítka pro snížení (čtečky obrazovky). */
  decrementLabel?: string;
  /** Text tlačítka pro zvýšení (čtečky obrazovky). */
  incrementLabel?: string;
  /** Vlastní CSS třída přidaná ke kořenovému prvku. */
  className?: string;
}

const decimals = (n: number) => (String(n).split(".")[1] ?? "").length;

/** Číselné pole s tlačítky − a +, šipkami na klávesnici, omezením min / max a zaokrouhlením. */
export const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(function NumberInput(
  {
    value,
    defaultValue = null,
    onChange,
    min,
    max,
    step = 1,
    precision,
    locale = "cs-CZ",
    label,
    hint,
    error,
    placeholder,
    disabled,
    name,
    id,
    decrementLabel = "Snížit",
    incrementLabel = "Zvýšit",
    className,
  },
  ref
) {
  const auto = useId();
  const inputId = id ?? auto;
  const prec = precision ?? Math.max(decimals(step), decimals(min ?? 0));
  const [num, setNum] = useControllable<number | null>(value, defaultValue, onChange);
  const [draft, setDraft] = useState<string | null>(null);

  const fmt = (n: number | null) =>
    n === null
      ? ""
      : new Intl.NumberFormat(locale, { minimumFractionDigits: prec, maximumFractionDigits: prec, useGrouping: false }).format(n);
  const clamp = (n: number) => {
    const c = Math.min(max ?? Infinity, Math.max(min ?? -Infinity, n));
    return Number(c.toFixed(prec));
  };
  const parse = (s: string): number | null => {
    const t = s.trim().replace(/\s/g, "").replace(",", ".");
    if (t === "" || t === "-" || t === "." || t === "-.") return null;
    const n = Number(t);
    return Number.isFinite(n) ? clamp(n) : null;
  };
  const commit = (s: string) => {
    const n = parse(s);
    setDraft(null);
    if (n !== num) setNum(n);
  };
  const bump = (dir: 1 | -1, mult = 1) => {
    const base = draft !== null ? parse(draft) : num;
    const start = base ?? (dir === 1 ? (min ?? 0) - step : (max ?? 0) + step);
    const next = clamp(start + dir * step * mult);
    setDraft(null);
    setNum(next);
  };

  const atMin = num !== null && min !== undefined && num <= min;
  const atMax = num !== null && max !== undefined && num >= max;

  const control = (
    <div className={cn("cbb-num", error && "is-invalid", disabled && "is-disabled", className)}>
      <button type="button" className="cbb-num__btn" aria-label={decrementLabel} tabIndex={-1} disabled={disabled || atMin} onClick={() => bump(-1)}>
        <MinusIcon size={16} />
      </button>
      <input
        ref={ref}
        id={inputId}
        className="cbb-num__input"
        type="text"
        inputMode={prec > 0 ? "decimal" : "numeric"}
        role="spinbutton"
        aria-valuenow={num ?? undefined}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-invalid={error ? true : undefined}
        autoComplete="off"
        placeholder={placeholder}
        disabled={disabled}
        value={draft ?? fmt(num)}
        onChange={(e) => {
          if (/^-?[\d\s]*[.,]?\d*$/.test(e.target.value)) setDraft(e.target.value);
        }}
        onBlur={() => draft !== null && commit(draft)}
        onKeyDown={(e) => {
          if (e.key === "ArrowUp") (e.preventDefault(), bump(1, e.shiftKey ? 10 : 1));
          else if (e.key === "ArrowDown") (e.preventDefault(), bump(-1, e.shiftKey ? 10 : 1));
          else if (e.key === "Enter" && draft !== null) commit(draft);
        }}
      />
      <button type="button" className="cbb-num__btn" aria-label={incrementLabel} tabIndex={-1} disabled={disabled || atMax} onClick={() => bump(1)}>
        <PlusIcon size={16} />
      </button>
      {name && <input type="hidden" name={name} value={num ?? ""} />}
    </div>
  );
  if (!label && !hint && !error) return control;
  return (
    <Field label={label} hint={hint} error={error} htmlFor={inputId}>
      {control}
    </Field>
  );
});
