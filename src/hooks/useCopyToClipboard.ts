import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Zkopíruje text do schránky. `copied` je `true` na `resetMs` ms po úspěchu (pro „Zkopírováno ✓“).
 * Když `navigator.clipboard` není k dispozici (http, starší prohlížeč), zkusí záložní cestu přes textarea.
 */
export function useCopyToClipboard(resetMs = 2000): { copy: (text: string) => Promise<boolean>; copied: boolean } {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);

  const copy = useCallback(
    async (text: string) => {
      let ok = false;
      try {
        if (navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(text);
          ok = true;
        }
      } catch {
        ok = false;
      }
      if (!ok) {
        try {
          const ta = document.createElement("textarea");
          ta.value = text;
          ta.setAttribute("readonly", "");
          ta.style.cssText = "position:fixed;top:0;left:0;opacity:0";
          document.body.appendChild(ta);
          ta.select();
          ok = document.execCommand("copy");
          document.body.removeChild(ta);
        } catch {
          ok = false;
        }
      }
      if (ok) {
        setCopied(true);
        clearTimeout(timer.current);
        timer.current = setTimeout(() => setCopied(false), resetMs);
      }
      return ok;
    },
    [resetMs]
  );
  return { copy, copied };
}
