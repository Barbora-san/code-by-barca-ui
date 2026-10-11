import { useMemo, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { cn } from "../lib/cn";
import { formatTime, type PlayerLabels } from "../lib/playerLabels";

export interface PlayerSeekProps {
  /** Uplynulý čas v sekundách. */
  value: number;
  /** Celková délka v sekundách. */
  max: number;
  /** Zavolá se s novým časem po puštění (při tažení) nebo hned při použití klávesnice. */
  onSeek: (seconds: number) => void;
  /** Tenká čára, nebo sloupky ve tvaru zvukové stopy. */
  variant?: "line" | "waveform";
  /** Z čeho se vygeneruje tvar sloupků (např. id skladby), aby měla každá skladba svůj. */
  seed?: string | number;
  /** Přístupné popisky posuvníku (`seek`, `seekValue`). */
  labels: Pick<PlayerLabels, "seek" | "seekValue">;
  /** Vlastní CSS třída přidaná ke kořenovému prvku. */
  className?: string;
}

const BARS = 64;

/** Opakovatelný generátor čísel: stejný seed dá vždy stejné sloupky. */
function seeded(seed: string) {
  let h = 1779033703 ^ seed.length;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(h ^ seed.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return () => {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    h ^= h >>> 16;
    return (h >>> 0) / 4294967296;
  };
}

/** Posuvník času skladby: tažení myší i prstem, šipky, Home a End. */
export function PlayerSeek({ value, max, onSeek, variant = "line", seed = "", labels, className }: PlayerSeekProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [scrub, setScrub] = useState<number | null>(null);
  const shown = scrub ?? (max > 0 ? Math.min(1, value / max) : 0);

  const heights = useMemo(() => {
    if (variant !== "waveform") return [];
    const rnd = seeded(String(seed));
    let prev = 0.5;
    // Vyhlazený šum, ať stopa nevypadá jako náhodné sloupky vedle sebe.
    return Array.from({ length: BARS }, () => (prev = 0.55 * prev + 0.45 * rnd())).map((v) => 0.18 + 0.82 * Math.min(1, v * 1.35));
  }, [variant, seed]);

  const fraction = (e: PointerEvent) => {
    const r = ref.current!.getBoundingClientRect();
    return r.width > 0 ? Math.min(1, Math.max(0, (e.clientX - r.left) / r.width)) : 0;
  };
  const down = (e: PointerEvent<HTMLDivElement>) => {
    if (max <= 0 || e.button !== 0) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    setScrub(fraction(e));
  };
  const move = (e: PointerEvent<HTMLDivElement>) => {
    if (scrub !== null) setScrub(fraction(e));
  };
  const up = (e: PointerEvent<HTMLDivElement>) => {
    if (scrub === null) return;
    onSeek(fraction(e) * max);
    setScrub(null);
  };
  const key = (e: KeyboardEvent<HTMLDivElement>) => {
    const step = e.shiftKey ? 15 : 5;
    const to: Record<string, number> = { ArrowLeft: value - step, ArrowDown: value - step, ArrowRight: value + step, ArrowUp: value + step, Home: 0, End: max };
    if (e.key in to) {
      e.preventDefault();
      e.stopPropagation();
      onSeek(Math.min(max, Math.max(0, to[e.key]!)));
    }
  };

  const now = shown * max;
  return (
    <div
      ref={ref}
      role="slider"
      tabIndex={max > 0 ? 0 : -1}
      aria-label={labels.seek}
      aria-valuemin={0}
      aria-valuemax={Math.round(max)}
      aria-valuenow={Math.round(now)}
      aria-valuetext={labels.seekValue(formatTime(now), formatTime(max))}
      aria-disabled={max <= 0 || undefined}
      className={cn("cbb-seek", `cbb-seek--${variant}`, scrub !== null && "is-scrubbing", className)}
      style={{ "--cbb-seek": `${shown * 100}%` } as React.CSSProperties}
      onPointerDown={down}
      onPointerMove={move}
      onPointerUp={up}
      onPointerCancel={() => setScrub(null)}
      onKeyDown={key}
    >
      {variant === "waveform" ? (
        heights.map((h, i) => <i key={i} className={cn("cbb-seek__bar", (i + 0.5) / BARS <= shown && "is-on")} style={{ height: `${h * 100}%` }} />)
      ) : (
        <>
          <span className="cbb-seek__fill" />
          <span className="cbb-seek__thumb" />
        </>
      )}
    </div>
  );
}
