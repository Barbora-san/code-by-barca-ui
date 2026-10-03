import {
  Button, Badge, Tag, Chip, Kbd, Divider, Typewriter, Reveal, SectionHeading,
  PlusIcon, GithubIcon, SendIcon, CheckIcon, SparklesIcon, TagIcon,
  ChevronRightIcon, ChevronLeftIcon, ChevronDownIcon, ChevronUpIcon, ArrowDownIcon, XIcon, MenuIcon, CopyIcon, MailIcon,
  MapPinIcon, InfoIcon, AlertTriangleIcon, CheckCircleIcon, XCircleIcon, ExternalLinkIcon, CookieIcon, SearchIcon,
  SlidersIcon, ArrowUpDownIcon, HashIcon, LayersIcon, HomeIcon, UserIcon, SettingsIcon, FolderIcon, BellIcon, MoreIcon,
  CodeIcon, PaletteIcon, PanelLeftIcon,
} from "../../src";
import { useState } from "react";
import { Row, Col } from "../ui";
import type { Category } from "./types";

const ICONS = {
  ChevronRightIcon, ChevronLeftIcon, ChevronDownIcon, ChevronUpIcon, ArrowDownIcon, CheckIcon, XIcon, MenuIcon, CopyIcon,
  MailIcon, MapPinIcon, SendIcon, InfoIcon, AlertTriangleIcon, CheckCircleIcon, XCircleIcon, GithubIcon, ExternalLinkIcon,
  SparklesIcon, CookieIcon, SearchIcon, SlidersIcon, ArrowUpDownIcon, TagIcon, HashIcon, LayersIcon, HomeIcon, UserIcon,
  SettingsIcon, FolderIcon, BellIcon, MoreIcon, PlusIcon, CodeIcon, PaletteIcon, PanelLeftIcon,
};

function ChipDemo() {
  const [chips, setChips] = useState(["React", "Next.js", "TypeScript"]);
  return (
    <Row>
      {chips.map((c) => <Chip key={c} onRemove={() => setChips((l) => l.filter((x) => x !== c))}>{c}</Chip>)}
      {chips.length === 0 && <Button size="sm" variant="soft" onClick={() => setChips(["React", "Next.js", "TypeScript"])}>Obnovit</Button>}
    </Row>
  );
}

function ButtonLoading() {
  const [loading, setLoading] = useState(false);
  return (
    <Button
      loading={loading}
      leftIcon={<SendIcon size={16} />}
      onClick={() => { setLoading(true); setTimeout(() => setLoading(false), 1500); }}
    >
      Odeslat
    </Button>
  );
}

export const basics: Category = {
  id: "zaklady",
  title: "Základy",
  docs: [
    {
      id: "button",
      name: "Button",
      desc: "Tlačítko ve všech variantách. Když zadáš href, vykreslí se jako odkaz (interní cesty jdou přes CbbProvider).",
      props: ["Button"],
      preview: (
        <Col>
          <Row>
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="soft">Soft</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="link">Link</Button>
          </Row>
          <Row>
            <Button size="sm">Malé</Button>
            <Button size="md">Střední</Button>
            <Button size="lg" glow>Velké se zářím</Button>
            <Button leftIcon={<GithubIcon size={16} />} variant="outline">GitHub</Button>
            <Button rightIcon={<ChevronRightIcon size={16} />}>Dál</Button>
            <Button disabled>Neaktivní</Button>
            <ButtonLoading />
          </Row>
        </Col>
      ),
      code: `import { Button, GithubIcon } from "code-by-barca-ui";

<Button>Primary</Button>
<Button variant="outline" size="sm">Outline</Button>
<Button size="lg" glow>Velké se zářím</Button>
<Button variant="outline" leftIcon={<GithubIcon size={16} />}>GitHub</Button>
<Button loading>Odesílám…</Button>
<Button href="/projekty">Odkaz</Button>`,
    },
    {
      id: "badge",
      name: "Badge",
      desc: "Pill štítek pro stav, kategorii nebo počet. Tag je jeho jemnější varianta pro tagy projektů.",
      props: ["Badge", "Tag"],
      preview: (
        <Col>
          <Row>
            <Badge>default</Badge><Badge variant="secondary">secondary</Badge><Badge variant="outline">outline</Badge>
            <Badge variant="success" dot>volno</Badge><Badge variant="info">info</Badge><Badge variant="warning">warning</Badge><Badge variant="destructive">destructive</Badge>
            <Badge icon={<SparklesIcon size={12} />}>S ikonou</Badge>
          </Row>
          <Row><Tag>Next.js</Tag><Tag>Tailwind</Tag><Tag interactive>Interaktivní</Tag></Row>
        </Col>
      ),
      code: `import { Badge, Tag } from "code-by-barca-ui";

<Badge variant="success" dot>Volná kapacita</Badge>
<Badge variant="outline">outline</Badge>
<Tag>Next.js</Tag>
<Tag interactive>Interaktivní</Tag>`,
    },
    {
      id: "chip",
      name: "Chip",
      desc: "Odebíratelný štítek – aktivní filtry, vybrané hodnoty.",
      props: ["Chip"],
      preview: <ChipDemo />,
      code: `const [chips, setChips] = useState(["React", "Next.js"]);

{chips.map((c) => (
  <Chip key={c} onRemove={() => setChips((l) => l.filter((x) => x !== c))}>{c}</Chip>
))}`,
    },
    {
      id: "kbd",
      name: "Kbd",
      desc: "Klávesová zkratka v textu.",
      props: [],
      preview: <Row><span>Hledat:</span><Kbd>Ctrl</Kbd><span>+</span><Kbd>K</Kbd></Row>,
      code: `<Kbd>Ctrl</Kbd> + <Kbd>K</Kbd>`,
    },
    {
      id: "divider",
      name: "Divider",
      desc: "Oddělovač, volitelně s popiskem uprostřed nebo svislý.",
      props: ["Divider"],
      preview: (
        <Col>
          <Divider />
          <Divider label="nebo" />
          <Row><span>Vlevo</span><div style={{ height: 24 }}><Divider orientation="vertical" /></div><span>Vpravo</span></Row>
        </Col>
      ),
      code: `<Divider />
<Divider label="nebo" />
<Divider orientation="vertical" />`,
    },
    {
      id: "typewriter",
      name: "Typewriter",
      desc: "Psací efekt s blikajícím kurzorem (hero „I'm a …“). Respektuje prefers-reduced-motion.",
      props: ["Typewriter"],
      preview: <h3 style={{ margin: 0, fontWeight: 300, fontSize: "1.75rem", color: "#d1d5db" }}>I'm a <Typewriter words={["Web Developer", "UI/UX Designer", "Creative Coder"]} /></h3>,
      code: `<h2>I'm a <Typewriter words={["Web Developer", "UI/UX Designer"]} /></h2>`,
    },
    {
      id: "reveal",
      name: "Reveal",
      desc: "Fade-up při vjezdu do viewportu. Parametr index dopočítá zpoždění pro postupné načítání v mřížce.",
      props: ["Reveal"],
      preview: (
        <Row>
          {[0, 1, 2].map((i) => (
            <Reveal key={i} index={i} className="demo-chip-box">Karta {i + 1}</Reveal>
          ))}
        </Row>
      ),
      code: `{items.map((item, i) => (
  <Reveal key={item.id} index={i}>
    <Card>{item.title}</Card>
  </Reveal>
))}`,
      note: "Scrolluj nahoru a dolů – karty se při každém vjezdu do okna jednou objeví.",
    },
    {
      id: "sectionheading",
      name: "SectionHeading",
      desc: "Nadpis oddílu: mono eyebrow, nadpis se žlutým slovem a popis. Samotné oddíly stránky si skládáš po svém.",
      props: ["SectionHeading"],
      block: true,
      preview: (
        <Col gap={40}>
          <SectionHeading eyebrow="// Skills" title="Dovednosti &" accent="Technologie" description="Propojování designu a vývoje s všestrannou sadou dovedností" />
          <SectionHeading align="left" eyebrow="// Portfolio" title="Hotové" accent="Projekty" action={<Button size="sm" variant="soft">Zobrazit vše</Button>} />
        </Col>
      ),
      code: `<SectionHeading
  eyebrow="// Skills"
  title="Dovednosti &"
  accent="Technologie"
  description="Propojování designu a vývoje"
/>

<SectionHeading align="left" eyebrow="// Portfolio" title="Hotové" accent="Projekty"
  action={<Button size="sm" variant="soft">Zobrazit vše</Button>} />`,
    },
    {
      id: "icons",
      name: "Ikony",
      desc: (<>Sada čárových ikon (<code>stroke: currentColor</code>), barvu přebírají od textu. Každá má parametr <code>size</code>.</>),
      props: [{ type: "IconProps", component: "Icon", title: "IconProps (společné pro všechny ikony)" }],
      block: true,
      preview: (
        <div className="demo-icons">
          {Object.entries(ICONS).map(([name, Icon]) => (
            <div key={name} className="demo-icons__item" title={name}>
              <Icon size={22} />
              <span>{name.replace("Icon", "")}</span>
            </div>
          ))}
        </div>
      ),
      code: `import { MailIcon, GithubIcon } from "code-by-barca-ui";

<MailIcon size={20} />
<GithubIcon size={20} className="cbb-accent" />`,
    },
  ],
};
