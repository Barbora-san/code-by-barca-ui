import { useId, useRef, type KeyboardEvent, type ReactNode } from "react";
import { useControllable } from "../lib/floating";
import { cn } from "../lib/cn";

export interface TabItem {
  /** Když chybí, použije se index. */
  value?: string;
  /** Text záložky. */
  label: ReactNode;
  /** Obsah záložky. */
  content: ReactNode;
  /** Ikona před textem. */
  icon?: ReactNode;
  /** Zakáže záložku. */
  disabled?: boolean;
}

export interface TabsProps {
  /** Záložky s obsahem. */
  tabs: TabItem[];
  /** Aktivní záložka (řízený stav). */
  value?: string;
  /** Počáteční záložka (neřízené použití). */
  defaultValue?: string;
  /** Dostane `value` zvolené záložky. */
  onChange?: (value: string) => void;
  /** Podtržené, nebo pills. */
  variant?: "underline" | "pills";
  /** Vlastní CSS třída přidaná ke kořenovému prvku. */
  className?: string;
}

/** Záložky s obsahem – podtržené nebo pills. Funguje se šipkami, může být řízené (value) i neřízené. */
export function Tabs({ tabs, value, defaultValue, onChange, variant = "underline", className }: TabsProps) {
  const uid = useId();
  const keyOf = (t: TabItem, i: number) => t.value ?? String(i);
  const firstEnabled = tabs.findIndex((t) => !t.disabled);
  const [active, setActive] = useControllable<string>(value, defaultValue ?? keyOf(tabs[Math.max(firstEnabled, 0)] ?? { label: "", content: null }, Math.max(firstEnabled, 0)), onChange);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  const move = (from: number, dir: 1 | -1 | "first" | "last") => {
    const enabled = tabs.map((t, i) => (t.disabled ? -1 : i)).filter((i) => i >= 0);
    if (!enabled.length) return;
    let target: number;
    if (dir === "first") target = enabled[0];
    else if (dir === "last") target = enabled[enabled.length - 1];
    else {
      const pos = enabled.indexOf(from);
      target = enabled[(pos + dir + enabled.length) % enabled.length];
    }
    refs.current[target]?.focus();
    setActive(keyOf(tabs[target], target));
  };

  const onKey = (i: number) => (e: KeyboardEvent) => {
    if (e.key === "ArrowRight") (e.preventDefault(), move(i, 1));
    else if (e.key === "ArrowLeft") (e.preventDefault(), move(i, -1));
    else if (e.key === "Home") (e.preventDefault(), move(i, "first"));
    else if (e.key === "End") (e.preventDefault(), move(i, "last"));
  };

  const current = tabs.findIndex((t, i) => keyOf(t, i) === active);

  return (
    <div className={cn("cbb-tabs", `cbb-tabs--${variant}`, className)}>
      <div role="tablist" className="cbb-tabs__list">
        {tabs.map((t, i) => {
          const k = keyOf(t, i);
          const on = i === current;
          return (
            <button
              key={k}
              ref={(el) => {
                refs.current[i] = el;
              }}
              type="button"
              role="tab"
              id={`${uid}-tab-${k}`}
              aria-selected={on}
              aria-controls={`${uid}-panel-${k}`}
              tabIndex={on ? 0 : -1}
              disabled={t.disabled}
              className={cn("cbb-tabs__tab", on && "is-active")}
              onClick={() => setActive(k)}
              onKeyDown={onKey(i)}
            >
              {t.icon}
              {t.label}
            </button>
          );
        })}
      </div>
      {tabs[current] && (
        <div role="tabpanel" id={`${uid}-panel-${keyOf(tabs[current], current)}`} aria-labelledby={`${uid}-tab-${keyOf(tabs[current], current)}`} className="cbb-tabs__panel">
          {tabs[current].content}
        </div>
      )}
    </div>
  );
}
