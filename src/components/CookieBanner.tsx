import { useEffect, useState, type ReactNode } from "react";
import { CookieIcon } from "./Icons";
import { isExternalHref, useLinkComponent } from "../lib/link";

export type CookieConsent = "necessary" | "all";

export const COOKIE_CONSENT_KEY = "cookie_consent";
export const COOKIE_CONSENT_EVENT = "cookie-consent-change";
/** Vyšli `window.dispatchEvent(new Event(COOKIE_OPEN_EVENT))` (např. z patičky) a lišta se znovu otevře. */
export const COOKIE_OPEN_EVENT = "cookie-consent-open";

/** Aktuální souhlas (`null` = návštěvník ještě nevolil, nebo je storage nedostupný). */
export function getCookieConsent(): CookieConsent | null {
  if (typeof window === "undefined") return null;
  try {
    const v = localStorage.getItem(COOKIE_CONSENT_KEY);
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
  /** Zavolá se po volbě (i při znovuotevření). */
  onChange?: (consent: CookieConsent) => void;
  /** Při odvolání „all → necessary“ stránku znovu načte (už načtené skripty nejdou odebrat). Výchozí true. */
  reloadOnRevoke?: boolean;
  /** Na těchto cestách se lišta neukáže (např. `["/admin"]`) – porovnává se začátek `location.pathname`. */
  hideOnPaths?: string[];
}

export function CookieBanner({
  texts,
  policyHref = "/GDPR",
  onChange,
  reloadOnRevoke = true,
  hideOnPaths = [],
}: CookieBannerProps) {
  const t = { ...DEFAULT_COOKIE_TEXTS, ...texts };
  const LinkComponent = useLinkComponent();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!getCookieConsent()) setVisible(true);
    const reopen = () => setVisible(true);
    window.addEventListener(COOKIE_OPEN_EVENT, reopen);
    return () => window.removeEventListener(COOKIE_OPEN_EVENT, reopen);
  }, []);

  const choose = (value: CookieConsent) => {
    const previous = getCookieConsent();
    try {
      localStorage.setItem(COOKIE_CONSENT_KEY, value);
    } catch {
      /* privátní režim – souhlas platí jen do zavření lišty */
    }
    window.dispatchEvent(new Event(COOKIE_CONSENT_EVENT));
    setVisible(false);
    onChange?.(value);
    if (reloadOnRevoke && previous === "all" && value === "necessary") window.location.reload();
  };

  if (!visible) return null;
  if (typeof window !== "undefined" && hideOnPaths.some((p) => window.location.pathname.startsWith(p))) return null;

  const PolicyLink = isExternalHref(policyHref) ? "a" : LinkComponent;

  return (
    <div role="dialog" aria-label="Nastavení cookies" className="cbb-cookie">
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
          <button type="button" className="cbb-btn cbb-btn--outline-neutral cbb-btn--sm" onClick={() => choose("necessary")}>
            {t.necessary}
          </button>
          <button type="button" className="cbb-btn cbb-btn--primary cbb-btn--sm" onClick={() => choose("all")}>
            {t.all}
          </button>
        </div>
      </div>
    </div>
  );
}
