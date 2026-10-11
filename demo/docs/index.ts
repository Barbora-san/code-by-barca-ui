import { basics } from "./basics";
import { forms } from "./forms";
import { display } from "./display";
import { feedback } from "./feedback";
import { overlays } from "./overlays";
import { navigation } from "./navigation";
import { dataCat, utils } from "./data";
import { DATE_DOCS } from "./dates";
import { EFFECT_DOCS } from "./effects";
import { CHART_DOCS } from "./charts";
import { BASIC2_DOCS } from "./basics2";
import { THEME_DOCS } from "./theme";
import { EDITOR_DOCS } from "./editors";
import { PLAYER_DOCS } from "./player";
import type { Category, Doc } from "./types";

// Všechny bloky na jednom místě; nové (DATE_DOCS) přepíšou starší se stejným id.
const ALL = new Map<string, Doc>();
for (const c of [basics, forms, display, feedback, overlays, navigation, dataCat, utils]) for (const d of c.docs) ALL.set(d.id, d);
for (const d of DATE_DOCS) ALL.set(d.id, d);
for (const d of EFFECT_DOCS) ALL.set(d.id, d);
for (const d of CHART_DOCS) ALL.set(d.id, d);
for (const d of BASIC2_DOCS) ALL.set(d.id, d);
for (const d of THEME_DOCS) ALL.set(d.id, d);
for (const d of EDITOR_DOCS) ALL.set(d.id, d);
for (const d of PLAYER_DOCS) ALL.set(d.id, d);

/** Pořadí a rozřazení do kategorií – jediné místo, které se upravuje. */
const LAYOUT: { id: string; title: string; ids: string[] }[] = [
  { id: "zaklady", title: "Základy", ids: ["button", "fab", "badge", "chip", "kbd", "divider", "spinner", "themetoggle", "typewriter", "reveal", "sectionheading", "icons"] },
  { id: "vstupy", title: "Vstupy", ids: ["input", "checkbox", "radio", "switch", "toggle", "slider", "taginput", "inputotp", "numberinput", "passwordinput", "multiselect", "rating", "markdowneditor", "tableeditor", "fileupload", "datepicker", "datetimepicker", "calendar", "daterangepicker", "searchbar", "searchautocomplete", "contactform"] },
  { id: "zobrazeni", title: "Zobrazení", ids: ["card", "statcard", "avatar", "skeleton", "progress", "skillcard", "skilllevelbar", "projectcard", "promoqrcard", "timeline", "inforow", "codeblock", "markdownview", "lazyimage", "emptystate"] },
  { id: "data", title: "Data a filtrování", ids: ["usefilter", "filterpills", "filterdropdown", "table", "datatable", "todolist", "carousel"] },
  { id: "grafy", title: "Grafy", ids: ["areachart", "linechart", "barchart", "radarchart"] },
  { id: "zpetna-vazba", title: "Zpětná vazba", ids: ["alert", "alertbar", "toast", "notificationbadge", "notificationpopover", "cookiebanner", "scrollprogress"] },
  { id: "prekryvy", title: "Překryvy a plovoucí", ids: ["dialog", "alertdialog", "commandpalette", "paymentsummary", "messagebox", "sheet", "lightbox", "tooltip", "popover", "hovercard", "dropdown", "contextmenu", "menulist"] },
  { id: "navigace", title: "Navigace", ids: ["navbar", "sidebar", "menubar", "tabs", "breadcrumb", "pagination", "stepper"] },
  { id: "layout", title: "Layout a rozbalování", ids: ["accordion", "collapsible", "resizable", "scrollarea"] },
  { id: "efekty", title: "Efekty a interaktivní prvky", ids: ["flipcard", "tiltcard", "beforeafter", "folder", "wallet3d", "floatinginput", "marquee", "audiovisualizer"] },
  { id: "hudba", title: "Hudba", ids: ["musicplayer", "miniplayer", "fullscreenplayer", "playerqueue", "musicplayerprovider", "usemusicplayer"] },
  { id: "hooky", title: "Hooky a utility", ids: ["usescrollreveal", "useescape", "uselockbodyscroll", "usetheme", "usehotkey", "usedebounce", "usemediaquery", "uselocalstorage", "usecopytoclipboard", "usedisclosure", "usefocustrap", "floating", "cbbprovider", "cn"] },
];

const placed = new Set(LAYOUT.flatMap((c) => c.ids));
const missing = [...ALL.keys()].filter((id) => !placed.has(id));
const unknown = [...placed].filter((id) => !ALL.has(id));
if (missing.length || unknown.length) throw new Error(`docs/index.ts: nezařazené bloky: [${missing}] neexistující: [${unknown}]`);

export const CATEGORIES: Category[] = LAYOUT.map((c) => ({ id: c.id, title: c.title, docs: c.ids.map((id) => ALL.get(id)!) }));
export type { Category, Doc } from "./types";
