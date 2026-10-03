import { useEffect, useState, type ReactNode } from "react";
import { cn } from "../lib/cn";
import { Button } from "./Button";
import { CookieIcon } from "./Icons";
import { isExternalHref, useLinkComponent } from "../lib/link";

export type CookieConsent = "necessary" | "all";

export const COOKIE_CONSENT_KEY = "cookie_consent";
export const COOKIE_CONSENT_EVENT = "cookie-consent-change";
/** `window.dispatchEvent(new Event(COOKIE_OPEN_EVENT))` (např. z patičky) lištu znovu otevře. */
export const COOKIE_OPEN_EVENT = "cookie-consent-open";

/** Aktuální souhlas (`null` = návštěvník ještě nevolil, nebo je storage nedostupný). */
export function getCookieConsent(storageKey: string = COOKIE_CONSENT_KEY): CookieConsent | null {
  if (typeof window === "undefined") return null;
  try {
    const v = localStorage.getItem(storageKey);
    return v === "necessary" || v === "all" ? v : null;
  } catch {
    return null;
  }
}

export interface CookieBannerTexts {
  title: ReactNode;
  body: ReactNode;
  more: ReactNode;
  necessary: ReactNode;
  all: ReactNode;
}

export const DEFAULT_COOKIE_TEXTS: CookieBannerTexts = {
  title: "Tady se pečou cookies 🍪",
  body:
    "Žádný hackerský tracking — jen to nezbytné, aby web fungoval (třeba pamatoval jazyk). " +
    "Když povolíš všechno, můžou se načíst i externí věci jako analytika nebo vložená videa, které si cookies nastavují samy.",
  more: "Zásady zpracování údajů",
  necessary: "Jen nezbytné",
  all: "Přijmout vše",
};

export interface CookieBannerProps {
  texts?: Partial<CookieBannerTexts>;
  /** Odkaz na zásady zpracování údajů. */
  policyHref?: string;
  /** Klíč v localStorage (výchozí `cookie_consent`). */
  storageKey?: string;
  /** Umístění lišty. */
  position?: "bottom" | "bottom-right" | "bottom-left";
  onAccept?: () => void;
  onReject?: () => void;
  /** Zavolá se po jakékoliv volbě. */
  onChange?: (consent: CookieConsent) => void;
  /** Při odvolání „all → necessary“ stránku znovu načte (už načtené skripty nejdou odebrat). Výchozí true. */
  reloadOnRevoke?: boolean;
  /** Na těchto cestách se lišta neukáže (např. `["/admin"]`). */
  hideOnPaths?: string[];
  /**
   * Řízený režim (hodí se pro ukázky): lišta je vidět podle `open`
   * a po volbě zavolá `onClose`. Souhlas se přesto uloží.
   */
  open?: boolean;
  onClose?: () => void;
  /** `false` = v toku stránky místo `position: fixed` (do dokumentace). */
  fixed?: boolean;
  className?: string;
}

export function CookieBanner({
  texts,
  policyHref = "/GDPR",
  storageKey = COOKIE_CONSENT_KEY,
  position = "bottom",
  onAccept,
  onReject,
  onChange,
  reloadOnRevoke = true,
  hideOnPaths = [],
  open,
  onClose,
  fixed = true,
  className,
}: CookieBannerProps) {
  const t = { ...DEFAULT_COOKIE_TEXTS, ...texts };
  const LinkComponent = useLinkComponent();
  const [visible, setVisible] = useState(false);
  const controlled = open !== undefined;

  useEffect(() => {
    if (controlled) return;
    if (!getCookieConsent(storageKey)) setVisible(true);
    const reopen = () => setVisible(true);
    window.addEventListener(COOKIE_OPEN_EVENT, reopen);
    return () => window.removeEventListener(COOKIE_OPEN_EVENT, reopen);
  }, [controlled, storageKey]);

  const choose = (value: CookieConsent) => {
    const previous = getCookieConsent(storageKey);
    try {
      localStorage.setItem(storageKey, value);
    } catch {
      /* privátní režim – souhlas platí jen do zavření lišty */
    }
    window.dispatchEvent(new Event(COOKIE_CONSENT_EVENT));
    setVisible(false);
    onClose?.();
    (value === "all" ? onAccept : onReject)?.();
    onChange?.(value);
    if (!controlled && reloadOnRevoke && previous === "all" && value === "necessary") window.location.reload();
  };

  const shown = controlled ? open : visible;
  if (!shown) return null;
  if (typeof window !== "undefined" && hideOnPaths.some((p) => window.location.pathname.startsWith(p))) return null;

  const PolicyLink = isExternalHref(policyHref) ? "a" : LinkComponent;

  return (
    <div role="dialog" aria-label="Nastavení cookies" className={cn("cbb-cookie", fixed && "cbb-cookie--fixed", `cbb-cookie--${position}`, className)}>
      <div className="cbb-cookie__box">
        <div className="cbb-cookie__text">
          <CookieIcon size={20} className="cbb-cookie__icon" />
          <div>
            <p className="cbb-cookie__title">{t.title}</p>
            <p className="cbb-cookie__body">
              {t.body}{" "}
              <PolicyLink href={policyHref} className="cbb-link">
                {t.more}
              </PolicyLink>
            </p>
          </div>
        </div>
        <div className="cbb-cookie__actions">
          <Button variant="secondary" size="sm" onClick={() => choose("necessary")}>
            {t.necessary}
          </Button>
          <Button size="sm" onClick={() => choose("all")}>
            {t.all}
          </Button>
        </div>
      </div>
    </div>
  );
}
