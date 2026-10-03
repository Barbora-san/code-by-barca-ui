import { useState } from "react";
import {
  Dialog, AlertDialog, messageBox, Sheet, Lightbox, useLightbox, Tooltip, Popover, HoverCard, Dropdown, ContextMenu, MenuList,
  Button, Input, Avatar, toast, MoreIcon, PlusIcon, InfoIcon, SettingsIcon, Card,
  type MenuItem,
} from "../../src";
import { Row } from "../ui";
import { img } from "../img";
import type { Category } from "./types";

const MENU: MenuItem[] = [
  { label: "Nový projekt", icon: <PlusIcon size={16} />, shortcut: "⌘N", onSelect: () => toast.info("Nový projekt") },
  { label: "Nastavení", icon: <SettingsIcon size={16} />, onSelect: () => toast.info("Nastavení") },
  { separator: true, label: "" },
  { label: "Archivovat", disabled: true },
  { label: "Smazat", variant: "destructive", onSelect: () => toast.error("Smazáno") },
];

function DialogDemo() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Otevřít dialog</Button>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title="Upravit projekt"
        description="Změny se projeví hned po uložení."
        footer={<><Button variant="ghost" onClick={() => setOpen(false)}>Zrušit</Button><Button onClick={() => { setOpen(false); toast.success("Uloženo"); }}>Uložit</Button></>}
      >
        <Input label="Název projektu" defaultValue="Redesign portfolia" />
      </Dialog>
    </>
  );
}
function AlertDialogDemo() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="destructive" onClick={() => setOpen(true)}>Smazat projekt</Button>
      <AlertDialog
        open={open}
        onClose={() => setOpen(false)}
        variant="destructive"
        title="Opravdu smazat projekt?"
        description="Tuto akci nejde vrátit zpět."
        confirmLabel="Smazat"
        cancelLabel="Zrušit"
        onConfirm={() => toast.success("Projekt smazán")}
      />
    </>
  );
}
function MessageBoxDemo() {
  return (
    <Row>
      <Button variant="outline" onClick={() => messageBox.alert({ title: "Hotovo", message: "Export proběhl v pořádku.", variant: "success" })}>alert()</Button>
      <Button variant="outline" onClick={async () => {
        const ok = await messageBox.confirm({ title: "Smazat projekt?", message: "Opravdu?", variant: "destructive", okLabel: "Smazat" });
        toast.show({ title: ok ? "Potvrzeno" : "Zrušeno" });
      }}>confirm()</Button>
    </Row>
  );
}
function SheetDemo() {
  const [side, setSide] = useState<"left" | "right" | "top" | "bottom" | null>(null);
  return (
    <>
      <Row>
        {(["left", "right", "top", "bottom"] as const).map((s) => <Button key={s} variant="soft" onClick={() => setSide(s)}>{s}</Button>)}
      </Row>
      <Sheet open={side !== null} side={side ?? "right"} onClose={() => setSide(null)} title="Filtry" description="Boční panel na mobilu i desktopu." footer={<Button onClick={() => setSide(null)}>Použít</Button>}>
        <p className="demo-muted">Obsah panelu…</p>
      </Sheet>
    </>
  );
}
const SHOTS = [
  { src: img("Screenshot 1", 1200, 700, 48), alt: "Screenshot 1", caption: "Domovská stránka" },
  { src: img("Screenshot 2", 1200, 700, 200), alt: "Screenshot 2", caption: "Administrace" },
  { src: img("Screenshot 3", 1200, 700, 140), alt: "Screenshot 3", caption: "Detail projektu" },
];
function LightboxDemo() {
  const lb = useLightbox();
  return (
    <>
      <Row>{SHOTS.map((s, i) => <button key={i} type="button" className="demo-thumb" onClick={() => lb.open(i)}><img src={s.src} alt={s.alt} /></button>)}</Row>
      <Lightbox {...lb.props} items={SHOTS} />
    </>
  );
}
function PopoverDemo() {
  return (
    <Popover trigger={<Button variant="outline">Otevřít popover</Button>}>
      <div style={{ padding: 16, width: 240 }}>
        <strong>Rychlé nastavení</strong>
        <p className="demo-muted" style={{ margin: "6px 0 12px" }}>Libovolný obsah v plovoucím panelu.</p>
        <Button size="sm" fullWidth>Hotovo</Button>
      </div>
    </Popover>
  );
}

export const overlays: Category = {
  id: "prekryvy",
  title: "Překryvy a plovoucí",
  docs: [
    {
      id: "dialog",
      name: "Dialog",
      desc: "Modální okno s nadpisem, popisem a patičkou. Zamyká scroll, zavírá Esc a klik na pozadí. Modal je alias.",
      props: ["Dialog"],
      preview: <DialogDemo />,
      code: `const [open, setOpen] = useState(false);

<Dialog
  open={open}
  onClose={() => setOpen(false)}
  title="Upravit projekt"
  description="Změny se projeví hned po uložení."
  footer={<Button onClick={save}>Uložit</Button>}
>
  <Input label="Název projektu" />
</Dialog>`,
    },
    {
      id: "alertdialog",
      name: "AlertDialog",
      desc: "Potvrzovací dialog pro nebezpečné akce – bez křížku, focus na bezpečné volbě.",
      props: ["AlertDialog"],
      preview: <AlertDialogDemo />,
      code: `<AlertDialog
  open={open}
  onClose={() => setOpen(false)}
  variant="destructive"
  title="Opravdu smazat projekt?"
  description="Tuto akci nejde vrátit zpět."
  confirmLabel="Smazat"
  onConfirm={remove}
/>`,
    },
    {
      id: "messagebox",
      name: "messageBox",
      desc: <>Message box jako Promise – <code>await messageBox.confirm()</code> vrátí true / false. Vyžaduje jednou v aplikaci <code>&lt;MessageBoxHost /&gt;</code>.</>,
      props: [{ type: "MessageBoxOptions", title: "MessageBoxOptions" }],
      preview: <MessageBoxDemo />,
      code: `import { messageBox, MessageBoxHost } from "code-by-barca-ui";

<MessageBoxHost />   // jednou v kořeni

await messageBox.alert({ title: "Hotovo", message: "Export proběhl.", variant: "success" });

if (await messageBox.confirm({ title: "Smazat projekt?", variant: "destructive", okLabel: "Smazat" })) {
  remove();
}`,
    },
    {
      id: "sheet",
      name: "Sheet / Drawer",
      desc: "Boční nebo spodní panel. Hodí se pro mobilní menu a filtry.",
      props: ["Sheet"],
      preview: <SheetDemo />,
      code: `<Sheet open={open} side="right" onClose={close} title="Filtry" footer={<Button>Použít</Button>}>
  …
</Sheet>`,
    },
    {
      id: "lightbox",
      name: "Lightbox",
      desc: "Prohlížeč obrázků na celou obrazovku – šipky, Esc, popisky. Pomocný hook useLightbox drží stav.",
      props: ["Lightbox"],
      preview: <LightboxDemo />,
      code: `const lb = useLightbox();

<img onClick={() => lb.open(0)} src={shots[0].src} />
<Lightbox {...lb.props} items={shots} />   // shots: { src, alt?, caption? }[]`,
    },
    {
      id: "tooltip",
      name: "Tooltip",
      desc: "Popisek při najetí i při focusu z klávesnice.",
      props: ["Tooltip"],
      preview: (
        <Row gap={20}>
          <Tooltip content="Nahoře"><Button variant="outline">top</Button></Tooltip>
          <Tooltip content="Dole" side="bottom"><Button variant="outline">bottom</Button></Tooltip>
          <Tooltip content="Vlevo" side="left"><Button variant="outline">left</Button></Tooltip>
          <Tooltip content="Vpravo" side="right"><Button variant="outline">right</Button></Tooltip>
        </Row>
      ),
      code: `<Tooltip content="Smazat projekt" side="bottom"><Button variant="ghost">🗑</Button></Tooltip>`,
    },
    {
      id: "popover",
      name: "Popover",
      desc: "Plovoucí panel s libovolným obsahem, otevírá se klikem. Může být řízený (open / onOpenChange).",
      props: ["Popover"],
      preview: <PopoverDemo />,
      code: `<Popover trigger={<Button variant="outline">Otevřít</Button>}>
  <div style={{ padding: 16 }}>Libovolný obsah</div>
</Popover>`,
    },
    {
      id: "hovercard",
      name: "HoverCard",
      desc: "Náhled, který se otevře při najetí (profil, odkaz).",
      props: ["HoverCard"],
      preview: (
        <HoverCard trigger={<a href="#hovercard" className="cbb-link">@barbora</a>}>
          <div style={{ padding: 16, width: 260, display: "flex", gap: 12 }}>
            <Avatar initials="BŠ" status="online" />
            <div><strong>Barbora Šanderová</strong><p className="demo-muted" style={{ margin: "4px 0 0", fontSize: 13 }}>Web developer a designér z Broumova.</p></div>
          </div>
        </HoverCard>
      ),
      code: `<HoverCard trigger={<a href="/o-mne">@barbora</a>}>
  <div style={{ padding: 16 }}>Profil…</div>
</HoverCard>`,
    },
    {
      id: "dropdown",
      name: "Dropdown",
      desc: "Rozbalovací menu z pole položek. Šipky, Home / End, Esc a typeahead.",
      props: ["Dropdown", { type: "MenuItem", title: "MenuItem (položka v items)" }],
      preview: <Dropdown trigger={<Button variant="outline" rightIcon={<MoreIcon size={16} />}>Akce</Button>} items={MENU} />,
      code: `<Dropdown
  trigger={<Button variant="outline">Akce</Button>}
  items={[
    { label: "Nový projekt", icon: <PlusIcon size={16} />, shortcut: "⌘N", onSelect: create },
    { separator: true, label: "" },
    { label: "Smazat", variant: "destructive", onSelect: remove },
  ]}
/>`,
    },
    {
      id: "contextmenu",
      name: "ContextMenu",
      desc: "Menu po kliknutí pravým tlačítkem (na dotyku dlouhý stisk).",
      props: ["ContextMenu"],
      preview: (
        <ContextMenu items={MENU}>
          <Card form corners><div className="demo-dropzone"><InfoIcon size={18} /> Klikni sem pravým tlačítkem</div></Card>
        </ContextMenu>
      ),
      code: `<ContextMenu items={items}>
  <Card>Klikni sem pravým tlačítkem</Card>
</ContextMenu>`,
    },
    {
      id: "menulist",
      name: "MenuList",
      desc: "Samotný seznam položek menu (základ pro Dropdown, ContextMenu a Menubar) – použij ho ve vlastních plovoucích panelech.",
      props: ["MenuList"],
      preview: <div style={{ width: 240, border: "1px solid var(--cbb-border)", borderRadius: 12, background: "var(--cbb-surface)", padding: 4 }}><MenuList items={MENU} onClose={() => {}} autoFocus={false} /></div>,
      code: `<MenuList items={items} onClose={close} />`,
    },
  ],
};

