import { useEffect, useState } from "react";
import { cn } from "../lib/cn";

export interface TypewriterProps {
  /** Slova, která se střídavě píšou a mažou. */
  words: string[];
  /** Rychlost psaní (ms na znak). */
  typingSpeed?: number;
  /** Rychlost mazání (ms na znak). */
  deletingSpeed?: number;
  /** Pauza po dopsání slova (ms). */
  pause?: number;
  /** Vlastní CSS třída přidaná ke kořenovému prvku. */
  className?: string;
}

/**
 * Psací efekt s blikajícím kurzorem (hero „I'm a …“).
 * SSR vykreslí první slovo, při `prefers-reduced-motion` se nic nepřepisuje.
 */
export function Typewriter({
  words,
  typingSpeed = 90,
  deletingSpeed = 45,
  pause = 1600,
  className,
}: TypewriterProps) {
  const [text, setText] = useState(words[0] ?? "");
  const joined = words.join("\u0000");

  useEffect(() => {
    if (words.length === 0) return;
    if (typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    let wordIndex = 0;
    let charIndex = words[0].length;
    let deleting = true;
    let timer: ReturnType<typeof setTimeout>;

    const tick = () => {
      const word = words[wordIndex];
      if (deleting) {
        charIndex -= 1;
        setText(word.slice(0, Math.max(charIndex, 0)));
        if (charIndex <= 0) {
          deleting = false;
          wordIndex = (wordIndex + 1) % words.length;
          timer = setTimeout(tick, 300);
          return;
        }
        timer = setTimeout(tick, deletingSpeed);
      } else {
        charIndex += 1;
        setText(word.slice(0, charIndex));
        if (charIndex >= word.length) {
          deleting = true;
          timer = setTimeout(tick, pause);
          return;
        }
        timer = setTimeout(tick, typingSpeed);
      }
    };

    timer = setTimeout(tick, pause);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [joined, typingSpeed, deletingSpeed, pause]);

  return (
    <span className={cn("cbb-typewriter", className)} aria-label={words[0]}>
      {text}
    </span>
  );
}
