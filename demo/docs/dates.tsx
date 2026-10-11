import { useState } from "react";
import { DatePicker, DateTimePicker, Calendar, DateRangePicker, type DateRange } from "../../src";
import { Row, Col } from "../ui";
import type { Doc } from "./types";

const fmt = (d: Date | null | undefined) => (d ? d.toLocaleDateString("cs-CZ") : "—");

function DateDemo() {
  const [d, setD] = useState<string | null>("2026-10-01T00:00:00.000Z");
  return (
    <Col width={340}>
      <DatePicker value={d} onChange={setD} />
      <span className="demo-muted demo-mono">{d ? new Date(d).toLocaleDateString("cs-CZ") : "nic nevybráno"}</span>
    </Col>
  );
}
function DateTimeDemo() {
  const [d, setD] = useState<string | null>("2026-10-01T14:30:00.000Z");
  return (
    <Col width={340}>
      <DateTimePicker value={d} onChange={setD} />
      <span className="demo-muted demo-mono">{d}</span>
    </Col>
  );
}
function CalendarDemo() {
  const [d, setD] = useState<Date | null>(new Date());
  const [r, setR] = useState<DateRange>({ from: new Date(new Date().getFullYear(), new Date().getMonth(), 8), to: new Date(new Date().getFullYear(), new Date().getMonth(), 14) });
  return (
    <Row gap={32} align="flex-start">
      <Col width={300} gap={8}>
        <span className="demo-eyebrow">mode="single"</span>
        <Calendar selected={d} onSelect={setD} />
        <span className="demo-muted">Vybráno: {fmt(d)}</span>
      </Col>
      <Col width={320} gap={8}>
        <span className="demo-eyebrow">mode="range"</span>
        <Calendar mode="range" range={r} onRangeChange={setR} />
        <span className="demo-muted">{fmt(r.from)} – {fmt(r.to)}</span>
      </Col>
    </Row>
  );
}
function RangeDemo() {
  const [r, setR] = useState<DateRange>({ from: null, to: null });
  return (
    <Col width={360}>
      <DateRangePicker value={r} onChange={setR} />
      <span className="demo-muted">{r.from ? `${fmt(r.from)} – ${fmt(r.to)}` : "Klikni do pole a vyber první a poslední den."}</span>
    </Col>
  );
}

export const DATE_DOCS: Doc[] = [
  {
    id: "datepicker",
    name: "DatePicker",
    desc: "Výběr samotného data. Kolečko měsíc / rok se otevře klikem na nadpis, panel se vždy vykreslí nad ostatním obsahem.",
    props: ["DatePicker"],
    preview: <DateDemo />,
    code: `const [date, setDate] = useState<string | null>(null);

<DatePicker value={date} onChange={setDate} />`,
  },
  {
    id: "datetimepicker",
    name: "DateTimePicker",
    desc: "Datum i čas – kalendář vlevo, kolečka hodin a minut vpravo. Vrací ISO řetězec. Čeština je výchozí.",
    props: ["DateTimePicker"],
    preview: <DateTimeDemo />,
    code: `const [date, setDate] = useState<string | null>(null);

<DateTimePicker value={date} onChange={setDate} />`,
  },
  {
    id: "calendar",
    name: "Calendar",
    desc: <>Samostatný kalendář – jedno datum, nebo rozsah od–do. V režimu <code>range</code> první klik nastaví začátek, druhý konec a mezi nimi se vykreslí pás (při najíždění už před kliknutím).</>,
    props: ["Calendar", { type: "DateRange", title: "DateRange" }],
    preview: <CalendarDemo />,
    code: `const [range, setRange] = useState<DateRange>({ from: null, to: null });

<Calendar selected={date} onSelect={setDate} />
<Calendar mode="range" range={range} onRangeChange={setRange} months={2} />`,
  },
  {
    id: "daterangepicker",
    name: "DateRangePicker",
    desc: "Pole s rozbalovacím kalendářem na dva měsíce pro výběr rozsahu dat (dovolená, filtr statistik). Na mobilu zůstane jeden měsíc.",
    props: ["DateRangePicker"],
    preview: <RangeDemo />,
    code: `const [range, setRange] = useState<DateRange>({ from: null, to: null });

<DateRangePicker value={range} onChange={setRange} min={new Date()} />`,
  },
];
