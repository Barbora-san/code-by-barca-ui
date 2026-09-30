import { useEffect, useRef, useState } from "react";

export interface UseScrollRevealOptions {
  /** Kdy se animace spustí (záporná hodnota = až když element trochu vjede do viewportu). */
  rootMargin?: string;
  /** Vypne pozorování (např. během načítání dat). */
  disabled?: boolean;
}

/**
 * Vrátí `[ref, visible]`. `visible` se přepne na true, jakmile element vjede
 * do viewportu, a zůstane true (žádné blikání při scrollu sem a tam).
 */
export function useScrollReveal<T extends HTMLElement = HTMLDivElement>({
  rootMargin = "-60px",
  disabled = false,
}: UseScrollRevealOptions = {}) {
  const ref = useRef<T | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (disabled || visible) return;
    const node = ref.current;
    if (!node) return;

    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
            break;
          }
        }
      },
      { rootMargin }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [disabled, rootMargin, visible]);

  return [ref, visible] as const;
}
