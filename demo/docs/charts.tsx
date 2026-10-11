import { useState } from "react";
import { AreaChart, LineChart, BarChart, RadarChart, PaymentSummary, PromoQRCard, Button, type ChartDatum, type PaymentLine } from "../../src";
import { Col } from "../ui";
import type { Doc } from "./types";

const MONTHS = ["Led", "Úno", "Bře", "Dub", "Kvě", "Čvn", "Čvc", "Srp"];
const SALES: ChartDatum[] = MONTHS.map((label, i) => ({ label, value: [12, 18, 15, 24, 31, 28, 38, 44][i]! * 1000 }));
const LAST: ChartDatum[] = MONTHS.map((label, i) => ({ label, value: [9, 11, 16, 14, 19, 22, 25, 27][i]! * 1000 }));
const SKILLS: ChartDatum[] = [
  { label: "React", value: 90 }, { label: "TypeScript", value: 80 }, { label: "CSS", value: 85 },
  { label: "Python", value: 70 }, { label: "SQL", value: 60 }, { label: "Design", value: 75 },
];
const kc = (v: number) => `${Math.round(v).toLocaleString("cs-CZ")} Kč`;

const LINES: PaymentLine[] = [
  { id: "1", label: "Tvorba webu", detail: "Landing page + CMS", price: 18000 },
  { id: "2", label: "Hosting", detail: "12 měsíců", price: 1200, qty: 2 },
  { id: "3", label: "Logo", price: 3500 },
];
function PayDemo() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Zobrazit rekapitulaci</Button>
      <PaymentSummary open={open} onClose={() => setOpen(false)} orderId="2026-0142" lines={LINES} discount={2000} />
    </>
  );
}

export const CHART_DOCS: Doc[] = [
  {
    id: "areachart", name: "AreaChart",
    desc: "Plošný graf s výplní pod křivkou. Po najetí (nebo šipkami na klávesnici po zaostření) ukáže hodnotu bodu. Každý graf má skrytou tabulku pro čtečky obrazovky.",
    props: ["AreaChart", { type: "ChartDatum", title: "ChartDatum" }],
    block: true,
    preview: <AreaChart data={SALES} format={kc} />,
    code: `<AreaChart
  data={[{ label: "Led", value: 12000 }, { label: "Úno", value: 18000 }]}
  format={(v) => v.toLocaleString("cs-CZ") + " Kč"}
/>`,
  },
  {
    id: "linechart", name: "LineChart",
    desc: "Spojnicový graf. S parametrem compare přidá srovnávací řadu (čárkovaná, s legendou) – řady se párují podle pořadí bodů.",
    props: ["LineChart"],
    block: true,
    preview: <LineChart data={SALES} compare={LAST} format={kc} />,
    code: `<LineChart data={thisYear} compare={lastYear} seriesLabel="2026" compareLabel="2025" />`,
  },
  {
    id: "barchart", name: "BarChart",
    desc: "Sloupcový graf pro porovnání kategorií.",
    props: ["BarChart"],
    block: true,
    preview: <BarChart data={SALES} format={kc} />,
    code: `<BarChart data={data} height={260} />`,
  },
  {
    id: "radarchart", name: "RadarChart",
    desc: "Pavučinový graf pro profil dovedností nebo srovnání více vlastností. Hodnota max odpovídá okraji grafu.",
    props: ["RadarChart"],
    preview: <Col width={320}><RadarChart data={SKILLS} max={100} /></Col>,
    code: `<RadarChart data={[{ label: "React", value: 90 }, { label: "CSS", value: 85 }]} max={100} />`,
  },
  {
    id: "paymentsummary", name: "PaymentSummary",
    desc: "Dialog s rekapitulací objednávky: položky, sleva, DPH (jen vypočtené z ceny, ceny jsou včetně DPH) a tlačítko k zaplacení. Postavený na Dialogu, takže zamyká scroll a zavírá se Esc.",
    props: ["PaymentSummary", { type: "PaymentLine", title: "PaymentLine" }],
    preview: <PayDemo />,
    code: `<PaymentSummary
  open={open}
  onClose={() => setOpen(false)}
  onConfirm={pay}
  orderId="2026-0142"
  lines={[{ id: "1", label: "Tvorba webu", price: 18000 }, { id: "2", label: "Hosting", price: 1200, qty: 2 }]}
  discount={2000}
/>`,
  },
  {
    id: "promoqrcard", name: "PromoQRCard",
    desc: <>Vstupenka nebo kupón s perforací. Bez <code>children</code> ukazuje jen dekorativní vzor z textu kódu (nenaskenuje se) – pro skutečný QR sem vlož vlastní obrázek.</>,
    props: ["PromoQRCard"],
    preview: <PromoQRCard eyebrow="VSTUPENKA" title="Code by Barca Meetup" subtitle="12. 11. 2026 · Praha" code="CBB-2026-0042" />,
    code: `<PromoQRCard title="Code by Barca Meetup" subtitle="12. 11. 2026 · Praha" code="CBB-2026-0042" />

// se skutečným QR
<PromoQRCard title="…" code="…"><img src={qrUrl} alt="QR kód" /></PromoQRCard>`,
  },
];
