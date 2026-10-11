import { useState, type CSSProperties, type ReactNode } from "react";
import { cn } from "../lib/cn";

export interface WalletCard {
  /** Unikátní klíč karty. */
  id: string;
  /** Značka / název karty (text nebo logo). */
  brand: ReactNode;
  /** Číslo karty. Normálně je vidět jen `**** 1234`, celé číslo se ukáže po najetí na kartu. */
  number: string;
  /** Jméno majitele / popis vlevo dole. */
  holder?: ReactNode;
  /** Popisek nad jménem majitele (výchozí „Majitel“). */
  holderLabel?: ReactNode;
  /** Pozadí karty (jakákoli CSS hodnota `background`, i gradient). */
  color?: string;
  /** Barva textu na kartě – hodí se u světlých karet. */
  textColor?: string;
}

export interface Wallet3DProps {
  /** Karty v peněžence; zobrazí se maximálně první tři (první je vzadu, poslední vepředu). */
  cards: WalletCard[];
  /** Zůstatek v kapse – skrytý za hvězdičkami, ukáže se po najetí. Bez něj se kapsa nezobrazí s částkou. */
  balance?: ReactNode;
  /** Popisek pod zůstatkem. */
  balanceLabel?: ReactNode;
  /** Nápověda pod peněženkou (např. „Najeď myší pro zobrazení zůstatku“). */
  hint?: ReactNode;
  /** Řízený stav vysunutí karet. Bez něj se karty vysouvají po najetí, fokusu nebo klepnutí. */
  open?: boolean;
  /** Zavolá se při změně stavu vysunutí (klepnutí / klávesy). */
  onOpenChange?: (open: boolean) => void;
  /** Přístupný název peněženky pro čtečky obrazovky. */
  "aria-label"?: string;
  /** Vlastní CSS třída přidaná ke kořenovému prvku. */
  className?: string;
}

const last4 = (n: string) => n.replace(/\s/g, "").slice(-4);

/**
 * Peněženka s vrstvenými kartami. Po najetí vyjedou z kapsy, karta pod kurzorem se zvedne a ukáže číslo,
 * zůstatek v kapse se odhalí. Barvy peněženky měníš proměnnými `--cbb-wallet-body` a `--cbb-wallet-line`.
 */
export function Wallet3D({
  cards,
  balance,
  balanceLabel = "Celkový zůstatek",
  hint,
  open,
  onOpenChange,
  "aria-label": ariaLabel = "Peněženka",
  className,
}: Wallet3DProps) {
  const [inner, setInner] = useState(false);
  const isOpen = open ?? inner;
  const set = (v: boolean) => {
    setInner(v);
    onOpenChange?.(v);
  };
  const shown = cards.slice(0, 3);
  const n = shown.length;
  return (
    <div
      className={cn("cbb-wallet", open !== undefined && "is-controlled", isOpen && "is-open", hint && "has-hint", className)}
      role="button"
      tabIndex={0}
      aria-expanded={isOpen}
      aria-label={ariaLabel}
      onClick={() => set(!isOpen)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          set(!isOpen);
        }
      }}
    >
      <div className="cbb-wallet__back" />
      {shown.map((c, i) => {
        const k = n - 1 - i; // 0 = nejpřednější karta
        return (
          <div
            key={c.id}
            className="cbb-wallet__card"
            style={
              {
                "--bottom": `${40 + k * 25}px`,
                "--lift": `${10 + k * 32}px`,
                "--rot": k === 0 ? "0deg" : k % 2 ? "2deg" : "-3deg",
                "--z": 10 + i * 10,
                "--delay": `${i * 0.1 + 0.1}s`,
                background: c.color,
                color: c.textColor,
              } as CSSProperties
            }
          >
            <div className="cbb-wallet__top">
              <span>{c.brand}</span>
              <i className="cbb-wallet__chip" />
            </div>
            <div className="cbb-wallet__bottom">
              <div className="cbb-wallet__holder">
                {c.holder != null && (
                  <>
                    <small>{c.holderLabel ?? "Majitel"}</small>
                    <span>{c.holder}</span>
                  </>
                )}
              </div>
              <div className="cbb-wallet__num">
                <span className="is-hidden">**** {last4(c.number)}</span>
                <span className="is-full">{c.number}</span>
              </div>
            </div>
          </div>
        );
      })}
      <div className="cbb-wallet__pocket">
        <svg className="cbb-wallet__shape" viewBox="0 0 280 160" preserveAspectRatio="none" fill="none" aria-hidden="true">
          <path
            className="cbb-wallet__shape-fill"
            d="M 0 20 C 0 10, 5 10, 10 10 C 20 10, 25 25, 40 25 L 240 25 C 255 25, 260 10, 270 10 C 275 10, 280 10, 280 20 L 280 120 C 280 155, 260 160, 240 160 L 40 160 C 20 160, 0 155, 0 120 Z"
          />
          <path
            className="cbb-wallet__shape-line"
            d="M 8 22 C 8 16, 12 16, 15 16 C 23 16, 27 29, 40 29 L 240 29 C 253 29, 257 16, 265 16 C 268 16, 272 16, 272 22 L 272 120 C 272 150, 255 152, 240 152 L 40 152 C 25 152, 8 152, 8 120 Z"
          />
        </svg>
        {balance != null && (
          <div className="cbb-wallet__content">
            <div className="cbb-wallet__balance">
              <span className="is-hidden">******</span>
              <span className="is-full">{balance}</span>
            </div>
            <small>{balanceLabel}</small>
            <span className="cbb-wallet__eye" aria-hidden="true">
              <svg className="is-closed" width="20" height="20" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
                <line x1="3" y1="3" x2="21" y2="21" />
              </svg>
              <svg className="is-opened" width="20" height="20" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </span>
          </div>
        )}
      </div>
      {hint && <span className="cbb-wallet__hint">{hint}</span>}
    </div>
  );
}
