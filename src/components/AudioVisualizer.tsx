import { useEffect, useState, type CSSProperties } from "react";
import { cn } from "../lib/cn";
import { PauseIcon, PlayIcon } from "./Icons";

export interface AudioVisualizerProps {
  /** Název skladby. */
  title: string;
  /** Interpret (zobrazí se pod názvem). */
  artist?: string;
  /** Délka skladby v sekundách. */
  duration: number;
  /** Počet linek vizualizéru. Linky jsou jen dekorace, nereagují na skutečný zvuk. */
  bars?: number;
  /** Řízená pozice v sekundách. */
  position?: number;
  /** Zavolá se při změně pozice (přehrávání i posun posuvníkem). */
  onPositionChange?: (seconds: number) => void;
  /** Řízený stav přehrávání. */
  playing?: boolean;
  /** Zavolá se po kliknutí na tlačítko přehrát / pauza. */
  onPlayingChange?: (playing: boolean) => void;
  /** Vlastní CSS třída přidaná ke kořenovému prvku. */
  className?: string;
}

const fmt = (s: number) =>
  `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

/**
 * Vzhled přehrávače s poskakujícími linkami a scrubberem.
 * Sám zvuk nepřehrává – posun času je simulovaný. Pro skutečný zvuk řiď `playing`
 * a `position` z vlastního `<audio>` elementu.
 */
export function AudioVisualizer({
  title,
  artist,
  duration,
  bars = 28,
  position,
  onPositionChange,
  playing,
  onPlayingChange,
  className,
}: AudioVisualizerProps) {
  const [innerPlaying, setInnerPlaying] = useState(false);
  const [innerPos, setInnerPos] = useState(0);
  const isPlaying = playing ?? innerPlaying;
  const pos = Math.min(duration, position ?? innerPos);
  const setPos = (n: number) => {
    setInnerPos(n);
    onPositionChange?.(n);
  };
  const posControlled = position !== undefined;

  useEffect(() => {
    if (!isPlaying || posControlled) return;
    const id = setInterval(() => {
      setInnerPos((p) => {
        const n = p + 0.25 >= duration ? 0 : p + 0.25;
        onPositionChange?.(n);
        return n;
      });
    }, 250);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying, posControlled, duration]);

  const pct = duration > 0 ? (pos / duration) * 100 : 0;
  const toggle = () => {
    setInnerPlaying(!isPlaying);
    onPlayingChange?.(!isPlaying);
  };
  return (
    <div className={cn("cbb-audio", isPlaying && "is-playing", className)}>
      <div className="cbb-audio__head">
        <button type="button" className="cbb-audio__play" aria-label={isPlaying ? "Pozastavit" : "Přehrát"} onClick={toggle}>
          {isPlaying ? <PauseIcon size={18} /> : <PlayIcon size={18} />}
        </button>
        <div className="cbb-audio__meta">
          <b>{title}</b>
          {artist && <small>{artist}</small>}
        </div>
      </div>
      <div className="cbb-audio__bars" aria-hidden="true">
        {Array.from({ length: bars }, (_, i) => (
          <i
            key={i}
            className={(i / bars) * 100 < pct ? "is-past" : ""}
            style={{ height: `${20 + ((i * 37) % 70)}%`, animationDelay: `${(i % 7) * 0.08}s` }}
          />
        ))}
      </div>
      <input
        className="cbb-audio__scrub"
        type="range"
        min={0}
        max={duration}
        step={0.25}
        value={pos}
        aria-label="Pozice skladby"
        aria-valuetext={`${fmt(pos)} z ${fmt(duration)}`}
        onChange={(e) => setPos(Number(e.target.value))}
        style={{ "--p": `${pct}%` } as CSSProperties}
      />
      <div className="cbb-audio__time">
        <span>{fmt(pos)}</span>
        <span>{fmt(duration)}</span>
      </div>
    </div>
  );
}
