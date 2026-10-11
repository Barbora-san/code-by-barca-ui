import {
  Card, CardMedia, CardBody, StatCard, Avatar, AvatarGroup, Skeleton, SkeletonGrid, Progress, SkillCard, SkillLevelBar,
  ProjectCard, Timeline, InfoRow, SocialLinks, CodeBlock, LazyImage, EmptyState, Button,
  CodeIcon, PaletteIcon, MailIcon, MapPinIcon, GithubIcon, FolderIcon, UserIcon, SearchIcon, toast,
} from "../../src";
import { useEffect, useState } from "react";
import { Row, Col } from "../ui";
import { img } from "../img";
import type { Category } from "./types";

function ProgressDemo() {
  const [v, setV] = useState(35);
  useEffect(() => { const t = setInterval(() => setV((x) => (x >= 100 ? 0 : x + 5)), 700); return () => clearInterval(t); }, []);
  return (
    <Col width={440} gap={16}>
      <Progress label="Nahrávání" value={v} showValue />
      <Progress label="Hotovo" value={100} variant="success" size="sm" showValue />
      <Progress label="Chyba" value={60} variant="destructive" showValue />
      <Progress label="Neurčitý průběh" />
    </Col>
  );
}

export const display: Category = {
  id: "zobrazeni",
  title: "Zobrazení",
  docs: [
    {
      id: "card",
      name: "Card",
      desc: "Základní karta. Přepínače glow, corners a interactive dělají karty z webu (dovednosti, formuláře, projekty).",
      props: ["Card"],
      preview: (
        <div className="demo-grid3">
          <Card form><strong>Základní</strong><p className="demo-muted" style={{ margin: "8px 0 0" }}>Karta s paddingem formuláře.</p></Card>
          <Card form glow corners interactive><strong>glow + corners</strong><p className="demo-muted" style={{ margin: "8px 0 0" }}>Geeky rohové závorky a záře.</p></Card>
          <Card flush interactive>
            <CardMedia><img src={img("CardMedia", 600, 340)} alt="" style={{ width: "100%", display: "block" }} /></CardMedia>
            <CardBody><strong>CardMedia + CardBody</strong></CardBody>
          </Card>
        </div>
      ),
      code: `<Card form>Základní</Card>
<Card form glow corners interactive>glow + corners</Card>

<Card flush interactive>
  <CardMedia><img src="/cover.png" alt="" /></CardMedia>
  <CardBody>Obsah karty</CardBody>
</Card>`,
    },
    {
      id: "statcard",
      name: "StatCard",
      desc: "Číslo s popiskem a změnou. Znaménko + / − určí barvu trendu.",
      props: ["StatCard"],
      preview: (
        <div className="demo-grid3">
          <StatCard label="Zobrazení / měsíc" value="2 340" change="+8.2%" icon={<SearchIcon size={18} />} />
          <StatCard label="Projektů" value="12" hint="3 rozpracované" icon={<FolderIcon size={18} />} />
          <StatCard label="Míra opuštění" value="41 %" change="-3.1%" trend="up" />
        </div>
      ),
      code: `<StatCard label="Zobrazení / měsíc" value="2 340" change="+8.2%" icon={<SearchIcon size={18} />} />
<StatCard label="Projektů" value="12" hint="3 rozpracované" />`,
    },
    {
      id: "avatar",
      name: "Avatar / AvatarGroup",
      desc: "Kruhový avatar s obrázkem nebo iniciálami a stavovou tečkou. AvatarGroup zobrazí překryté avatary s počtem navíc.",
      props: [{ type: "AvatarProps", component: "Avatar" }, { type: "AvatarGroupProps", component: "AvatarGroup" }],
      preview: (
        <Row gap={24}>
          <Row><Avatar initials="BŠ" size="sm" /><Avatar initials="BŠ" status="online" /><Avatar initials="JN" size="lg" status="away" /><Avatar src={img("B", 80, 80)} alt="Barbora" status="busy" /></Row>
          <AvatarGroup max={3} avatars={[{ initials: "BŠ" }, { initials: "JN" }, { initials: "KP" }, { initials: "TM" }, { initials: "LS" }]} />
        </Row>
      ),
      code: `<Avatar initials="BŠ" status="online" />
<Avatar src="/me.jpg" alt="Barbora" size="lg" />
<AvatarGroup max={3} avatars={[{ initials: "BŠ" }, { initials: "JN" }, { initials: "KP" }, { initials: "TM" }]} />`,
    },
    {
      id: "skeleton",
      name: "Skeleton",
      desc: "Pulzující placeholder při načítání. SkeletonGrid předvyrobí kartu projektu nebo dovednosti.",
      props: ["Skeleton", "SkeletonGrid"],
      preview: (
        <Col>
          <Row><Skeleton variant="circle" /><Col gap={8} width={240}><Skeleton variant="text" width="70%" /><Skeleton variant="text" /></Col></Row>
          <Skeleton width="100%" height={80} rounded="md" />
          <SkeletonGrid count={3} variant="skill" />
        </Col>
      ),
      code: `<Skeleton variant="circle" />
<Skeleton variant="text" width="70%" />
<Skeleton width="100%" height={80} rounded="md" />

<SkeletonGrid count={3} variant="skill" />
<SkeletonGrid count={4} variant="project" columns={4} />`,
    },
    {
      id: "progress",
      name: "Progress",
      desc: "Ukazatel průběhu. Bez value je neurčitý (animovaný).",
      props: ["Progress"],
      preview: <ProgressDemo />,
      code: `<Progress label="Nahrávání" value={35} showValue />
<Progress label="Hotovo" value={100} variant="success" size="sm" />
<Progress label="Načítám…" />`,
    },
    {
      id: "skillcard",
      name: "SkillCard",
      desc: "Karta dovednosti z homepage – ikona, úroveň, nástroje a postupné zobrazování podle index.",
      props: ["SkillCard"],
      preview: (
        <div className="demo-grid3">
          <SkillCard index={0} icon={<CodeIcon size={28} />} title="Web Development" description="Statické weby, backend i hosting." level={4} tools={["React", "Next.js", "FastAPI", "Mongo", "Tailwind"]} maxTools={3} onClick={() => toast.info("Detail dovednosti")} />
          <SkillCard index={1} icon={<PaletteIcon size={28} />} title="Web Design" description="Layout, ikony a mikroanimace." level={3} tools={["Figma", "Photoshop"]} />
        </div>
      ),
      code: `<SkillCard
  index={0}
  icon={<CodeIcon size={28} />}
  title="Web Development"
  description="Statické weby, backend i hosting."
  level={4}
  tools={["React", "Next.js", "FastAPI"]}
  maxTools={3}
  href="/skills/web-development"
/>`,
    },
    {
      id: "skilllevelbar",
      name: "SkillLevelBar",
      desc: "Segmentová lišta úrovně (Hobby → Hlavní). Počet segmentů i popisky jsou přepisovatelné.",
      props: ["SkillLevelBar"],
      preview: (
        <Col width={420} gap={20}>
          <SkillLevelBar level={2} />
          <SkillLevelBar level={4} />
          <SkillLevelBar level={3} levels={["Začátečník", "Pokročilý", "Expert"]} />
        </Col>
      ),
      code: `<SkillLevelBar level={2} />
<SkillLevelBar level={3} levels={["Začátečník", "Pokročilý", "Expert"]} />
<SkillLevelBar level={4} hideLabels />`,
    },
    {
      id: "projectcard",
      name: "ProjectCard",
      desc: "Karta projektu s náhledem 16:9, kategorií, rokem a tagy. S href je to odkaz, s onClick tlačítko.",
      props: ["ProjectCard"],
      preview: (
        <div className="demo-grid3">
          <ProjectCard category="Web Design" year="2026" title="Code by Barca" description="Osobní portfolio v geeky stylu." image={img("Code by Barca", 800, 450, 48)} imageAlt="Code by Barca" tags={["Next.js", "Tailwind", "FastAPI", "Mongo"]} maxTags={3} href="#projectcard" />
          <ProjectCard category="Software" year="2025" title="Cinema Space" description="Rezervační systém kina." image={img("Cinema Space", 800, 450, 200)} tags={["React"]} onClick={() => toast.info("Detail projektu")} />
        </div>
      ),
      code: `<ProjectCard
  category="Web Design"
  year="2026"
  title="Code by Barca"
  description="Osobní portfolio v geeky stylu."
  image="/projects/cbb.png"
  tags={["Next.js", "Tailwind", "FastAPI", "Mongo"]}
  maxTags={3}
  href="/projects/code-by-barca"
/>`,
    },
    {
      id: "timeline",
      name: "Timeline",
      desc: "Časová osa zkušeností.",
      props: [{ type: "TimelineEntry", component: "Timeline", title: "TimelineEntry (položka v entries)" }],
      preview: (
        <Timeline entries={[
          { period: "2024 — dnes", title: "Freelance", subtitle: "Web & design", description: "Tvorba webů na míru." },
          { period: "2020 — 2022", title: "Web Administrátor", subtitle: "Rybáři Broumov" },
        ]} />
      ),
      code: `<Timeline entries={[
  { period: "2024 — dnes", title: "Freelance", subtitle: "Web & design", description: "Tvorba webů na míru." },
  { period: "2020 — 2022", title: "Web Administrátor", subtitle: "Rybáři Broumov" },
]} />`,
    },
    {
      id: "inforow",
      name: "InfoRow / SocialLinks",
      desc: "Kontaktní řádek s ikonou a odkazem a řada ikon sociálních sítí.",
      props: [{ type: "InfoRowProps", component: "InfoRow" }, { type: "SocialLink", component: "SocialLinks", title: "SocialLink (položka v links)" }],
      preview: (
        <Col width={420}>
          <InfoRow icon={<MailIcon size={20} />} label="Email" value="barcasan.san@icloud.com" href="mailto:barcasan.san@icloud.com" />
          <InfoRow icon={<MapPinIcon size={20} />} label="Lokace" value="Broumov, Náchod" href="https://maps.google.com" />
          <SocialLinks links={[{ label: "GitHub", href: "https://github.com/Barbora-san", icon: <GithubIcon size={20} /> }, { label: "Profil", href: "#inforow", icon: <UserIcon size={20} /> }]} />
        </Col>
      ),
      code: `<InfoRow icon={<MailIcon size={20} />} label="Email" value="me@example.cz" href="mailto:me@example.cz" />

<SocialLinks links={[
  { label: "GitHub", href: "https://github.com/…", icon: <GithubIcon size={20} /> },
]} />`,
    },
    {
      id: "codeblock",
      name: "CodeBlock",
      desc: "Blok kódu s hlavičkou, číslováním řádků a tlačítkem Kopírovat. Bez zvýrazňování syntaxe – žádná těžká závislost.",
      props: ["CodeBlock"],
      block: true,
      preview: <CodeBlock language="tsx" showLineNumbers code={`import { Button } from "code-by-barca-ui";\n\nexport default function App() {\n  return <Button glow>Ahoj</Button>;\n}`} />,
      code: `<CodeBlock language="tsx" showLineNumbers code={source} />`,
    },
    {
      id: "lazyimage",
      name: "LazyImage",
      desc: "Obrázek, který se stáhne až před vjezdem do viewportu. Do té doby drží místo s barvou podkladu.",
      props: ["LazyImage"],
      preview: <div style={{ width: 320 }}><LazyImage src={img("LazyImage", 640, 360, 150)} alt="Ukázkový obrázek" placeholderColor="#1a1a1a" wrapperClassName="demo-lazy" /></div>,
      code: `<LazyImage src="/cover.jpg" alt="Cover" placeholderColor="#1a1a1a" wrapperClassName="aspect-16-9" />`,
    },
    {
      id: "emptystate",
      name: "EmptyState",
      desc: "Prázdný stav – žádné výsledky, žádné projekty.",
      props: ["EmptyState"],
      preview: <EmptyState icon={<SearchIcon size={32} />} title="Žádné projekty nenalezeny" description="Zkus změnit hledání nebo filtry." action={<Button variant="soft" size="sm">Zobrazit všechny projekty</Button>} />,
      code: `<EmptyState
  icon={<SearchIcon size={32} />}
  title="Žádné projekty nenalezeny"
  description="Zkus změnit hledání nebo filtry."
  action={<Button variant="soft" size="sm">Zobrazit všechny</Button>}
/>`,
    },
  ],
};

