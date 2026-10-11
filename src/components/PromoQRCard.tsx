import { useMemo, type ReactNode } from "react";
import { cn } from "../lib/cn";

export interface PromoQRCardProps {
  /** Malý nadpis nad názvem (druh vstupenky / kupónu). */
  eyebrow?: ReactNode;
  /** Hlavní název. */
  title: ReactNode;
  /** Doplňující řádek (datum, místo, platnost). */
  subtitle?: ReactNode;
  /** Kód vstupenky / kupónu – zobrazí se pod názvem a z něj se vygeneruje dekorativní vzor. */
  code: string;
  /**
   * Vlastní obsah místo dekorativního vzoru – sem patří skutečný QR kód
   * (obrázek nebo komponenta z knihovny na QR). Bez něj je vzor jen ozdoba, nejde naskenovat.
   */
  children?: ReactNode;
  /** Přístupný popis kódu (výchozí „QR kód …“). */
  qrLabel?: string;
  /** Vlastní CSS třída přidaná ke kořenovému prvku. */
  className?: string;
}

const N = 21;

/** Deterministický dekorativní vzor z textu – stejný kód dá vždy stejný obrázek. */
function pattern(code: string) {
  let h = 2166136261;
  for (const c of code) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  const rects: [number, number][] = [];
  const inFinder = (x: number, y: number) =>
    [[0, 0], [N - 7, 0], [0, N - 7]].some(([fx, fy]) => x >= fx! && x < fx! + 7 && y >= fy! && y < fy! + 7);
  for (let i = 0; i < N * N; i++) {
    h = Math.imul(h ^ (h >>> 13), 1274126177);
    const on = (h & 3) === 0 || (h & 5) === 1;
    const x = i % N;
    const y = Math.floor(i / N);
    if (inFinder(x, y)) {
      const lx = x < 7 ? x : x - (N - 7);
      const ly = y < 7 ? y : y - (N - 7);
      const ring = lx === 0 || ly === 0 || lx === 6 || ly === 6;
      const core = lx >= 2 && lx <= 4 && ly >= 2 && ly <= 4;
      if (ring || core) rects.push([x, y]);
    } else if (on) rects.push([x, y]);
  }
  return rects;
}

/** Vstupenka / kupón s perforací a QR kódem. Bez `children` ukazuje dekorativní (nenaskenovatelný) vzor. */
export function PromoQRCard({ eyebrow = "VSTUPENKA", title, subtitle, code, children, qrLabel, className }: PromoQRCardProps) {
  const rects = useMemo(() => pattern(code), [code]);
  return (
    <div className={cn("cbb-qrcard", className)}>
      <div className="cbb-qrcard__info">
        <span>{eyebrow}</span>
        <h3>{title}</h3>
        {subtitle && <p>{subtitle}</p>}
        <b>{code}</b>
      </div>
      <div className="cbb-qrcard__perf" aria-hidden="true" />
      <div className="cbb-qrcard__qr">
        {children ?? (
          <svg viewBox={`0 0 ${N} ${N}`} role="img" aria-label={qrLabel ?? `QR kód ${code}`} shapeRendering="crispEdges">
            {rects.map(([x, y]) => (
              <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} />
            ))}
          </svg>
        )}
      </div>
    </div>
  );
}
