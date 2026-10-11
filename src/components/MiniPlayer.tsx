import type { ReactNode } from "react";
import { cn } from "../lib/cn";
import { CS_PLAYER_LABELS, formatTime, type PlayerLabels } from "../lib/playerLabels";
import type { Track } from "../lib/playerQueue";
import {
  ChevronUpIcon, MusicIcon, PauseIcon, PlayIcon, Repeat1Icon, RepeatIcon, ShuffleIcon, SkipBackIcon, SkipForwardIcon,
  VolumeHighIcon, VolumeLowIcon, VolumeMuteIcon,
} from "./Icons";
import { useMusicPlayer } from "./MusicPlayerProvider";
import { PlayerSeek } from "./PlayerSeek";

export interface MiniPlayerProps {
  /** `fixed` přilepí lištu k dolnímu okraji okna, `static` ji vloží na místo v textu (např. do karty nebo postranního panelu). */
  position?: "fixed" | "static";
  /** Místo vlastních tlačítek vpravo od názvu skladby (oblíbené, přidat do playlistu…). Dostane aktuální skladbu. */
  actions?: (track: Track) => ReactNode;
  /** Zobrazit hlasitost (na úzkých obrazovkách se skrývá vždy). */
  showVolume?: boolean;
  /** Zobrazit tlačítka náhodného pořadí a opakování. */
  showModes?: boolean;
  /** Zobrazit tlačítko, které otevře fullscreen. Klik na obal a název ho otevře také. */
  expandable?: boolean;
  /** Když nic nehraje, nevykreslit nic. Jinak se ukáže prázdná lišta. */
  hideWhenEmpty?: boolean;
  /** Přepsání textů (čeština je výchozí). */
  labels?: Partial<PlayerLabels>;
  /** Vlastní CSS třída přidaná ke kořenovému prvku. */
  className?: string;
}

/** Mini přehrávač: obal, název, ovládání, čas a hlasitost v jedné liště. */
export function MiniPlayer({
  position = "fixed", actions, showVolume = true, showModes = true, expandable = true, hideWhenEmpty = true, labels, className,
}: MiniPlayerProps) {
  const L = { ...CS_PLAYER_LABELS, ...labels };
  const p = useMusicPlayer();
  const t = p.currentTrack;
  if (!t && hideWhenEmpty) return null;

  const open = () => expandable && p.setExpanded(true);
  const repeatLabel = p.repeat === "one" ? L.repeatOne : p.repeat === "all" ? L.repeatAll : L.repeatOff;
  const RepeatI = p.repeat === "one" ? Repeat1Icon : RepeatIcon;
  const VolI = p.muted || p.volume === 0 ? VolumeMuteIcon : p.volume < 0.5 ? VolumeLowIcon : VolumeHighIcon;
  const silent = p.muted || p.volume === 0;

  return (
    <div className={cn("cbb-mp", `cbb-mp--${position}`, className)} role="region" aria-label={L.player}>
      {p.error && <p className="cbb-mp__error" role="alert">{p.error}</p>}
      <div className="cbb-mp__grid">
        <div className="cbb-mp__track">
          <button type="button" className="cbb-mp__cover" onClick={open} disabled={!expandable || !t} aria-label={t ? `${L.expand}: ${t.title}` : L.expand}>
            {t?.cover ? <img src={t.cover} alt="" /> : <MusicIcon size={22} />}
          </button>
          <button type="button" className="cbb-mp__meta" onClick={open} disabled={!expandable || !t}>
            <span className="cbb-mp__title">{t?.title ?? "–"}</span>
            {t?.artist && <span className="cbb-mp__artist">{t.artist}</span>}
          </button>
          {t && actions && <div className="cbb-mp__actions">{actions(t)}</div>}
        </div>

        <div className="cbb-mp__center">
          <div className="cbb-mp__controls">
            {showModes && (
              <button type="button" className={cn("cbb-mp__btn cbb-mp__mode", p.shuffle && "is-on")} onClick={p.toggleShuffle} aria-pressed={p.shuffle} title={L.shuffle} aria-label={L.shuffle}>
                <ShuffleIcon size={16} />
              </button>
            )}
            <button type="button" className="cbb-mp__btn" onClick={p.previous} disabled={!t} title={L.previous} aria-label={L.previous}>
              <SkipBackIcon size={18} />
            </button>
            <button type="button" className="cbb-mp__play" onClick={p.togglePlay} disabled={!t} title={p.isPlaying ? L.pause : L.play} aria-label={p.isPlaying ? L.pause : L.play}>
              {p.isPlaying ? <PauseIcon size={18} /> : <PlayIcon size={18} />}
            </button>
            <button type="button" className="cbb-mp__btn" onClick={p.next} disabled={!t} title={L.next} aria-label={L.next}>
              <SkipForwardIcon size={18} />
            </button>
            {showModes && (
              <button type="button" className={cn("cbb-mp__btn cbb-mp__mode", p.repeat !== "off" && "is-on")} onClick={p.cycleRepeat} title={repeatLabel} aria-label={repeatLabel}>
                <RepeatI size={16} />
              </button>
            )}
          </div>
          <div className="cbb-mp__time">
            <span className="cbb-mp__clock">{formatTime(p.currentTime)}</span>
            <PlayerSeek value={p.currentTime} max={p.duration} onSeek={p.seek} variant="line" labels={L} />
            <span className="cbb-mp__clock">{formatTime(p.duration)}</span>
          </div>
        </div>

        <div className="cbb-mp__side">
          {showVolume && (
            <div className="cbb-mp__volume">
              <button type="button" className="cbb-mp__btn" onClick={p.toggleMute} aria-pressed={silent} title={silent ? L.unmute : L.mute} aria-label={silent ? L.unmute : L.mute}>
                <VolI size={18} />
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
          )}
          {expandable && (
            <button type="button" className="cbb-mp__btn" onClick={open} disabled={!t} title={L.expand} aria-label={L.expand}>
              <ChevronUpIcon size={20} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
