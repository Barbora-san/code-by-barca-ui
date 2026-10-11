import { useRef, useState } from "react";
import { cn } from "../lib/cn";
import { Checkbox } from "./Checkbox";
import { PlusIcon, XIcon } from "./Icons";

export type TodoPriority = "high" | "medium" | "low";

export interface TodoItem {
  /** Unikátní ID úkolu. */
  id: string;
  /** Text úkolu. */
  text: string;
  /** Zda je úkol hotový. */
  done: boolean;
  /** Priorita úkolu. */
  priority: TodoPriority;
}

export interface TodoListLabels {
  /** Text zobrazený v prázdném poli. */
  placeholder?: string;
  /** Text tlačítka přidání úkolu. */
  add?: string;
  /** Popisek filtru „vše“. */
  all?: string;
  /** Zda je prvek otevřený. Řízený stav – spolu s `onClose` / `onOpenChange`. */
  open?: string;
  /** Popisek filtru „hotové“. */
  done?: string;
  /** Slovo za počtem zbývajících úkolů. */
  left?: (n: number) => string;
  /** Text, když není žádný úkol. */
  empty?: string;
  /** Názvy priorit (`high`, `medium`, `low`). */
  priority?: Record<TodoPriority, string>;
}

export interface TodoListProps {
  /** Řízený seznam úkolů. Když ho předáš, musíš aktualizovat i `onChange`. */
  items?: TodoItem[];
  /** Počáteční úkoly (neřízené použití). */
  defaultItems?: TodoItem[];
  /** Zavolá se po každé změně (přidání, odškrtnutí, smazání) s novým seznamem. */
  onChange?: (items: TodoItem[]) => void;
  /** Překlad textů v komponentě – výchozí je čeština. */
  labels?: TodoListLabels;
  /** Vlastní CSS třída přidaná ke kořenovému prvku. */
  className?: string;
}

const DEFAULT_PRIORITY: Record<TodoPriority, string> = { high: "Vysoká", medium: "Střední", low: "Nízká" };
const PRIORITIES: TodoPriority[] = ["high", "medium", "low"];

/** Úkolníček s prioritami, filtrem a přidáváním. Funguje řízeně i neřízeně. */
export function TodoList({ items, defaultItems = [], onChange, labels, className }: TodoListProps) {
  const L = {
    placeholder: "Nový úkol…",
    add: "Přidat",
    all: "Vše",
    open: "Aktivní",
    done: "Hotové",
    left: (n: number) => `${n} zbývá`,
    empty: "Žádné úkoly",
    ...labels,
    priority: { ...DEFAULT_PRIORITY, ...labels?.priority },
  };
  const [inner, setInner] = useState(defaultItems);
  const list = items ?? inner;
  const [text, setText] = useState("");
  const [prio, setPrio] = useState<TodoPriority>("medium");
  const [filter, setFilter] = useState<"all" | "open" | "done">("all");
  const counter = useRef(0);
  const uid = () =>
    typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `todo-${Date.now()}-${counter.current++}`;
  const commit = (next: TodoItem[]) => {
    setInner(next);
    onChange?.(next);
  };
  const shown = list.filter((i) => filter === "all" || (filter === "done") === i.done);
  const left = list.filter((i) => !i.done).length;

  return (
    <div className={cn("cbb-todo", className)}>
      <form
        className="cbb-todo__form"
        onSubmit={(e) => {
          e.preventDefault();
          if (!text.trim()) return;
          commit([...list, { id: uid(), text: text.trim(), done: false, priority: prio }]);
          setText("");
        }}
      >
        <input value={text} onChange={(e) => setText(e.target.value)} placeholder={L.placeholder} aria-label={L.placeholder} />
        <select value={prio} onChange={(e) => setPrio(e.target.value as TodoPriority)} aria-label="Priorita">
          {PRIORITIES.map((p) => (
            <option key={p} value={p}>
              {L.priority[p]}
            </option>
          ))}
        </select>
        <button type="submit" className="cbb-todo__add">
          <PlusIcon size={16} /> {L.add}
        </button>
      </form>
      <div className="cbb-todo__bar">
        {(
          [
            ["all", L.all],
            ["open", L.open],
            ["done", L.done],
          ] as const
        ).map(([v, l]) => (
          <button key={v} type="button" className={filter === v ? "is-active" : ""} aria-pressed={filter === v} onClick={() => setFilter(v)}>
            {l}
          </button>
        ))}
        <span>{L.left(left)}</span>
      </div>
      <ul className="cbb-todo__list">
        {shown.map((it) => (
          <li key={it.id} className={it.done ? "is-done" : ""}>
            <Checkbox
              checked={it.done}
              aria-label={it.text}
              onChange={() => commit(list.map((x) => (x.id === it.id ? { ...x, done: !x.done } : x)))}
            />
            <span className="cbb-todo__text">{it.text}</span>
            <em className={`is-${it.priority}`}>{L.priority[it.priority]}</em>
            <button type="button" className="cbb-todo__del" aria-label={`× ${it.text}`} onClick={() => commit(list.filter((x) => x.id !== it.id))}>
              <XIcon size={14} />
            </button>
          </li>
        ))}
        {!shown.length && <li className="cbb-todo__empty">{L.empty}</li>}
      </ul>
    </div>
  );
}
