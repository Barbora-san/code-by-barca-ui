import { useEffect, useRef, useState, type HTMLAttributes, type MouseEvent, type ReactNode } from "react";
import { cn } from "../lib/cn";

export interface FlipCardProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  /** Přední strana karty. */
  front: ReactNode;
  /** Zadní strana karty. */
  back: ReactNode;
  /** `click` otáčí po kliknutí / Enter / mezerníku, `hover` po najetí myší nebo při focusu. */
  trigger?: "click" | "hover";
  /** Osa otočení: kolem svislé osy (`horizontal`), nebo vodorovné (`vertical`). */
  direction?: "horizontal" | "vertical";
  /** Řízený stav – `true` ukazuje zadní stranu. */
  flipped?: boolean;
  /** Zavolá se po každém otočení kliknutím, dostane nový stav. */
  onFlipChange?: (flipped: boolean) => void;
  /** Výška karty (číslo = px). Obě strany se musí na tuto výšku vejít. */
  height?: number | string;
}

/** Odkazy, tlačítka a pole uvnitř karty ji neotáčejí – dá se do nich normálně klikat. */
const INTERACTIVE = "a, button, input, select, textarea, label, [data-no-flip]";

/**
 * Karta se dvěma stranami, která se otáčí kliknutím nebo najetím.
 * Skrytá strana je pro klávesnici i čtečky obrazovky nedostupná (`inert`).
 */
export function FlipCard({
  front,
  back,
  trigger = "click",
  direction = "horizontal",
  flipped,
  onFlipChange,
  height = 260,
  className,
  style,
  onClick,
  onKeyDown,
  ...rest
}: FlipCardProps) {
  const [inner, setInner] = useState(false);
  const isFlipped = flipped ?? inner;
  const clickable = trigger === "click";
  const frontRef = useRef<HTMLDivElement>(null);
  const backRef = useRef<HTMLDivElement>(null);

  const toggle = () => {
    const next = !isFlipped;
    setInner(next);
    onFlipChange?.(next);
  };

  // `inert` nastavujeme přes DOM: React 18 ho jako prop nezná a React 19 bere jen boolean.
  useEffect(() => {
    if (!clickable) return;
    frontRef.current?.toggleAttribute("inert", isFlipped);
    backRef.current?.toggleAttribute("inert", !isFlipped);
  }, [clickable, isFlipped]);

  return (
    <div
      {...rest}
      className={cn("cbb-flip", `cbb-flip--${direction}`, `cbb-flip--${trigger}`, isFlipped && "is-flipped", className)}
      style={{ height, ...style }}
      role={clickable ? "button" : undefined}
      tabIndex={clickable ? 0 : undefined}
      aria-pressed={clickable ? isFlipped : undefined}
      onClick={(e: MouseEvent<HTMLDivElement>) => {
        onClick?.(e);
        if (clickable && !(e.target as HTMLElement).closest(INTERACTIVE)) toggle();
      }}
      onKeyDown={(e) => {
        onKeyDown?.(e);
        if (clickable && e.target === e.currentTarget && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          toggle();
        }
      }}
    >
      <div className="cbb-flip__inner">
        <div ref={frontRef} className="cbb-flip__face cbb-flip__front">{front}</div>
        <div ref={backRef} className="cbb-flip__face cbb-flip__back">{back}</div>
      </div>
    </div>
  );
}
