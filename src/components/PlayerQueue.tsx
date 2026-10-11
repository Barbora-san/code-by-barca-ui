import { useLayoutEffect, useRef, useState, type KeyboardEvent } from "react";
import { cn } from "../lib/cn";
import { CS_PLAYER_LABELS, formatTime, type PlayerLabels } from "../lib/playerLabels";
import type { Track } from "../lib/playerQueue";
import { GripIcon, MusicIcon, XIcon } from "./Icons";
import { useMusicPlayer } from "./MusicPlayerProvider";

export interface PlayerQueueProps {
  /** Zobrazit nahoře řádek se skladbou, která právě hraje. */
  showCurrent?: boolean;
  /** Přepsání textů (čeština je výchozí). */
  labels?: Partial<PlayerLabels>;
  /** Vlastní CSS třída přidaná ke kořenovému prvku. */
  className?: string;
}

function Cover({ track }: { track: Track }) {
  return (
    <span className="cbb-pq__cover" aria-hidden="true">
      {track.cover ? <img src={track.cover} alt="" loading="lazy" /> : <MusicIcon size={16} />}
    </span>
  );
}

/**
 * Fronta přehrávače: skladba, která právě hraje, a seznam toho, co bude následovat.
 * Skladby jde přeřadit tažením nebo úchytem a šipkami ↑ ↓, odebrat křížkem a přehrát kliknutím.
 */
export function PlayerQueue({ showCurrent = true, labels, className }: PlayerQueueProps) {
  const L = { ...CS_PLAYER_LABELS, ...labels };
  const { currentTrack, isPlaying, queue, playFromQueue, removeFromQueue, moveInQueue, clearQueue } = useMusicPlayer();
  const [drag, setDrag] = useState<{ from: number; over: number } | null>(null);
  const refocus = useRef<number | null>(null);
  const list = useRef<HTMLOListElement>(null);

  // Po přesunutí klávesnicí zůstane fokus na úchytu přesunuté skladby.
  useLayoutEffect(() => {
    if (refocus.current === null) return;
    list.current?.querySelector<HTMLElement>(`[data-handle="${refocus.current}"]`)?.focus();
    refocus.current = null;
  });

  const onHandleKey = (e: KeyboardEvent, i: number) => {
    const to = e.key === "ArrowUp" ? i - 1 : e.key === "ArrowDown" ? i + 1 : null;
    if (to === null) return;
    e.preventDefault();
    if (to >= 0 && to < queue.length) {
      moveInQueue(i, to);
      refocus.current = to;
    }
  };

  return (
    <section className={cn("cbb-pq", className)} aria-label={L.queue}>
      {showCurrent && currentTrack && (
        <div className="cbb-pq__section">
          <h3 className="cbb-pq__head">{L.nowPlaying}</h3>
          <div className={cn("cbb-pq__row is-current", isPlaying && "is-playing")} aria-current="true">
            <Cover track={currentTrack} />
            <span className="cbb-pq__meta">
              <span className="cbb-pq__title">{currentTrack.title}</span>
              {currentTrack.artist && <span className="cbb-pq__artist">{currentTrack.artist}</span>}
            </span>
            <span className="cbb-pq__eq" aria-hidden="true"><i /><i /><i /></span>
          </div>
        </div>
      )}

      <div className="cbb-pq__section">
        <div className="cbb-pq__headrow">
          <h3 className="cbb-pq__head">
            {L.nextInQueue}
            {queue.length > 0 && <span className="cbb-pq__count">{queue.length}</span>}
          </h3>
          {queue.length > 0 && (
            <button type="button" className="cbb-pq__clear" onClick={clearQueue}>{L.clearQueue}</button>
          )}
        </div>

        {queue.length === 0 ? (
          <p className="cbb-pq__empty">{L.emptyQueue}</p>
        ) : (
          <ol ref={list} className="cbb-pq__list" onDragLeave={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setDrag((d) => d && { ...d, over: -1 }); }}>
            {queue.map((t, i) => (
              <li
                key={`${t.id}-${i}`}
                className={cn("cbb-pq__row", drag?.from === i && "is-dragging", drag && drag.over === i && drag.from !== i && (drag.from < i ? "is-over-after" : "is-over-before"))}
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.effectAllowed = "move";
                  e.dataTransfer.setData("text/plain", String(i));
                  setDrag({ from: i, over: i });
                }}
                onDragOver={(e) => {
                  if (!drag) return;
                  e.preventDefault();
                  e.dataTransfer.dropEffect = "move";
                  if (drag.over !== i) setDrag({ ...drag, over: i });
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  if (drag) moveInQueue(drag.from, i);
                  setDrag(null);
                }}
                onDragEnd={() => setDrag(null)}
              >
                <button type="button" className="cbb-pq__grip" data-handle={i} aria-label={`${L.moveInQueue}: ${t.title}`} onKeyDown={(e) => onHandleKey(e, i)}>
                  <GripIcon size={16} />
                </button>
                <button type="button" className="cbb-pq__play" onClick={() => playFromQueue(i)}>
                  <Cover track={t} />
                  <span className="cbb-pq__meta">
                    <span className="cbb-pq__title">{t.title}</span>
                    {t.artist && <span className="cbb-pq__artist">{t.artist}</span>}
                  </span>
                  {t.duration ? <span className="cbb-pq__time">{formatTime(t.duration)}</span> : null}
                </button>
                <button type="button" className="cbb-pq__remove" onClick={() => removeFromQueue(i)} aria-label={`${L.removeFromQueue}: ${t.title}`}>
                  <XIcon size={14} />
                </button>
              </li>
            ))}
          </ol>
        )}
      </div>
    </section>
  );
}
