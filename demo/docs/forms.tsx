import { useState } from "react";
import {
  Input, Textarea, Select, Field, Checkbox, Radio, Switch, Slider, TagInput, InputOTP, FileUpload, DateTimePicker,
  ContactForm, Toggle, ToggleGroup, toast,
} from "../../src";
import { Row, Col } from "../ui";
import type { Category } from "./types";

function FieldsDemo() {
  const [email, setEmail] = useState("ahoj@");
  const bad = !/^\S+@\S+\.\S+$/.test(email);
  return (
    <div className="demo-grid2">
      <Input label="Jméno" placeholder="Barbora" hint="Jak ti mám říkat?" />
      <Input label="E-mail" type="email" value={email} onChange={(e) => setEmail(e.target.value)} error={bad ? "Zadej platný e-mail" : undefined} />
      <Select label="Typ projektu" defaultValue="web" options={[{ value: "web", label: "Web" }, { value: "app", label: "Aplikace" }, { value: "3d", label: "3D model", disabled: true }]} />
      <Field label="Vlastní ovládací prvek" hint="Field obalí cokoli – přidá popisek, nápovědu a chybu.">
        <Input placeholder="Hledat…" aria-label="Hledat" />
      </Field>
      <div style={{ gridColumn: "1 / -1" }}><Textarea label="Zpráva" rows={3} placeholder="Napiš mi něco o projektu…" /></div>
    </div>
  );
}
function CheckboxDemo() {
  const [a, setA] = useState(true);
  const [b, setB] = useState(false);
  return (
    <Col gap={12}>
      <Checkbox checked={a} onChange={setA} label="Souhlasím se zpracováním údajů" description="Podle zásad GDPR." />
      <Checkbox checked={b} onChange={setB} label="Odebírat novinky" />
      <Checkbox indeterminate label="Vybrat vše (částečně)" />
      <Checkbox disabled label="Neaktivní" />
    </Col>
  );
}
function RadioDemo() {
  const [v, setV] = useState("cs");
  return (
    <Col>
      <Radio value={v} onChange={setV} aria-label="Jazyk" options={[{ value: "cs", label: "Čeština" }, { value: "en", label: "English", description: "Překlad zatím neúplný" }, { value: "de", label: "Deutsch", disabled: true }]} />
      <Radio orientation="horizontal" value={v} onChange={setV} name="lang2" aria-label="Jazyk vodorovně" options={[{ value: "cs", label: "CZ" }, { value: "en", label: "EN" }]} />
    </Col>
  );
}
function SwitchDemo() {
  const [a, setA] = useState(true);
  const [b, setB] = useState(false);
  return (
    <Col gap={14}>
      <Switch checked={a} onChange={setA} label="Zobrazit na webu" description="Vypnuto = projekt je skrytý" />
      <Switch checked={b} onChange={setB} label="Work in progress" />
    </Col>
  );
}
function SliderDemo() {
  const [v, setV] = useState(70);
  const [p, setP] = useState(24);
  return (
    <Col width={420} gap={20}>
      <Slider label="Průhlednost hlavičky" value={v} onChange={setV} formatValue={(x) => `${x} %`} />
      <Slider label="Velikost" value={p} onChange={setP} min={12} max={48} step={2} formatValue={(x) => `${x}px`} />
    </Col>
  );
}
function TagDemo() {
  const [tags, setTags] = useState(["React", "Arduino"]);
  return <Col width={420}><TagInput label="Tagy" tags={tags} onChange={setTags} placeholder="Napiš tag a stiskni Enter…" maxTags={6} /></Col>;
}
function OtpDemo() {
  const [v, setV] = useState("");
  return (
    <Col gap={12}>
      <InputOTP value={v} onChange={setV} length={6} separator onComplete={(c) => toast.success(`Kód ${c} přijat`)} />
      <span className="demo-muted">Zadej libovolných 6 číslic{v ? ` – zatím: ${v}` : ""}</span>
    </Col>
  );
}
function UploadDemo() {
  return (
    <Col width={460}>
      <FileUpload label="Přílohy" hint="PNG nebo JPG, max 2 MB" accept="image/*" maxSize="2MB" multiple onUpload={(f) => toast.info(`Nahráno souborů: ${f.length}`)} />
    </Col>
  );
}
function DateDemo() {
  const [d, setD] = useState<string | null>("2026-10-01T14:30:00.000Z");
  return (
    <Col width={340}>
      <DateTimePicker value={d} onChange={setD} />
      <span className="demo-muted" style={{ fontFamily: "var(--cbb-font-mono)", fontSize: 12 }}>{d}</span>
    </Col>
  );
}
function ToggleDemo() {
  const [bold, setBold] = useState(true);
  const [italic, setItalic] = useState(false);
  const [view, setView] = useState("grid");
  return (
    <Row gap={24}>
      <Row gap={6}>
        <Toggle pressed={bold} onChange={setBold} aria-label="Tučně"><b>B</b></Toggle>
        <Toggle pressed={italic} onChange={setItalic} aria-label="Kurzíva"><i>I</i></Toggle>
      </Row>
      <ToggleGroup aria-label="Zobrazení" value={view} onChange={setView} items={[{ value: "grid", label: "Mřížka" }, { value: "list", label: "Seznam" }, { value: "map", label: "Mapa", disabled: true }]} />
    </Row>
  );
}

export const forms: Category = {
  id: "formulare",
  title: "Formuláře",
  docs: [
    {
      id: "input",
      name: "Input / Textarea / Select / Field",
      desc: "Textová pole s popiskem, nápovědou a chybou. Field obalí libovolný vlastní prvek.",
      props: [{ type: "InputProps", component: "Input" }, { type: "TextareaProps", component: "Textarea" }, { type: "SelectProps", component: "Select" }, { type: "FieldProps", component: "Field" }],
      preview: <FieldsDemo />,
      code: `import { Input, Textarea, Select, Field } from "code-by-barca-ui";

<Input label="Jméno" placeholder="Barbora" hint="Jak ti mám říkat?" />
<Input label="E-mail" type="email" error="Zadej platný e-mail" />
<Select label="Typ projektu" options={[{ value: "web", label: "Web" }, { value: "app", label: "Aplikace" }]} />
<Textarea label="Zpráva" rows={3} />

<Field label="Vlastní prvek" hint="Field přidá popisek, nápovědu a chybu.">
  <MyControl />
</Field>`,
    },
    {
      id: "checkbox",
      name: "Checkbox",
      desc: "Zaškrtávací pole s popiskem, popisem a stavem „částečně“.",
      props: ["Checkbox"],
      preview: <CheckboxDemo />,
      code: `const [ok, setOk] = useState(true);

<Checkbox checked={ok} onChange={setOk} label="Souhlasím se zpracováním údajů" description="Podle zásad GDPR." />
<Checkbox indeterminate label="Vybrat vše" />`,
    },
    {
      id: "radio",
      name: "Radio",
      desc: "Skupina přepínačů z pole options. Funguje s šipkami na klávesnici.",
      props: ["Radio"],
      preview: <RadioDemo />,
      code: `const [lang, setLang] = useState("cs");

<Radio
  value={lang}
  onChange={setLang}
  aria-label="Jazyk"
  options={[
    { value: "cs", label: "Čeština" },
    { value: "en", label: "English", description: "Překlad zatím neúplný" },
    { value: "de", label: "Deutsch", disabled: true },
  ]}
/>`,
    },
    {
      id: "switch",
      name: "Switch",
      desc: "Přepínač zapnuto / vypnuto.",
      props: ["Switch"],
      preview: <SwitchDemo />,
      code: `const [on, setOn] = useState(true);

<Switch checked={on} onChange={setOn} label="Zobrazit na webu" description="Vypnuto = projekt je skrytý" />`,
    },
    {
      id: "slider",
      name: "Slider",
      desc: "Posuvník s volitelným formátem hodnoty.",
      props: ["Slider"],
      preview: <SliderDemo />,
      code: `const [v, setV] = useState(70);

<Slider label="Průhlednost" value={v} onChange={setV} formatValue={(x) => \`\${x} %\`} />`,
    },
    {
      id: "taginput",
      name: "TagInput",
      desc: "Zadávání tagů klávesou Enter, mazání Backspacem nebo křížkem.",
      props: ["TagInput"],
      preview: <TagDemo />,
      code: `const [tags, setTags] = useState(["React"]);

<TagInput label="Tagy" tags={tags} onChange={setTags} maxTags={6} />`,
    },
    {
      id: "inputotp",
      name: "InputOTP",
      desc: "Jednorázový kód po znacích – podporuje vložení ze schránky a šipky.",
      props: ["InputOTP"],
      preview: <OtpDemo />,
      code: `const [code, setCode] = useState("");

<InputOTP value={code} onChange={setCode} length={6} separator onComplete={verify} />`,
    },
    {
      id: "fileupload",
      name: "FileUpload",
      desc: "Drag & drop zóna s kontrolou velikosti. Soubory ti vrátí v onUpload – nahrání řešíš sama.",
      props: ["FileUpload"],
      preview: <UploadDemo />,
      code: `<FileUpload
  label="Přílohy"
  hint="PNG nebo JPG, max 2 MB"
  accept="image/*"
  maxSize="2MB"
  multiple
  onUpload={(files) => upload(files)}
/>`,
    },
    {
      id: "datetimepicker",
      name: "DateTimePicker",
      desc: "Výběr data a času s kolečky – vrací ISO řetězec. Čeština je výchozí.",
      props: ["DateTimePicker"],
      preview: <DateDemo />,
      code: `const [date, setDate] = useState<string | null>(null);

<DateTimePicker value={date} onChange={setDate} />`,
    },
    {
      id: "contactform",
      name: "ContactForm",
      desc: "Hotový kontaktní formulář s validací, honeypotem proti robotům a stavy odeslání. Odeslání (mailto, API) řešíš v onSubmit.",
      props: ["ContactForm"],
      block: true,
      preview: <div style={{ maxWidth: 480 }}><ContactForm onSubmit={async (v) => { await new Promise((r) => setTimeout(r, 600)); toast.success(`Zpráva od ${v.name} odeslána`); }} /></div>,
      code: `<ContactForm
  onSubmit={async ({ name, email, message }) => {
    window.location.href = \`mailto:me@example.cz?subject=\${encodeURIComponent(name)}&body=\${encodeURIComponent(message)}\`;
  }}
  labels={{ submit: "Odeslat" }}
/>`,
    },
    {
      id: "toggle",
      name: "Toggle / ToggleGroup",
      desc: "Tlačítko se stavem (tučné písmo) a skupina pro výběr jedné možnosti (zobrazení).",
      props: [{ type: "ToggleProps", component: "Toggle" }, { type: "ToggleGroupProps", component: "ToggleGroup" }],
      preview: <ToggleDemo />,
      code: `<Toggle pressed={bold} onChange={setBold} aria-label="Tučně"><b>B</b></Toggle>

<ToggleGroup
  value={view}
  onChange={setView}
  aria-label="Zobrazení"
  items={[{ value: "grid", label: "Mřížka" }, { value: "list", label: "Seznam" }]}
/>`,
    },
  ],
};

