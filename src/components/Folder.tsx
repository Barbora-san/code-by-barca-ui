import { useState, type CSSProperties, type ReactNode } from "react";
import { cn } from "../lib/cn";

export interface FolderItem {
  /** Unikátní klíč položky. */
  id: string;
  /** Hlavní text na listu. */
  label: ReactNode;
  /** Vedlejší text pod názvem (např. datum, velikost). */
  meta?: ReactNode;
  /** Zavolá se po kliknutí na list (jen když je složka otevřená). */
  onClick?: () => void;
}

export interface FolderProps {
  /** Název složky na přední straně. */
  label: ReactNode;
  /** Položky složky. Jako listy se zobrazí prvních `maxVisible`. */
  items: FolderItem[];
  /** Řízený stav otevření. */
  open?: boolean;
  /** Počáteční stav (neřízené použití). */
  defaultOpen?: boolean;
  /** Zavolá se při otevření / zavření. */
  onOpenChange?: (open: boolean) => void;
  /**
   * Způsob otevření: `stack` = kompaktní, listy se vysunou nahoru jako malý vějíř,
   * `spread` = větší složka, listy se roztáhnou vedle sebe jako velké karty.
   */
  variant?: "stack" | "spread";
  /** Barva složky (CSS barva), výchozí je akcentová žlutá. */
  color?: string;
  /** Kolik listů se ukáže po otevření (1–4). */
  maxVisible?: number;
  /** Text pod názvem složky; dostane počet položek. Výchozí „N položek“. */
  countLabel?: (count: number) => ReactNode;
  /** Vlastní CSS třída přidaná ke kořenovému prvku. */
  className?: string;
}

const defaultCount = (n: number) => `${n} ${n === 1 ? "položka" : n >= 2 && n <= 4 ? "položky" : "položek"}`;

/** Klikací složka – po otevření se listy vysunou ven jako vějíř. */
export function Folder({
  label,
  items,
  open,
  defaultOpen = false,
  onOpenChange,
  variant = "stack",
  color,
  maxVisible = 3,
  countLabel = defaultCount,
  className,
}: FolderProps) {
  const [inner, setInner] = useState(defaultOpen);
  const isOpen = open ?? inner;
  const toggle = () => {
    setInner(!isOpen);
    onOpenChange?.(!isOpen);
  };
  const shown = items.slice(0, Math.min(4, Math.max(1, maxVisible)));
  return (
    <div
      className={cn("cbb-folder", variant === "spread" && "cbb-folder--spread", isOpen && "is-open", className)}
      style={color ? ({ "--cbb-folder": color } as CSSProperties) : undefined}
    >
      <div className="cbb-folder__body">
        <span className="cbb-folder__tab" aria-hidden="true" />
        <span className="cbb-folder__back" aria-hidden="true" />
        {shown.map((it, i) => (
          <button
            key={it.id}
            type="button"
            className="cbb-folder__paper"
            style={
              {
                "--i": i,
                "--n": shown.length,
                "--x": `${shown.length === 1 ? 31 : 4 + (i * 58) / (shown.length - 1)}%`,
                "--zi": 1 + shown.length - Math.abs(i - (shown.length - 1) / 2),
              } as CSSProperties
            }
            disabled={!isOpen || !it.onClick}
            tabIndex={isOpen && it.onClick ? 0 : -1}
            onClick={it.onClick}
          >
            <b>{it.label}</b>
            {it.meta != null && <small>{it.meta}</small>}
          </button>
        ))}
        <button type="button" className="cbb-folder__front" aria-expanded={isOpen} onClick={toggle}>
          <span>{label}</span>
          <small>{countLabel(items.length)}</small>
        </button>
      </div>
    </div>
  );
}
