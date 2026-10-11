/**
 * Čistá logika fronty přehrávače (bez Reactu a bez zvuku), aby šla jednoduše otestovat.
 * Všechny funkce vrací nový stav a původní nikdy nemění.
 */

/** Jedna skladba. */
export interface Track {
  /** Jedinečné id (slouží k rozlišení skladeb při míchání a obnovení pořadí). */
  id: string | number;
  title: string;
  artist?: string;
  album?: string;
  /** Adresa zvukového souboru. */
  src: string;
  /** Adresa obalu alba. */
  cover?: string;
  /** Délka v sekundách, pokud ji znáš dopředu (zobrazí se, než se načtou metadata). */
  duration?: number;
}

/** Opakování: vypnuto, celý seznam, jedna skladba. */
export type RepeatMode = "off" | "all" | "one";

export interface QueueState {
  /** Skladba, která právě hraje (nebo je připravená). */
  current: Track | null;
  /** Co bude hrát dál, v tomto pořadí. */
  queue: Track[];
  /** Co už hrálo (poslední je nejnovější), pro tlačítko „předchozí“. */
  history: Track[];
  /** Původní nezamíchaný seznam (playlist), ze kterého se hrálo. Slouží pro „opakovat vše“ a vypnutí shuffle. */
  context: Track[];
  shuffle: boolean;
  repeat: RepeatMode;
}

export const MAX_HISTORY = 50;

export const initialQueueState: QueueState = { current: null, queue: [], history: [], context: [], shuffle: false, repeat: "off" };

type Rnd = () => number;

/** Fisher–Yates; původní pole nemění. */
export function shuffled<T>(list: readonly T[], rnd: Rnd = Math.random): T[] {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [a[i], a[j]] = [a[j]!, a[i]!];
  }
  return a;
}

const pushHistory = (h: Track[], t: Track | null) => (t ? [...h, t].slice(-MAX_HISTORY) : h);

export interface StartOptions {
  /** Ponechat ručně přidanou frontu (výchozí je nahradit ji zbytkem seznamu). */
  keepQueue?: boolean;
}

/** Spustí skladbu. Když dostane celý seznam, zbytek za ní se stane frontou (zamíchaný, pokud je zapnutý shuffle). */
export function startTrack(s: QueueState, track: Track, list?: readonly Track[], opts: StartOptions = {}, rnd: Rnd = Math.random): QueueState {
  const history = pushHistory(s.history, s.current);
  if (list && list.length > 0) {
    const idx = list.findIndex((t) => t.id === track.id);
    const rest = idx >= 0 ? list.slice(idx + 1) : [...list];
    return { ...s, current: track, history, context: [...list], queue: s.shuffle ? shuffled(rest, rnd) : rest };
  }
  return { ...s, current: track, history, context: opts.keepQueue ? s.context : [], queue: opts.keepQueue ? s.queue : [] };
}

export interface Step {
  state: QueueState;
  /** Skladba, kterou má přehrávač spustit. `null` = nemá co hrát, zastavit. */
  play: Track | null;
  /** Je to ta samá skladba od začátku (opakování jedné, restart). */
  restart?: boolean;
}

/**
 * Posun na další skladbu.
 * `auto` = skladba doznila sama. Při opakování jedné se pak hraje stejná znovu,
 * kdežto tlačítko „další“ (auto = false) přejde na další skladbu i při opakování jedné.
 */
export function nextTrack(s: QueueState, auto = false, rnd: Rnd = Math.random): Step {
  if (auto && s.repeat === "one" && s.current) return { state: s, play: s.current, restart: true };

  if (s.queue.length > 0) {
    const [first, ...rest] = s.queue;
    return { state: { ...s, current: first!, queue: rest, history: pushHistory(s.history, s.current) }, play: first! };
  }

  if (s.repeat === "all" && s.current) {
    const list = s.context.length > 0 ? s.context : [s.current];
    if (list.length === 1) return { state: s, play: list[0]!, restart: true };
    const order = s.shuffle ? shuffled(list, rnd) : [...list];
    const [first, ...rest] = order;
    return { state: { ...s, current: first!, queue: rest, history: pushHistory(s.history, s.current) }, play: first! };
  }

  return { state: s, play: null };
}

/** Předchozí skladba. Když už hraje déle než `restartAfter` sekund, jen se vrátí na začátek (jako Spotify a Apple Music). */
export function previousTrack(s: QueueState, elapsed: number, restartAfter = 3): Step {
  if (!s.current) return { state: s, play: null };
  if (elapsed > restartAfter || s.history.length === 0) return { state: s, play: s.current, restart: true };
  const prev = s.history[s.history.length - 1]!;
  return { state: { ...s, current: prev, history: s.history.slice(0, -1), queue: [s.current, ...s.queue] }, play: prev };
}

/** Přidá skladbu na konec fronty, nebo na začátek (`next`), aby hrála hned po aktuální. */
export function addToQueue(s: QueueState, track: Track, next = false): QueueState {
  return { ...s, queue: next ? [track, ...s.queue] : [...s.queue, track] };
}

export function removeFromQueue(s: QueueState, index: number): QueueState {
  if (index < 0 || index >= s.queue.length) return s;
  return { ...s, queue: s.queue.filter((_, i) => i !== index) };
}

export function clearQueue(s: QueueState): QueueState {
  return { ...s, queue: [] };
}

/** Přesune skladbu ve frontě z jedné pozice na jinou. */
export function moveInQueue(s: QueueState, from: number, to: number): QueueState {
  const n = s.queue.length;
  if (from < 0 || from >= n || to < 0 || to >= n || from === to) return s;
  const q = [...s.queue];
  const [t] = q.splice(from, 1);
  q.splice(to, 0, t!);
  return { ...s, queue: q };
}

/** Přehraje skladbu z fronty hned. Přeskočené skladby před ní se zapíšou do historie, jako by zahrály. */
export function playFromQueue(s: QueueState, index: number): Step {
  const chosen = s.queue[index];
  if (!chosen) return { state: s, play: null };
  let history = pushHistory(s.history, s.current);
  for (const skipped of s.queue.slice(0, index)) history = pushHistory(history, skipped);
  return { state: { ...s, current: chosen, history, queue: s.queue.slice(index + 1) }, play: chosen };
}

/** Zapne nebo vypne míchání. Při vypnutí se obnoví původní pořadí a ručně přidané skladby zůstanou na konci. */
export function toggleShuffle(s: QueueState, rnd: Rnd = Math.random): QueueState {
  if (!s.shuffle) return { ...s, shuffle: true, queue: shuffled(s.queue, rnd) };
  const left = new Map<string | number, number>();
  for (const t of s.queue) left.set(t.id, (left.get(t.id) ?? 0) + 1);
  const at = s.current ? s.context.findIndex((t) => t.id === s.current!.id) : -1;
  const ordered: Track[] = [];
  for (const t of at >= 0 ? s.context.slice(at + 1) : s.context) {
    const c = left.get(t.id) ?? 0;
    if (c > 0) {
      ordered.push(t);
      left.set(t.id, c - 1);
    }
  }
  const extras: Track[] = [];
  for (const t of s.queue) {
    const c = left.get(t.id) ?? 0;
    if (c > 0) { extras.push(t); left.set(t.id, c - 1); }
  }
  return { ...s, shuffle: false, queue: [...ordered, ...extras] };
}

export const nextRepeat = (r: RepeatMode): RepeatMode => (r === "off" ? "all" : r === "all" ? "one" : "off");
