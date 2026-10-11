import { useId, useState, type KeyboardEvent, type ReactNode } from "react";
import { cn } from "../lib/cn";

export interface ChartDatum {
  /** Popisek na ose X (měsíc, kategorie…). */
  label: string;
  /** Hodnota bodu / sloupce. */
  value: number;
}

export interface ChartProps {
  /** Data grafu – jeden objekt na bod nebo sloupec. */
  data: ChartDatum[];
  /** Výška grafu v px (šířka se přizpůsobí rodiči). */
  height?: number;
  /** Formátování hodnot v tooltipu (např. `(v) => v + " Kč"`). Osa Y používá vždy zkrácený zápis (12 tis.). */
  format?: (v: number) => string;
  /** Přístupný popis grafu pro čtečky obrazovky (výchozí se složí z názvu a hodnot). */
  "aria-label"?: string;
  /** Vlastní CSS třída přidaná ke kořenovému prvku. */
  className?: string;
}

const W = 600;
const PAD = 32; // okraje nahoře, vpravo a dole
const PAD_L = 52; // vlevo – místo pro hodnoty osy Y
const TICKS = [0.25, 0.5, 0.75, 1];
/** Zaokrouhlí maximum nahoru tak, aby čtyři čáry mřížky padly na „hezká“ čísla (1, 2, 2.5, 5 × 10^n). */
function niceMax(v: number) {
  const raw = Math.max(v, 1) / 4;
  const mag = 10 ** Math.floor(Math.log10(raw));
  const n = raw / mag;
  return (n <= 1 ? 1 : n <= 2 ? 2 : n <= 2.5 ? 2.5 : n <= 5 ? 5 : 10) * mag * 4;
}
const compact = (v: number) => new Intl.NumberFormat("cs-CZ", { notation: "compact", maximumFractionDigits: 1 }).format(v);

function useHover(count: number) {
  const [hover, setHover] = useState<number | null>(null);
  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "ArrowRight") setHover((h) => Math.min(count - 1, (h ?? -1) + 1));
    else if (e.key === "ArrowLeft") setHover((h) => Math.max(0, (h ?? count) - 1));
    else if (e.key === "Escape") setHover(null);
    else return;
    e.preventDefault();
  };
  return { hover, setHover, onKeyDown };
}

interface FrameProps {
  data: ChartDatum[];
  height: number;
  max: number;
  /** x souřadnice středu bodu / sloupce */
  x: (i: number) => number;
  /** šířka zásahové oblasti jednoho bodu */
  slot: number;
  format: (v: number) => string;
  label: string;
  cursor?: boolean;
  hover: number | null;
  setHover: (i: number | null) => void;
  onKeyDown: (e: KeyboardEvent) => void;
  legend?: ReactNode;
  children: ReactNode;
}

function Frame({ data, height, max, x, slot, format, label, cursor, hover, setHover, onKeyDown, legend, children }: FrameProps) {
  const h = hover !== null ? data[hover] : undefined;
  const pct = hover !== null ? Math.min(88, Math.max(12, (x(hover) / W) * 100)) : 0;
  const every = Math.max(1, Math.ceil(data.length / Math.floor((W - PAD_L - PAD) / 64)));
  const base = height - PAD;
  return (
    <div className="cbb-chart__wrap">
      <svg
        viewBox={`0 0 ${W} ${height}`}
        className="cbb-chart__svg"
        role="img"
        aria-label={label}
        tabIndex={0}
        onMouseLeave={() => setHover(null)}
        onKeyDown={onKeyDown}
        onBlur={() => setHover(null)}
      >
        <line className="cbb-chart__base" x1={PAD_L} x2={W - PAD} y1={base} y2={base} />
        {TICKS.map((t) => {
          const y = PAD + (1 - t) * (height - PAD * 2);
          return (
            <g key={t}>
              <line className="cbb-chart__grid" x1={PAD_L} x2={W - PAD} y1={y} y2={y} />
              <text className="cbb-chart__axis" x={PAD_L - 8} y={y + 4} textAnchor="end">
                {compact(max * t)}
              </text>
            </g>
          );
        })}
        {cursor && hover !== null && <line className="cbb-chart__cursor" x1={x(hover)} x2={x(hover)} y1={PAD} y2={base} />}
        {children}
        {data.map((d, i) => (
          <g key={`${d.label}-${i}`}>
            {i % every === 0 && (
              <text className="cbb-chart__axis" x={x(i)} y={height - 10} textAnchor="middle">
                {d.label}
              </text>
            )}
            <rect x={x(i) - slot / 2} y={0} width={slot} height={height} fill="transparent" onMouseEnter={() => setHover(i)} onMouseMove={() => setHover(i)} />
          </g>
        ))}
      </svg>
      {h && (
        <div className="cbb-chart__tip" style={{ left: `${pct}%` }} role="status">
          <small>{h.label}</small>
          <b>{format(h.value)}</b>
        </div>
      )}
      {legend}
      <table className="cbb-chart__sr">
        <tbody>
          {data.map((d, i) => (
            <tr key={i}>
              <th scope="row">{d.label}</th>
              <td>{format(d.value)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const describe = (name: string, data: ChartDatum[], f: (v: number) => string, custom?: string) =>
  custom ?? `${name}: ${data.map((d) => `${d.label} ${f(d.value)}`).join(", ")}`;

/** Plošný graf (area) – vývoj hodnoty v čase s výplní pod křivkou. */
export function AreaChart({ data, height = 240, className, format = compact, "aria-label": ariaLabel }: ChartProps) {
  const id = useId().replace(/:/g, "");
  const { hover, setHover, onKeyDown } = useHover(data.length);
  const max = niceMax(Math.max(...data.map((d) => d.value), 1));
  const x = (i: number) => PAD_L + (i * (W - PAD_L - PAD)) / Math.max(data.length - 1, 1);
  const y = (v: number) => height - PAD - (v / max) * (height - PAD * 2);
  const line = data.map((d, i) => `${i ? "L" : "M"}${x(i)},${y(d.value)}`).join(" ");
  const slot = (W - PAD_L - PAD) / Math.max(data.length - 1, 1);
  return (
    <div className={cn("cbb-chart", className)}>
      <Frame data={data} height={height} max={max} x={x} slot={slot} format={format} cursor hover={hover} setHover={setHover} onKeyDown={onKeyDown} label={describe("Plošný graf", data, format, ariaLabel)}>
        <defs>
          <linearGradient id={id} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="var(--cbb-accent)" stopOpacity=".4" />
            <stop offset="1" stopColor="var(--cbb-accent)" stopOpacity="0" />
          </linearGradient>
        </defs>
        {data.length > 0 && <path d={`${line} L${x(data.length - 1)},${height - PAD} L${x(0)},${height - PAD} Z`} fill={`url(#${id})`} />}
        <path d={line} className="cbb-chart__line" />
        {hover !== null && data[hover] && <circle cx={x(hover)} cy={y(data[hover].value)} r={5} className="cbb-chart__dot" />}
      </Frame>
    </div>
  );
}

export interface LineChartProps extends ChartProps {
  /** Druhá řada pro srovnání (např. loňský rok) – vykreslí se čárkovaně, body odpovídají `data` podle pořadí. */
  compare?: ChartDatum[];
  /** Název hlavní řady do legendy (zobrazí se jen s `compare`). */
  seriesLabel?: string;
  /** Název srovnávací řady do legendy. */
  compareLabel?: string;
}

/** Spojnicový graf (line) – volitelně se srovnávací řadou. */
export function LineChart({ data, compare, seriesLabel = "Tento rok", compareLabel = "Minulý rok", height = 240, className, format = compact, "aria-label": ariaLabel }: LineChartProps) {
  const { hover, setHover, onKeyDown } = useHover(data.length);
  const cmp = compare?.slice(0, data.length);
  const max = niceMax(Math.max(...data.map((d) => d.value), ...(cmp ?? []).map((d) => d.value), 1));
  const x = (i: number) => PAD_L + (i * (W - PAD_L - PAD)) / Math.max(data.length - 1, 1);
  const y = (v: number) => height - PAD - (v / max) * (height - PAD * 2);
  const path = (d: ChartDatum[]) => d.map((p, i) => `${i ? "L" : "M"}${x(i)},${y(p.value)}`).join(" ");
  const slot = (W - PAD_L - PAD) / Math.max(data.length - 1, 1);
  const legend = cmp && (
    <ul className="cbb-chart__legend">
      <li><i className="cbb-chart__swatch" />{seriesLabel}</li>
      <li><i className="cbb-chart__swatch is-muted" />{compareLabel}</li>
    </ul>
  );
  return (
    <div className={cn("cbb-chart", className)}>
      <Frame data={data} height={height} max={max} x={x} slot={slot} format={format} cursor hover={hover} setHover={setHover} onKeyDown={onKeyDown} legend={legend} label={describe("Spojnicový graf", data, format, ariaLabel)}>
        {cmp && <path d={path(cmp)} className="cbb-chart__line is-muted" />}
        <path d={path(data)} className="cbb-chart__line" />
        {data.map((d, i) => (
          <circle key={i} cx={x(i)} cy={y(d.value)} r={hover === i ? 6 : 3.5} className="cbb-chart__dot" />
        ))}
      </Frame>
    </div>
  );
}

/** Sloupcový graf (bar). */
export function BarChart({ data, height = 240, className, format = compact, "aria-label": ariaLabel }: ChartProps) {
  const { hover, setHover, onKeyDown } = useHover(data.length);
  const max = niceMax(Math.max(...data.map((d) => d.value), 1));
  const step = (W - PAD_L - PAD) / Math.max(data.length, 1);
  const x = (i: number) => PAD_L + step * i + step / 2;
  return (
    <div className={cn("cbb-chart", className)}>
      <Frame data={data} height={height} max={max} x={x} slot={step} format={format} hover={hover} setHover={setHover} onKeyDown={onKeyDown} label={describe("Sloupcový graf", data, format, ariaLabel)}>
        {data.map((d, i) => {
          const h = (d.value / max) * (height - PAD * 2);
          return <rect key={i} className={cn("cbb-chart__bar", hover === i && "is-hover")} x={x(i) - Math.min(step * 0.3, 28)} width={Math.min(step * 0.6, 56)} y={height - PAD - h} height={h} rx={4} />;
        })}
      </Frame>
    </div>
  );
}

export interface RadarChartProps extends Omit<ChartProps, "height"> {
  /** Hodnota, která odpovídá okraji grafu (výchozí 100). */
  max?: number;
  /** Velikost grafu v px (je čtvercový). */
  size?: number;
}

/** Pavučinový graf (radar) – hodnoty 0 až `max`, hodí se pro profil dovedností. */
export function RadarChart({ data, max = 100, size = 280, className, format = String, "aria-label": ariaLabel }: RadarChartProps) {
  const [hover, setHover] = useState<number | null>(null);
  const c = size / 2;
  const r = c - 40;
  const n = Math.max(data.length, 1);
  const pt = (i: number, v: number) => {
    const a = (Math.PI * 2 * i) / n - Math.PI / 2;
    return [c + Math.cos(a) * r * v, c + Math.sin(a) * r * v] as const;
  };
  const poly = (f: (i: number) => number) => data.map((_, i) => pt(i, f(i)).join(",")).join(" ");
  const ratio = (v: number) => Math.min(1, Math.max(0, v / max));
  return (
    <div className={cn("cbb-chart cbb-chart--radar", className)}>
      <svg viewBox={`0 0 ${size} ${size}`} className="cbb-chart__svg" role="img" aria-label={describe("Radar graf", data, format, ariaLabel)} onMouseLeave={() => setHover(null)}>
        {TICKS.map((t) => (
          <polygon key={t} points={poly(() => t)} className="cbb-chart__grid" fill="none" />
        ))}
        {data.map((d, i) => {
          const [ex, ey] = pt(i, 1);
          const [lx, ly] = pt(i, 1.2);
          return (
            <g key={`${d.label}-${i}`}>
              <line x1={c} y1={c} x2={ex} y2={ey} className="cbb-chart__grid" />
              <text x={lx} y={ly} className="cbb-chart__axis" textAnchor="middle" dominantBaseline="middle">
                {d.label}
              </text>
            </g>
          );
        })}
        <polygon points={poly((i) => ratio(data[i]?.value ?? 0))} className="cbb-chart__radar" />
        {data.map((d, i) => {
          const [px, py] = pt(i, ratio(d.value));
          return (
            <g key={i}>
              <circle cx={px} cy={py} r={hover === i ? 6 : 4} className="cbb-chart__dot" />
              <circle cx={px} cy={py} r={14} fill="transparent" onMouseEnter={() => setHover(i)}>
                <title>{`${d.label}: ${format(d.value)}`}</title>
              </circle>
            </g>
          );
        })}
      </svg>
      {hover !== null && data[hover] && (
        <div className="cbb-chart__tip is-radar" role="status">
          <small>{data[hover].label}</small>
          <b>{format(data[hover].value)}</b>
        </div>
      )}
    </div>
  );
}
