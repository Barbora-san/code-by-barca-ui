import { useCallback, useEffect, useState } from "react";
import { cn } from "../lib/cn";
import { useLockBodyScroll } from "../hooks/useLockBodyScroll";
import { ChevronLeftIcon, ChevronRightIcon, XIcon } from "./Icons";

export interface LightboxItem {
  src: string;
  alt?: string;
  caption?: string;
}

export interface LightboxProps {
  open: boolean;
  onClose: () => void;
  items: LightboxItem[];
  initialIndex?: number;
}

/** Celoobrazovkový prohlížeč obrázků – šipky, Escape, klik na pozadí. */
export function Lightbox({ open, onClose, items, initialIndex = 0 }: LightboxProps) {
  const [index, setIndex] = useState(initialIndex);
  const [zoomed, setZoomed] = useState(false);
  useLockBodyScroll(open);

  useEffect(() => {
    setIndex(initialIndex);
    setZoomed(false);
  }, [initialIndex, open]);

  const go = useCallback(
    (delta: number) => {
      setIndex((i) => (i + delta + items.length) % items.length);
      setZoomed(false);
    },
    [items.length]
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft") go(-1);
      else if (e.key === "ArrowRight") go(1);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose, go]);

  if (!open || items.length === 0) return null;
  const item = items[Math.min(index, items.length - 1)];

  return (
    <div
      className="cbb-lightbox"
      role="dialog"
      aria-modal="true"
      aria-label="Prohlížeč obrázků"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="cbb-lightbox__bar">
        <span>
          {index + 1} / {items.length}
        </span>
        <button type="button" onClick={onClose} aria-label="Zavřít">
          <XIcon size={20} />
        </button>
      </div>

      <div className="cbb-lightbox__stage" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
        {items.length > 1 && (
          <button type="button" className="cbb-lightbox__nav cbb-lightbox__nav--prev" onClick={() => go(-1)} aria-label="Předchozí">
            <ChevronLeftIcon size={24} />
          </button>
        )}
        <img
          src={item.src}
          alt={item.alt ?? ""}
          onClick={() => setZoomed((z) => !z)}
          className={cn("cbb-lightbox__img", zoomed && "is-zoomed")}
        />
        {items.length > 1 && (
          <button type="button" className="cbb-lightbox__nav cbb-lightbox__nav--next" onClick={() => go(1)} aria-label="Další">
            <ChevronRightIcon size={24} />
          </button>
        )}
      </div>

      {item.caption && <p className="cbb-lightbox__caption">{item.caption}</p>}
    </div>
  );
}

/** Pomocný hook: `const { props, open } = useLightbox(); <Lightbox {...props} items={…} />` */
export function useLightbox() {
  const [state, setState] = useState({ open: false, initialIndex: 0 });
  return {
    props: {
      open: state.open,
      initialIndex: state.initialIndex,
      onClose: () => setState((s) => ({ ...s, open: false })),
    },
    open: (initialIndex = 0) => setState({ open: true, initialIndex }),
  };
}
