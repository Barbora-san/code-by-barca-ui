import type { ReactNode } from "react";
import type { PlayerLabels } from "../lib/playerLabels";
import type { Track } from "../lib/playerQueue";
import { FullscreenPlayer } from "./FullscreenPlayer";
import { MiniPlayer } from "./MiniPlayer";

export interface MusicPlayerProps {
  /** Vlastní tlačítka u názvu skladby v obou verzích (oblíbené, přidat do playlistu…). */
  actions?: (track: Track) => ReactNode;
  /** Umístění mini lišty (viz `MiniPlayer`). */
  position?: "fixed" | "static";
  /** Zvuková stopa ve fullscreenu (při `false` tenká čára). */
  waveform?: boolean;
  /** Přepsání textů (čeština je výchozí). */
  labels?: Partial<PlayerLabels>;
}

/**
 * Hotový přehrávač: mini lišta, která se klikem otevře do fullscreenu s frontou.
 * Musí být uvnitř `MusicPlayerProvider`. Chceš jen jednu z verzí nebo vlastní rozložení? Použij `MiniPlayer` a `FullscreenPlayer` zvlášť.
 */
export function MusicPlayer({ actions, position = "fixed", waveform = true, labels }: MusicPlayerProps) {
  return (
    <>
      <MiniPlayer actions={actions} position={position} labels={labels} />
      <FullscreenPlayer actions={actions} waveform={waveform} labels={labels} />
    </>
  );
}
