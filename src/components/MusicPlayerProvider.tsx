import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import {
  addToQueue as qAdd, clearQueue as qClear, initialQueueState, moveInQueue as qMove, nextRepeat, nextTrack, playFromQueue as qPlayFrom,
  previousTrack, removeFromQueue as qRemove, startTrack, toggleShuffle as qShuffle,
  type QueueState, type RepeatMode, type Step, type Track,
} from "../lib/playerQueue";

export type { Track, RepeatMode } from "../lib/playerQueue";

export interface MusicPlayerLabels {
  /** Chyba, když se soubor nepodaří načíst. */
  loadError: string;
  /** Chyba, když prohlížeč přehrání zablokuje (např. bez kliknutí uživatele). */
  playBlocked: string;
  /** Chyba, když skladba nemá adresu zvukového souboru. */
  noSource: string;
}

const CS_LABELS: MusicPlayerLabels = {
  loadError: "Skladbu se nepodařilo přehrát (neplatný nebo nedostupný soubor).",
  playBlocked: "Přehrávání se nepodařilo spustit.",
  noSource: "Tahle skladba nemá nahraný žádný zvukový soubor.",
};

export interface MusicPlayerProviderProps {
  /** Obsah komponenty. */
  children: ReactNode;
  /** Klíč v `localStorage`, pod kterým se pamatuje hlasitost. `null` = nepamatovat. */
  storageKey?: string | null;
  /** Výchozí hlasitost 0–1, když ještě nic uloženo není. */
  initialVolume?: number;
  /**
   * Zapne klávesové zkratky: mezerník = přehrát / pozastavit, ← → = o 5 s, ↑ ↓ = hlasitost.
   * Nereagují, když je zaměřené textové pole, tlačítko, odkaz nebo posuvník.
   */
  keyboardShortcuts?: boolean;
  /** Zapíše skladbu do ovládání v systému (zamčená obrazovka, multimediální klávesy, Bluetooth). Výchozí zapnuto. */
  mediaSession?: boolean;
  /** Zavolá se, když se začne přehrávat skladba (hodí se pro počítadlo přehrání nebo historii poslechu). */
  onTrackStart?: (track: Track) => void;
  /** Zavolá se, když skladba doznívá sama až do konce. */
  onTrackEnd?: (track: Track) => void;
  /** Zavolá se při chybě přehrávání. */
  onError?: (message: string, track: Track | null) => void;
  /** Přepsání textů chyb (čeština je výchozí). */
  labels?: Partial<MusicPlayerLabels>;
}

export interface PlayOptions {
  /** Celý seznam, ze kterého se hraje (např. playlist). Zbytek za skladbou se stane frontou. */
  list?: readonly Track[];
  /** Ponechá ručně přidanou frontu, když nedáváš `list`. */
  keepQueue?: boolean;
  /** Při `false` se skladba jen připraví (např. obnovení poslední skladby po načtení stránky) a nezačne hrát. Výchozí je `true`. */
  autoplay?: boolean;
}

export interface MusicPlayerState {
  /** Skladba, která právě hraje nebo je připravená. */
  currentTrack: Track | null;
  /** Zda skladba právě hraje. */
  isPlaying: boolean;
  /** Uplynulý čas v sekundách. */
  currentTime: number;
  /** Délka v sekundách (z metadat souboru, jinak z `Track.duration`). */
  duration: number;
  /** Co bude hrát dál. */
  queue: Track[];
  /** Co už hrálo (poslední je nejnovější). */
  history: Track[];
  /** Hlasitost 0–1 (nezávisle na ztlumení). */
  volume: number;
  /** Zda je zvuk ztlumený. */
  muted: boolean;
  /** Zda je zapnuté náhodné pořadí. */
  shuffle: boolean;
  /** Režim opakování: `off`, `all` (celý seznam), `one` (jedna skladba). */
  repeat: RepeatMode;
  /** Text poslední chyby přehrávání, jinak `null`. */
  error: string | null;
  /** Je otevřená fullscreen verze přehrávače. */
  expanded: boolean;

  /** Spustí skladbu. S `options.list` se zbytek seznamu stane frontou. */
  play: (track: Track, options?: PlayOptions) => void;
  /** Přepne přehrávání a pauzu. */
  togglePlay: () => void;
  /** Pozastaví přehrávání. */
  pause: () => void;
  /** Obnoví přehrávání. */
  resume: () => void;
  /** Přeskočí na další skladbu ve frontě. */
  next: () => void;
  /** Předchozí skladba; po 3 sekundách přehrávání jen vrátí aktuální na začátek. */
  previous: () => void;
  /** Přesune přehrávání na daný čas v sekundách. */
  seek: (seconds: number) => void;
  /** Nastaví hlasitost (0–1). */
  setVolume: (volume: number) => void;
  /** Ztlumí nebo vrátí zvuk. */
  toggleMute: () => void;
  /** Přidá do fronty. S `{ next: true }` hned za aktuální skladbu. */
  addToQueue: (track: Track, options?: { next?: boolean }) => void;
  /** Odebere skladbu z fronty podle indexu. */
  removeFromQueue: (index: number) => void;
  /** Přehraje skladbu z fronty a přeskočené skladby před ní zapíše do historie. */
  playFromQueue: (index: number) => void;
  /** Přesune skladbu ve frontě z jedné pozice na druhou. */
  moveInQueue: (from: number, to: number) => void;
  /** Vyprázdní frontu. */
  clearQueue: () => void;
  /** Zapne nebo vypne náhodné pořadí. */
  toggleShuffle: () => void;
  /** Nastaví režim opakování. */
  setRepeat: (mode: RepeatMode) => void;
  /** Přepne opakování: vypnuto → vše → jedna → vypnuto. */
  cycleRepeat: () => void;
  /** Otevře nebo zavře fullscreen přehrávač. */
  setExpanded: (expanded: boolean) => void;
}

const Ctx = createContext<MusicPlayerState | null>(null);

/** Přístup k přehrávači. Funguje jen uvnitř `MusicPlayerProvider`. */
export function useMusicPlayer(): MusicPlayerState {
  const v = useContext(Ctx);
  if (!v) throw new Error("useMusicPlayer musí být uvnitř <MusicPlayerProvider>");
  return v;
}

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

/**
 * Přehrávač bez vzhledu: drží zvuk, frontu, historii, míchání, opakování a hlasitost.
 * Vzhled doplňují `MiniPlayer`, `FullscreenPlayer` a `PlayerQueue`, nebo si postavíš vlastní přes `useMusicPlayer`.
 * Žádný server ani účet nepotřebuje, vlastní data (oblíbené, počítadla) napojíš přes `onTrackStart` a `onTrackEnd`.
 */
export function MusicPlayerProvider({
  children, storageKey = "cbb-player-volume", initialVolume = 1, keyboardShortcuts = false, mediaSession = true,
  onTrackStart, onTrackEnd, onError, labels,
}: MusicPlayerProviderProps) {
  const L = { ...CS_LABELS, ...labels };
  const audio = useRef<HTMLAudioElement | null>(null);
  // Zdroj pravdy je ref: posluchače zvuku se registrují jednou, a kdyby četly stav Reactu, viděly by jen jeho starou hodnotu.
  const qs = useRef<QueueState>(initialQueueState);
  const [q, setQ] = useState<QueueState>(initialQueueState);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [mediaDuration, setMediaDuration] = useState(0);
  const [volume, setVolumeState] = useState(clamp01(initialVolume));
  const [muted, setMuted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);

  // Nejnovější hodnoty pro posluchače, které se registrují jen jednou.
  const live = useRef({ onTrackStart, onTrackEnd, onError, L, volume, muted });
  live.current = { onTrackStart, onTrackEnd, onError, L, volume, muted };

  const commit = useCallback((next: QueueState) => {
    qs.current = next;
    setQ(next);
  }, []);

  const fail = useCallback((message: string) => {
    setError(message);
    setIsPlaying(false);
    live.current.onError?.(message, qs.current.current);
  }, []);

  /** Vyhodnotí odmítnutý `play()`: přerušení novým načtením není chyba, nepodporovaný nebo nedostupný soubor je chyba souboru, ostatní blokuje prohlížeč. */
  const playFailed = useCallback(
    (e: unknown) => {
      if (e instanceof DOMException && e.name === "AbortError") return;
      fail(e instanceof DOMException && e.name === "NotSupportedError" ? live.current.L.loadError : live.current.L.playBlocked);
    },
    [fail]
  );

  /** Načte a spustí skladbu. */
  const load = useCallback(
    (track: Track, restart = false) => {
      const a = audio.current;
      setError(null);
      if (!a) return;
      if (!track.src) {
        a.pause();
        fail(live.current.L.noSource);
        return;
      }
      if (restart && a.src && a.src === new URL(track.src, document.baseURI).href) a.currentTime = 0;
      else {
        a.src = track.src;
        setCurrentTime(0);
        setMediaDuration(0);
      }
      const p = a.play();
      p?.catch(playFailed);
      live.current.onTrackStart?.(track);
    },
    [fail, playFailed]
  );

  const run = useCallback(
    (step: Step) => {
      commit(step.state);
      if (step.play) load(step.play, step.restart);
      else if (audio.current) {
        // Došla fronta: zastavit a připravit na začátek, ať jde skladbu pustit znovu.
        audio.current.pause();
        audio.current.currentTime = 0;
        setCurrentTime(0);
      }
    },
    [commit, load]
  );

  // Zvukový prvek se vytváří až v prohlížeči (na serveru neexistuje).
  useEffect(() => {
    const a = new Audio();
    a.preload = "metadata";
    audio.current = a;
    let stored: number | null = null;
    if (storageKey) {
      try {
        const raw = localStorage.getItem(storageKey);
        if (raw !== null && !Number.isNaN(parseFloat(raw))) stored = clamp01(parseFloat(raw));
      } catch { /* úložiště nemusí být dostupné */ }
    }
    const vol = stored ?? clamp01(live.current.volume);
    a.volume = vol;
    setVolumeState(vol);

    const on = {
      timeupdate: () => setCurrentTime(a.currentTime),
      loadedmetadata: () => setMediaDuration(Number.isFinite(a.duration) ? a.duration : 0),
      durationchange: () => setMediaDuration(Number.isFinite(a.duration) ? a.duration : 0),
      play: () => setIsPlaying(true),
      pause: () => setIsPlaying(false),
      ended: () => {
        const done = qs.current.current;
        if (done) live.current.onTrackEnd?.(done);
        setIsPlaying(false);
        run(nextTrack(qs.current, true));
      },
      error: () => {
        // Prázdný `src` při úklidu není chyba.
        if (a.getAttribute("src")) fail(live.current.L.loadError);
      },
    };
    for (const [k, fn] of Object.entries(on)) a.addEventListener(k, fn);
    return () => {
      for (const [k, fn] of Object.entries(on)) a.removeEventListener(k, fn);
      a.pause();
      a.removeAttribute("src");
      a.load();
      audio.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (audio.current) audio.current.muted = muted;
  }, [muted]);

  const play = useCallback(
    (track: Track, options: PlayOptions = {}) => {
      commit(startTrack(qs.current, track, options.list, { keepQueue: options.keepQueue }));
      if (options.autoplay === false && audio.current) {
        setError(null);
        audio.current.src = track.src;
        setCurrentTime(0);
        setMediaDuration(0);
        return;
      }
      load(track);
    },
    [commit, load]
  );

  const resume = useCallback(() => {
    const a = audio.current;
    if (!a || !qs.current.current) return;
    if (!a.src) {
      load(qs.current.current);
      return;
    }
    a.play().catch(playFailed);
  }, [load, playFailed]);
  const pause = useCallback(() => audio.current?.pause(), []);
  const togglePlay = useCallback(() => {
    if (audio.current && !audio.current.paused) audio.current.pause();
    else resume();
  }, [resume]);

  const next = useCallback(() => run(nextTrack(qs.current, false)), [run]);
  const previous = useCallback(() => run(previousTrack(qs.current, audio.current?.currentTime ?? 0)), [run]);
  const seek = useCallback((seconds: number) => {
    const a = audio.current;
    if (!a) return;
    const max = Number.isFinite(a.duration) && a.duration > 0 ? a.duration : seconds;
    const t = Math.min(max, Math.max(0, seconds));
    a.currentTime = t;
    setCurrentTime(t);
  }, []);

  const setVolume = useCallback(
    (v: number) => {
      const c = clamp01(v);
      setVolumeState(c);
      if (audio.current) audio.current.volume = c;
      if (c > 0) setMuted(false);
      if (storageKey) {
        try { localStorage.setItem(storageKey, String(c)); } catch { /* úložiště nemusí být dostupné */ }
      }
    },
    [storageKey]
  );
  const toggleMute = useCallback(() => setMuted((m) => !m), []);

  const addToQueue = useCallback((t: Track, o?: { next?: boolean }) => commit(qAdd(qs.current, t, o?.next)), [commit]);
  const removeFromQueue = useCallback((i: number) => commit(qRemove(qs.current, i)), [commit]);
  const playFromQueue = useCallback((i: number) => run(qPlayFrom(qs.current, i)), [run]);
  const moveInQueue = useCallback((from: number, to: number) => commit(qMove(qs.current, from, to)), [commit]);
  const clearQueue = useCallback(() => commit(qClear(qs.current)), [commit]);
  const toggleShuffle = useCallback(() => commit(qShuffle(qs.current)), [commit]);
  const setRepeat = useCallback((mode: RepeatMode) => commit({ ...qs.current, repeat: mode }), [commit]);
  const cycleRepeat = useCallback(() => commit({ ...qs.current, repeat: nextRepeat(qs.current.repeat) }), [commit]);

  // Ovládání v systému (zamčená obrazovka, multimediální klávesy, sluchátka).
  const fns = useRef({ togglePlay, pause, resume, next, previous, seek });
  fns.current = { togglePlay, pause, resume, next, previous, seek };
  useEffect(() => {
    if (!mediaSession || typeof navigator === "undefined" || !("mediaSession" in navigator)) return;
    const ms = navigator.mediaSession;
    const set = (a: MediaSessionAction, h: MediaSessionActionHandler | null) => {
      try { ms.setActionHandler(a, h); } catch { /* akci prohlížeč nepodporuje */ }
    };
    set("play", () => fns.current.resume());
    set("pause", () => fns.current.pause());
    set("previoustrack", () => fns.current.previous());
    set("nexttrack", () => fns.current.next());
    set("seekto", (d) => { if (d.seekTime != null) fns.current.seek(d.seekTime); });
    return () => {
      for (const a of ["play", "pause", "previoustrack", "nexttrack", "seekto"] as const) set(a, null);
    };
  }, [mediaSession]);
  const track = q.current;
  useEffect(() => {
    if (!mediaSession || typeof navigator === "undefined" || !("mediaSession" in navigator) || typeof MediaMetadata === "undefined") return;
    navigator.mediaSession.metadata = track
      ? new MediaMetadata({ title: track.title, artist: track.artist ?? "", album: track.album ?? "", artwork: track.cover ? [{ src: track.cover }] : [] })
      : null;
  }, [track, mediaSession]);

  useEffect(() => {
    if (!keyboardShortcuts) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey || !qs.current.current) return;
      const el = e.target as HTMLElement | null;
      if (el?.closest("input, textarea, select, button, a, [contenteditable='true'], [role='slider'], [role='textbox']")) return;
      const a = audio.current;
      if (!a) return;
      const step: Record<string, () => void> = {
        Space: () => fns.current.togglePlay(),
        ArrowLeft: () => fns.current.seek(a.currentTime - 5),
        ArrowRight: () => fns.current.seek(a.currentTime + 5),
        ArrowUp: () => setVolume(a.volume + 0.05),
        ArrowDown: () => setVolume(a.volume - 0.05),
      };
      const fn = step[e.code];
      if (fn) {
        e.preventDefault();
        fn();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [keyboardShortcuts, setVolume]);

  const duration = mediaDuration || q.current?.duration || 0;

  const value = useMemo<MusicPlayerState>(
    () => ({
      currentTrack: q.current, isPlaying, currentTime, duration, queue: q.queue, history: q.history, volume, muted, shuffle: q.shuffle,
      repeat: q.repeat, error, expanded,
      play, togglePlay, pause, resume, next, previous, seek, setVolume, toggleMute, addToQueue, removeFromQueue, playFromQueue,
      moveInQueue, clearQueue, toggleShuffle, setRepeat, cycleRepeat, setExpanded,
    }),
    [q, isPlaying, currentTime, duration, volume, muted, error, expanded, play, togglePlay, pause, resume, next, previous, seek, setVolume,
      toggleMute, addToQueue, removeFromQueue, playFromQueue, moveInQueue, clearQueue, toggleShuffle, setRepeat, cycleRepeat]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
