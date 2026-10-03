import { useState } from "react";
import {
  Alert, AlertBar, toast, showToast, Button, NotificationBadge, NotificationPopover, BellIcon, SparklesIcon,
  type NotificationItem,
} from "../../src";
import { Row, Col } from "../ui";
import type { Category } from "./types";

function AlertDemo() {
  const [open, setOpen] = useState(true);
  return (
    <Col>
      <Alert variant="info" title="Informace">Web běží na novém hostingu.</Alert>
      <Alert variant="success" title="Uloženo">Změny jsou na webu.</Alert>
      <Alert variant="warning" title="Pozor">Obrázek je větší než 2 MB.</Alert>
      <Alert variant="error" title="Chyba" action={<Button size="sm" variant="outline">Zkusit znovu</Button>}>Nepodařilo se uložit projekt.</Alert>
      {open && <Alert dismissible onDismiss={() => setOpen(false)} title="Zavíratelné">Klikni na křížek.</Alert>}
      {!open && <Button size="sm" variant="soft" onClick={() => setOpen(true)}>Zobrazit znovu</Button>}
    </Col>
  );
}
function AlertBarDemo() {
  return (
    <Col gap={8}>
      <AlertBar variant="brand" icon={<SparklesIcon size={16} />} action={{ label: "Zjistit víc", href: "#alertbar" }}>Nový projekt „Code by Barca UI“ je venku.</AlertBar>
      <AlertBar variant="warning" dismissible={false}>Plánovaná údržba dnes ve 22:00.</AlertBar>
      <AlertBar variant="error">Kontaktní formulář je dočasně nedostupný.</AlertBar>
    </Col>
  );
}
function ToastDemo() {
  return (
    <Row>
      <Button variant="soft" onClick={() => toast.success("Projekt uložen")}>Success</Button>
      <Button variant="soft" onClick={() => toast.error("Nepodařilo se uložit")}>Error</Button>
      <Button variant="soft" onClick={() => toast.info("Nový komentář", { description: "Jan Novák okomentoval projekt." })}>S popisem</Button>
      <Button variant="soft" onClick={() => toast.warning("Brzy vyprší platnost")}>Warning</Button>
      <Button variant="outline" onClick={() => showToast({ title: "Projekt smazán", duration: 8000, action: { label: "Vrátit zpět", onClick: () => toast.success("Obnoveno") } })}>S akcí</Button>
    </Row>
  );
}

const INITIAL: NotificationItem[] = [
  { id: "1", title: "Neúspěšné přihlášení (3×)", description: "IP 91.xxx.xxx.12", time: "před 40 minutami" },
  { id: "2", title: "Jan Novák upravil stránku „Ceník“", time: "dnes 10:14" },
  { id: "3", title: "GDPR PDF staženo 4×", time: "před 3 dny", read: true },
];
function NotifDemo() {
  const [list, setList] = useState(INITIAL);
  const unread = list.filter((n) => !n.read).length;
  return (
    <Row gap={32}>
      <NotificationPopover
        notifications={list}
        onMarkAllRead={() => setList((l) => l.map((n) => ({ ...n, read: true })))}
        onDismiss={(id) => setList((l) => l.filter((n) => n.id !== id))}
        onNotificationClick={(id) => setList((l) => l.map((n) => (n.id === id ? { ...n, read: true } : n)))}
      />
      <Row gap={24}>
        <NotificationBadge count={unread}><BellIcon size={24} /></NotificationBadge>
        <NotificationBadge count={120} max={99}><BellIcon size={24} /></NotificationBadge>
        <NotificationBadge dot><BellIcon size={24} /></NotificationBadge>
      </Row>
    </Row>
  );
}

export const feedback: Category = {
  id: "zpetna-vazba",
  title: "Zpětná vazba",
  docs: [
    {
      id: "alert",
      name: "Alert",
      desc: "Hláška uvnitř obsahu – info, úspěch, varování, chyba. Může mít akci a jít zavřít.",
      props: ["Alert"],
      preview: <AlertDemo />,
      code: `<Alert variant="success" title="Uloženo">Změny jsou na webu.</Alert>
<Alert variant="error" title="Chyba" action={<Button size="sm" variant="outline">Zkusit znovu</Button>}>
  Nepodařilo se uložit projekt.
</Alert>
<Alert dismissible onDismiss={close} title="Zavíratelné">…</Alert>`,
    },
    {
      id: "alertbar",
      name: "AlertBar",
      desc: "Celostránková lišta s oznámením. S position=\"top\" se přilepí nahoru, storageKey si pamatuje zavření.",
      props: ["AlertBar"],
      block: true,
      preview: <AlertBarDemo />,
      code: `<AlertBar
  variant="brand"
  position="top"
  storageKey="alert-ui-release"
  action={{ label: "Zjistit víc", href: "/ui" }}
>
  Nový projekt „Code by Barca UI“ je venku.
</AlertBar>`,
    },
    {
      id: "toast",
      name: "Toaster / toast",
      desc: <>Krátká oznámení rohem obrazovky. <code>&lt;Toaster /&gt;</code> vlož jednou do aplikace, <code>toast.success()</code> pak zavoláš odkudkoli – bez provideru.</>,
      props: [{ type: "ToastOptions", title: "ToastOptions (druhý parametr toast.* / showToast)" }, { type: "ToasterProps", component: "Toaster" }],
      preview: <ToastDemo />,
      code: `import { Toaster, toast, showToast } from "code-by-barca-ui";

// jednou v kořeni aplikace
<Toaster position="bottom-right" />

toast.success("Projekt uložen");
toast.info("Nový komentář", { description: "Jan Novák okomentoval projekt." });
showToast({ title: "Projekt smazán", duration: 8000, action: { label: "Vrátit zpět", onClick: undo } });`,
    },
    {
      id: "notificationbadge",
      name: "NotificationBadge",
      desc: "Čítač nebo tečka v rohu libovolného prvku. Nad max zobrazí „99+“.",
      props: ["NotificationBadge"],
      preview: (
        <Row gap={24}>
          <NotificationBadge count={3}><BellIcon size={24} /></NotificationBadge>
          <NotificationBadge count={120}><BellIcon size={24} /></NotificationBadge>
          <NotificationBadge dot><BellIcon size={24} /></NotificationBadge>
        </Row>
      ),
      code: `<NotificationBadge count={3}><BellIcon size={24} /></NotificationBadge>
<NotificationBadge count={120} max={99}><BellIcon size={24} /></NotificationBadge>
<NotificationBadge dot><BellIcon size={24} /></NotificationBadge>`,
    },
    {
      id: "notificationpopover",
      name: "NotificationPopover",
      desc: "Zvoneček s rozbalovacím seznamem upozornění – označit vše jako přečtené, zavřít, kliknout.",
      props: ["NotificationPopover", { type: "NotificationItem", title: "NotificationItem (položka v notifications)" }],
      preview: <NotifDemo />,
      code: `<NotificationPopover
  notifications={items}
  onMarkAllRead={markAllRead}
  onDismiss={(id) => remove(id)}
  onNotificationClick={(id) => open(id)}
/>`,
    },
  ],
};
