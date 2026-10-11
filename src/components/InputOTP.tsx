import { useRef, type ClipboardEvent, type KeyboardEvent } from "react";
import { cn } from "../lib/cn";

export interface InputOTPProps {
  /** Aktuálně zadaný kód. */
  value: string;
  /** Dostane kód po každé změně. */
  onChange: (value: string) => void;
  /** Počet znaků (výchozí 6). */
  length?: number;
  /** Pomlčka uprostřed (u 6 číslic 3 + 3). */
  separator?: boolean;
  /** Povolené znaky – výchozí jen číslice. */
  pattern?: RegExp;
  /** Zavolá se, když je kód kompletní. */
  onComplete?: (value: string) => void;
  /** Zakáže prvek (nejde ho použít, je ztlumený). */
  disabled?: boolean;
  /** Zvýrazní pole červeně. */
  invalid?: boolean;
  /** Vlastní CSS třída přidaná ke kořenovému prvku. */
  className?: string;
  /** Přístupný název pro čtečky obrazovky (když není vidět text). */
  "aria-label"?: string;
}

/** Jednorázový kód: automatický posun, Backspace, šipky a vložení ze schránky. */
export function InputOTP({
  value,
  onChange,
  length = 6,
  separator,
  pattern = /\d/,
  onComplete,
  disabled,
  invalid,
  className,
  ...rest
}: InputOTPProps) {
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const chars = Array.from({ length }, (_, i) => value[i] ?? "");

  const commit = (next: string) => {
    onChange(next);
    if (next.length === length) onComplete?.(next);
  };
  const focusAt = (i: number) => refs.current[Math.max(0, Math.min(length - 1, i))]?.focus();

  const setChar = (i: number, ch: string) => {
    const arr = chars.slice();
    arr[i] = ch;
    commit(arr.join("").slice(0, length));
  };

  const onKey = (i: number) => (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      if (chars[i]) setChar(i, "");
      else if (i > 0) {
        setChar(i - 1, "");
        focusAt(i - 1);
      }
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      focusAt(i - 1);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      focusAt(i + 1);
    }
  };

  const onInput = (i: number, raw: string) => {
    const ch = raw.slice(-1);
    if (!ch) return;
    if (!pattern.test(ch)) return;
    setChar(i, ch);
    if (i < length - 1) focusAt(i + 1);
  };

  const onPaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const text = [...e.clipboardData.getData("text")].filter((c) => pattern.test(c)).join("").slice(0, length);
    if (!text) return;
    commit(text);
    focusAt(text.length >= length ? length - 1 : text.length);
  };

  const half = Math.floor(length / 2);

  return (
    <div role="group" aria-label={rest["aria-label"] ?? "Jednorázový kód"} className={cn("cbb-otp", className)}>
      {chars.map((ch, i) => (
        <span key={i} className="cbb-otp__slot">
          {separator && i === half && <span className="cbb-otp__sep">–</span>}
          <input
            ref={(el) => {
              refs.current[i] = el;
            }}
            value={ch}
            inputMode="numeric"
            autoComplete={i === 0 ? "one-time-code" : "off"}
            maxLength={2}
            disabled={disabled}
            aria-label={`Znak ${i + 1}`}
            aria-invalid={invalid || undefined}
            className={cn("cbb-otp__input", invalid && "is-invalid")}
            onChange={(e) => onInput(i, e.target.value)}
            onKeyDown={onKey(i)}
            onPaste={onPaste}
            onFocus={(e) => e.target.select()}
          />
        </span>
      ))}
    </div>
  );
}
