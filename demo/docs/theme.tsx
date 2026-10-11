import { useState } from "react";
import {
  ThemeToggle, CommandPalette, Button, Kbd, toast, useTheme, useHotkey,
  HomeIcon, SettingsIcon, SparklesIcon, SunIcon, MoonIcon, GithubIcon, type CommandItem,
} from "../../src";
import { Row, Col } from "../ui";
import type { Doc } from "./types";

function ToggleDemo() {
  return (
    <Row gap={32}>
      <Col width="auto" gap={8}>
        <span className="demo-eyebrow">icon</span>
        <ThemeToggle />
      </Col>
      <Col width="auto" gap={8}>
        <span className="demo-eyebrow">icon + includeSystem</span>
        <ThemeToggle includeSystem />
      </Col>
      <Col width="auto" gap={8}>
        <span className="demo-eyebrow">segmented</span>
        <ThemeToggle variant="segmented" />
      </Col>
    </Row>
  );
}

function UseThemeDemo() {
  const { mode, resolved, setMode, toggle } = useTheme();
  return (
    <Col gap={12}>
      <span className="demo-mono">mode: {mode} · resolved: {resolved}</span>
      <Row>
        <Button size="sm" variant="outline" onClick={toggle}>toggle()</Button>
        <Button size="sm" variant="outline" onClick={() => setMode("system")}>setMode("system")</Button>
      </Row>
    </Col>
  );
}

function PaletteDemo() {
  const [open, setOpen] = useState(false);
  const { setMode } = useTheme();
  const items: CommandItem[] = [
    { id: "home", group: "Navigace", label: "Přejít na úvod", icon: <HomeIcon size={16} />, shortcut: "G H", keywords: ["domů", "start"], onSelect: () => document.getElementById("uvod")?.scrollIntoView({ behavior: "smooth" }) },
    { id: "gh", group: "Navigace", label: "Otevřít GitHub", description: "Repozitář knihovny", icon: <GithubIcon size={16} />, onSelect: () => toast.info("Tady by se otevřel GitHub") },
    { id: "light", group: "Vzhled", label: "Světlý režim", icon: <SunIcon size={16} />, keywords: ["den", "light"], onSelect: () => setMode("light") },
    { id: "dark", group: "Vzhled", label: "Tmavý režim", icon: <MoonIcon size={16} />, keywords: ["noc", "dark"], onSelect: () => setMode("dark") },
    { id: "save", group: "Akce", label: "Uložit změny", icon: <SparklesIcon size={16} />, shortcut: "⌘ S", onSelect: () => toast.success("Uloženo") },
    { id: "set", group: "Akce", label: "Nastavení", icon: <SettingsIcon size={16} />, onSelect: () => toast.info("Nastavení") },
    { id: "off", group: "Akce", label: "Nedostupný příkaz", disabled: true, onSelect: () => {} },
  ];
  return (
    <Row gap={16}>
      <Button onClick={() => setOpen(true)}>Otevřít paletu</Button>
      <span className="demo-muted">nebo <Kbd>Ctrl</Kbd> + <Kbd>J</Kbd></span>
      <CommandPalette open={open} onOpenChange={setOpen} items={items} hotkey="mod+j" />
    </Row>
  );
}

function HotkeyDemo() {
  const [n, setN] = useState(0);
  useHotkey("shift+h", () => setN((c) => c + 1));
  return <span className="demo-mono">Stiskni Shift + H – stisknuto {n}×</span>;
}

export const THEME_DOCS: Doc[] = [
  {
    id: "themetoggle", name: "ThemeToggle",
    desc: <>Přepínač světlého a tmavého režimu. Sám nastaví <code>data-theme</code> na <code>&lt;html&gt;</code>, pamatuje si volbu a umí i režim „podle systému“. Barvy knihovny se přepínají přes CSS proměnné, takže funguje na všech komponentách najednou.</>,
    props: ["ThemeToggle"],
    preview: <ToggleDemo />,
    note: <>Aby při načtení stránky neproblikl špatný režim, vlož do <code>&lt;head&gt;</code> skript z <code>getThemeInitScript()</code>. Světlý režim jde zapnout i ručně atributem <code>data-theme="light"</code> na libovolném obalu, nebo třídou <code>cbb-light</code>.</>,
    code: `import { ThemeToggle } from "code-by-barca-ui";

<ThemeToggle />
<ThemeToggle includeSystem />
<ThemeToggle variant="segmented" />

// Next.js: layout.tsx, v <head> proti probliknutí
<script dangerouslySetInnerHTML={{ __html: getThemeInitScript() }} />`,
  },
  {
    id: "commandpalette", name: "CommandPalette",
    desc: "Příkazová paleta (Ctrl / ⌘ + K): hledání bez ohledu na diakritiku, skupiny příkazů, šipky a Enter, nedostupné příkazy a focus trap. Příkazy mají ikony, zkratky a klíčová slova pro vyhledání.",
    props: ["CommandPalette", { type: "CommandItem", title: "CommandItem" }],
    preview: <PaletteDemo />,
    code: `const [open, setOpen] = useState(false);

<CommandPalette
  open={open}
  onOpenChange={setOpen}
  items={[
    { id: "home", group: "Navigace", label: "Přejít na úvod", onSelect: () => router.push("/") },
    { id: "dark", group: "Vzhled", label: "Tmavý režim", keywords: ["noc"], onSelect: () => setMode("dark") },
  ]}
/>  // výchozí zkratka mod+k, vypneš přes hotkey={null}`,
  },
  {
    id: "usetheme", name: "useTheme",
    desc: "Hook pod ThemeToggle: vrací mode (light / dark / system), resolved (skutečný režim), setMode a toggle. Hodí se, když chceš vlastní přepínač.",
    props: [],
    preview: <UseThemeDemo />,
    code: `const { mode, resolved, setMode, toggle } = useTheme();`,
  },
  {
    id: "usehotkey", name: "useHotkey",
    desc: "Zavolá funkci při klávesové zkratce. mod znamená Ctrl, na Macu ⌘. Zruší původní akci prohlížeče.",
    props: [],
    preview: <HotkeyDemo />,
    code: `useHotkey("mod+s", () => save());\nuseHotkey("shift+/", () => setHelpOpen(true));`,
  },
];
