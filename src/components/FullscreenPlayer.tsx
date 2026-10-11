import { useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { cn } from "../lib/cn";
import { useEscape } from "../hooks/useEscape";
import { useFocusTrap } from "../hooks/useFocusTrap";
import { useLockBodyScroll } from "../hooks/useLockBodyScroll";
import { CS_PLAYER_LABELS, formatTime, type PlayerLabels } from "../lib/playerLabels";
import type { Track } from "../lib/playerQueue";
import {
  ChevronDownIcon, MusicIcon, PauseIcon, PlayIcon, Repeat1Icon, RepeatIcon, ShuffleIcon, SkipBackIcon, SkipForwardIcon,
  VolumeHighIcon, VolumeLowIcon, VolumeMuteIcon,
} from "./Icons";
import { useMusicPlayer } from "./MusicPlayerProvider";
import { PlayerQueue } from "./PlayerQueue";
import { PlayerSeek } from "./PlayerSeek";

export interface FullscreenPlayerProps {
  /** Řízené otevření. Bez zadání se řídí stavem přehrávače (`expanded`), který mění `MiniPlayer` a `setExpanded`. */
  open?: boolean;
  /** Zavolá se při zavření (tlačítko, Esc). Bez zadání se zavře přes `setExpanded(false)`. */
  onClose?: () => void;
  /** Vlastní tlačítka vedle názvu skladby (oblíbené, přidat do playlistu…). Dostane aktuální skladbu. */
  actions?: (track: Track) => ReactNode;
  /** Posuvník času ve tvaru zvukové stopy. Při `false` je to tenká čára. */
  waveform?: boolean;
  /** Se kterým panelem začíná úzká obrazovka (na široké jsou vidět oba vedle sebe). */
  defaultTab?: "player" | "queue";
  /** Přepsání textů (čeština je výchozí). */
  labels?: Partial<PlayerLabels>;
  /** Vlastní CSS třída přidaná ke kořenovému prvku. */
  className?: string;
}

/** Fullscreen přehrávač: velký obal, zvuková stopa, ovládání, hlasitost a fronta s přeřazováním. */
export function FullscreenPlayer({ open, onClose, actions, waveform = true, defaultTab = "player", labels, className }: FullscreenPlayerProps) {
  const L = { ...CS_PLAYER_LABELS, ...labels };
  const p = useMusicPlayer();
  const isOpen = open ?? p.expanded;
  const close = onClose ?? (() => p.setExpanded(false));
  const t = p.currentTrack;
  const [tab, setTab] = useState(defaultTab);
  const [mounted, setMounted] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const visible = isOpen && !!t && mounted;

  useEffect(() => setMounted(true), []);
  useEscape(visible, close);
  useLockBodyScroll(visible);
  useFocusTrap(root, visible);
  useEffect(() => {
    if (!visible) return;
    const before = document.activeElement as HTMLElement | null;
    root.current?.focus();
    return () => before?.focus?.();
  }, [visible]);

  if (!visible || !t) return null;

  const silent = p.muted || p.volume === 0;
  const VolI = silent ? VolumeMuteIcon : p.volume < 0.5 ? VolumeLowIcon : VolumeHighIcon;
  const RepeatI = p.repeat === "one" ? Repeat1Icon : RepeatIcon;
  const repeatLabel = p.repeat === "one" ? L.repeatOne : p.repeat === "all" ? L.repeatAll : L.repeatOff;

  return createPortal(
    <div ref={root} className={cn("cbb-fp", className)} role="dialog" aria-modal="true" aria-label={L.player} tabIndex={-1}>
      <div className={cn("cbb-fp__bg", !t.cover && "is-plain")} style={t.cover ? { backgroundImage: `url("${t.cover}")` } : undefined} aria-hidden="true" />
      <div className="cbb-fp__shade" aria-hidden="true" />

      <header className="cbb-fp__bar">
        <button type="button" className="cbb-fp__iconbtn" onClick={close} aria-label={L.collapse} title={L.collapse}>
          <ChevronDownIcon size={22} />
        </button>
        <span className="cbb-fp__bartitle">{L.nowPlaying}</span>
        <div className="cbb-fp__tabs" role="tablist">
          {(["player", "queue"] as const).map((k) => (
            <button key={k} type="button" role="tab" aria-selected={tab === k} className={cn("cbb-fp__tab", tab === k && "is-active")} onClick={() => setTab(k)}>
              {k === "player" ? L.player : L.queue}
            </button>
          ))}
        </div>
      </header>

      <div className="cbb-fp__body" data-tab={tab}>
        <div className="cbb-fp__stage">
          <div className="cbb-fp__inner">
            <div className={cn("cbb-fp__cover", p.isPlaying && "is-playing")}>
              {t.cover ? <img src={t.cover} alt="" /> : <MusicIcon size={72} />}
            </div>

            <div className="cbb-fp__info">
              <div className="cbb-fp__text">
                <h2 className="cbb-fp__title">{t.title}</h2>
                {(t.artist || t.album) && <p className="cbb-fp__artist">{[t.artist, t.album].filter(Boolean).join(" · ")}</p>}
              </div>
              {actions && <div className="cbb-fp__actions">{actions(t)}</div>}
            </div>
            {p.error && <p className="cbb-fp__error" role="alert">{p.error}</p>}

            <div className="cbb-fp__seek">
              <PlayerSeek value={p.currentTime} max={p.duration} onSeek={p.seek} variant={waveform ? "waveform" : "line"} seed={t.id} labels={L} />
              <div className="cbb-fp__times">
                <span>{formatTime(p.currentTime)}</span>
                <span>{formatTime(p.duration)}</span>
              </div>
            </div>

            <div className="cbb-fp__controls">
              <button type="button" className={cn("cbb-fp__btn cbb-mode", p.shuffle && "is-on")} onClick={p.toggleShuffle} aria-pressed={p.shuffle} title={L.shuffle} aria-label={L.shuffle}>
                <ShuffleIcon size={20} />
              </button>
              <button type="button" className="cbb-fp__btn" onClick={p.previous} title={L.previous} aria-label={L.previous}>
                <SkipBackIcon size={26} />
              </button>
              <button type="button" className="cbb-fp__play" onClick={p.togglePlay} title={p.isPlaying ? L.pause : L.play} aria-label={p.isPlaying ? L.pause : L.play}>
                {p.isPlaying ? <PauseIcon size={28} /> : <PlayIcon size={28} />}
              </button>
              <button type="button" className="cbb-fp__btn" onClick={p.next} title={L.next} aria-label={L.next}>
                <SkipForwardIcon size={26} />
              </button>
              <button type="button" className={cn("cbb-fp__btn cbb-mode", p.repeat !== "off" && "is-on")} onClick={p.cycleRepeat} title={repeatLabel} aria-label={repeatLabel}>
                <RepeatI size={20} />
              </button>
            </div>

            <div className="cbb-fp__volume">
              <button type="button" className="cbb-fp__btn" onClick={p.toggleMute} aria-pressed={silent} title={silent ? L.unmute : L.mute} aria-label={silent ? L.unmute : L.mute}>
                <VolI size={20} />
              </button>
              <input
                type="range"
                className="cbb-mp__range"
                min={0}
                max={1}
                step={0.01}
                value={p.muted ? 0 : p.volume}
                onChange={(e) => p.setVolume(parseFloat(e.target.value))}
                aria-label={L.volume}
                style={{ "--cbb-fill": `${(p.muted ? 0 : p.volume) * 100}%` } as React.CSSProperties}
              />
            </div>
          </div>
        </div>

        <aside className="cbb-fp__queue">
          <PlayerQueue labels={labels} />
        </aside>
      </div>
    </div>,
    document.body
  );
}
