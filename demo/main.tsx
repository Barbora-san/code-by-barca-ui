import { useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Navbar, Hero, Typewriter, Button, Section, SectionHeading, SkillCard, ProjectCard, FilterPills,
  FilterDropdown, ContactForm, DateTimePicker, Badge, Timeline, InfoRow, SocialLinks, Footer,
  CodeBlock, ToastProvider, useToast, Modal, MailIcon, MapPinIcon, GithubIcon, SkeletonGrid, CookieBanner, Select,
} from "../src";
import "../src/styles.css";

function CodeIcon() {
  return (<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m16 18 6-6-6-6M8 6l-6 6 6 6" /></svg>);
}

function App() {
  const [filter, setFilter] = useState("all");
  const [multi, setMulti] = useState<string[]>(["react"]);
  const [date, setDate] = useState<string>("2026-09-30T14:30:00.000Z");
  const [modal, setModal] = useState(false);
  const toast = useToast();
  return (
    <div className="cbb-root">
      <Navbar brand={<>code<span className="cbb-accent">.</span>by<span className="cbb-accent">.</span>barca</>} items={[{ label: "O mně", href: "#about", active: true }, { label: "Dovednosti", href: "#skills" }, { label: "Projekty", href: "#projects" }]} cta={<Button size="sm" href="#contact">Kontakt</Button>} />
      <Hero badge="Otevřena novým nápadům" title="Barbora" titleMuted="Šanderová"
        tagline={<>I'm a&nbsp;<Typewriter words={["Designer", "Developer"]} /></>}
        description="Vytváření digitálních zážitků s precizností a kreativitou"
        actions={<><Button size="lg" glow href="#projects">Ukázka mé práce</Button><Button size="lg" variant="outline" href="#contact">Kontaktujte mě</Button></>}
        scrollHref="#about" />
      <Section id="skills" tone="alt" glow="left">
        <SectionHeading eyebrow="// Skills" title="Dovednosti &" accent="Technologie" description="Propojování designu a vývoje" />
        <div className="cbb-grid cbb-grid--3">
          <SkillCard index={0} icon={<CodeIcon />} title="React" description="Komponenty a hooky." level={3} tools={["Next.js", "TypeScript", "Tailwind", "Vite"]} onClick={() => toast.success("Detail dovednosti")} />
          <SkillCard index={1} icon={<CodeIcon />} title="Figma" description="Prototypy a design systémy." level={2} tools={["Auto layout"]} />
          <SkillCard index={2} icon={<CodeIcon />} title="Node.js" description="API a služby." level={4} tools={["Express"]} />
        </div>
      </Section>
      <Section id="projects" glow="right" grid>
        <SectionHeading align="left" eyebrow="// Portfolio" title="Hotové" accent="Projekty" action={<Button variant="soft" size="sm" onClick={() => setModal(true)}>Zobrazit vše</Button>} />
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 32 }}>
          <FilterPills value={filter} onChange={setFilter} options={[{ value: "all", label: "All" }, { value: "web", label: "Web Design" }, { value: "dev", label: "Web Development" }]} />
          <FilterDropdown multiple label="Tech" value={multi} onChange={setMulti} options={[{ value: "react", label: "React", count: 4 }, { value: "next", label: "Next.js", count: 2 }, { value: "figma", label: "Figma", count: 3 }]} />
        </div>
        <div className="cbb-grid cbb-grid--3">
          <ProjectCard category="Web Design" year="2026" title="Code by Barca" description="Osobní portfolio v geeky stylu." tags={["Next.js", "Tailwind", "FastAPI", "Mongo"]} href="#p1" />
          <ProjectCard category="Software" year="2025" title="Cinema Space" description="Rezervační systém kina." tags={["React"]} onClick={() => {}} />
          <SkeletonGrid count={1} variant="project" />
        </div>
      </Section>
      <Section id="contact" tone="alt" glow="center">
        <SectionHeading eyebrow="// Get In Touch" title="Vytvořme spolu" accent="něco skvělého" />
        <div className="cbb-grid cbb-grid--2" style={{ gap: 64 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <ContactForm onSubmit={async () => { await new Promise((r) => setTimeout(r, 300)); }} />
            <DateTimePicker value={date} onChange={setDate} />
            <Select label="Typ projektu" defaultValue="web"><option value="web">Web</option><option value="app">Aplikace</option></Select>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <InfoRow icon={<MailIcon size={20} />} label="Email" value="barcasan.san@icloud.com" href="mailto:barcasan.san@icloud.com" />
            <InfoRow icon={<MapPinIcon size={20} />} label="Lokace" value="Broumov, Náchod" href="https://maps.google.com" />
            <SocialLinks links={[{ label: "GitHub", href: "https://github.com/Barbora-san", icon: <GithubIcon size={20} /> }]} />
            <Badge dot variant="success">Volná kapacita</Badge>
            <Timeline entries={[{ period: "2024 — dnes", title: "Freelance", subtitle: "Web & design", description: "Tvorba webů." }]} />
            <CodeBlock language="tsx" code={`import { Button } from "code-by-barca-ui";\n<Button glow>Ahoj</Button>`} />
          </div>
        </div>
      </Section>
      <Footer columns={[{ title: "code-by-barca", content: <p>Osobní portfolio.</p> }, { title: "Odkazy", links: [{ label: "Projekty", href: "#projects" }] }]} bottom="© 2026 Barbora Šanderová" bottomLinks={[{ label: "GDPR", href: "/GDPR" }, { label: "Nastavení cookies", onClick: () => {} }]} />
      <Modal open={modal} onClose={() => setModal(false)} title="Všechny projekty" description="Ukázkový modal.">Obsah</Modal>
      <CookieBanner />
    </div>
  );
}

createRoot(document.getElementById("root")!).render(<ToastProvider><App /></ToastProvider>);
