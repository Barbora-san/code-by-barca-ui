import { useCallback, useEffect, useRef, useState, type PointerEvent, type ReactNode } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "./Icons";
import { cn } from "../lib/cn";

export interface CarouselProps {
  slides: ReactNode[];
  /** Po posledním snímku skočí na první a naopak. */
  loop?: boolean;
  /** Automatické přepínání v ms (0 = vypnuto). Zastaví se při najetí myší a při `prefers-reduced-motion`. */
  autoplay?: number;
  showArrows?: boolean;
  showDots?: boolean;
  className?: string;
}

export function Carousel({ slides, loop = true, autoplay = 0, showArrows = true, showDots = true, className }: CarouselProps) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const start = useRef<number | null>(null);
  const count = slides.length;

  const go = useCallback(
    (i: number) => {
      if (count === 0) return;
      if (loop) setIndex(((i % count) + count) % count);
      else setIndex(Math.max(0, Math.min(count - 1, i)));
    },
    [count, loop]
  );

  useEffect(() => {
    if (!autoplay || paused || count < 2) return;
    if (typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setIndex((i) => (loop ? (i + 1) % count : Math.min(i + 1, count - 1))), autoplay);
    return () => clearInterval(t);
  }, [autoplay, paused, count, loop]);

  const onDown = (e: PointerEvent) => {
    start.current = e.clientX;
  };
  const onUp = (e: PointerEvent) => {
    if (start.current === null) return;
    const dx = e.clientX - start.current;
    start.current = null;
    if (Math.abs(dx) > 40) go(index + (dx < 0 ? 1 : -1));
  };

  return (
    <div
      className={cn("cbb-carousel", className)}
      role="region"
      aria-roledescription="carousel"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") go(index - 1);
        if (e.key === "ArrowRight") go(index + 1);
      }}
    >
      <div className="cbb-carousel__viewport" onPointerDown={onDown} onPointerUp={onUp} onPointerCancel={() => (start.current = null)}>
        <div className="cbb-carousel__track" style={{ transform: `translateX(-${index * 100}%)` }}>
          {slides.map((s, i) => (
            <div key={i} className="cbb-carousel__slide" role="group" aria-roledescription="slide" aria-label={`${i + 1} z ${count}`} aria-hidden={i !== index}>
              {s}
            </div>
          ))}
        </div>
      </div>
      {showArrows && count > 1 && (
        <>
          <button type="button" className="cbb-carousel__arrow cbb-carousel__arrow--prev" onClick={() => go(index - 1)} disabled={!loop && index === 0} aria-label="Předchozí">
            <ChevronLeftIcon size={18} />
          </button>
          <button type="button" className="cbb-carousel__arrow cbb-carousel__arrow--next" onClick={() => go(index + 1)} disabled={!loop && index === count - 1} aria-label="Další">
            <ChevronRightIcon size={18} />
          </button>
        </>
      )}
      {showDots && count > 1 && (
        <div className="cbb-carousel__dots">
          {slides.map((_, i) => (
            <button key={i} type="button" className={cn("cbb-carousel__dot", i === index && "is-active")} onClick={() => go(i)} aria-label={`Snímek ${i + 1}`} aria-current={i === index} />
          ))}
        </div>
      )}
    </div>
  );
}
