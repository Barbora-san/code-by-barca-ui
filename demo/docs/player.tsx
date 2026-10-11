import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import {
  MusicPlayerProvider, MusicPlayer, MiniPlayer, FullscreenPlayer, PlayerQueue, useMusicPlayer, Button, HeartIcon, PlayIcon, PlusIcon,
  type Track,
} from "../../src";
import { Col, Row } from "../ui";
import type { Doc } from "./types";

/** Zvuk vyrobený v prohlížeči: krátké smyčky, aby demo fungovalo bez souborů a bez internetu. */
function synth(root: number, bpm: number, seconds: number, scale: number[], bass: number): string {
  const rate = 16000;
  const n = rate * seconds;
  const buf = new Int16Array(n);
  const step = 60 / bpm / 2;
  for (let i = 0; i < n; i++) {
    const t = i / rate;
    const k = Math.floor(t / step);
    const local = t - k * step;
    const note = scale[(k * 3 + (k >> 2)) % scale.length]!;
    const f = root * 2 ** (note / 12);
    const env = Math.exp(-local * 6);
    const lead = Math.sin(2 * Math.PI * f * t) * 0.5 + Math.sin(2 * Math.PI * f * 2 * t) * 0.15;
    const low = Math.sin(2 * Math.PI * (root / 2) * 2 ** (bass / 12) * t) * 0.35 * (0.6 + 0.4 * Math.sin(2 * Math.PI * (bpm / 60) * t));
    const fade = Math.min(1, t * 8, (seconds - t) * 8);
    buf[i] = Math.round((lead * env + low) * 0.45 * fade * 32767);
  }
  const wav = new DataView(new ArrayBuffer(44 + buf.length * 2));
  const w = (o: number, s: string) => [...s].forEach((c, j) => wav.setUint8(o + j, c.charCodeAt(0)));
  w(0, "RIFF"); wav.setUint32(4, 36 + buf.length * 2, true); w(8, "WAVEfmt ");
  wav.setUint32(16, 16, true); wav.setUint16(20, 1, true); wav.setUint16(22, 1, true);
  wav.setUint32(24, rate, true); wav.setUint32(28, rate * 2, true); wav.setUint16(32, 2, true); wav.setUint16(34, 16, true);
  w(36, "data"); wav.setUint32(40, buf.length * 2, true);
  buf.forEach((v, i) => wav.setInt16(44 + i * 2, v, true));
  return URL.createObjectURL(new Blob([wav], { type: "audio/wav" }));
}

/** Obaly: vlastní jednoduché vzory ve žluté a tmavé. */
function cover(hue: number, kind: number): string {
  const a = `hsl(${hue} 95% 55%)`;
  const b = `hsl(${hue + 24} 90% 30%)`;
  const shapes = [
    `<circle cx="120" cy="120" r="70" fill="none" stroke="#0a0a0a" stroke-width="14"/><circle cx="120" cy="120" r="24" fill="#0a0a0a"/>`,
    `<path d="M0 170 L240 70 V240 H0Z" fill="#0a0a0a" opacity=".85"/><circle cx="170" cy="70" r="26" fill="#fde047"/>`,
    `<g fill="#0a0a0a">${Array.from({ length: 8 }, (_, i) => `<rect x="${24 + i * 26}" y="${150 - ((i * 37) % 90)}" width="14" height="${40 + ((i * 37) % 90)}" rx="4"/>`).join("")}</g>`,
    `<g fill="none" stroke="#0a0a0a" stroke-width="10"><path d="M30 150 Q80 60 120 150 T210 150"/><path d="M30 190 Q80 100 120 190 T210 190" opacity=".6"/></g>`,
    `<rect x="60" y="60" width="120" height="120" rx="22" fill="none" stroke="#0a0a0a" stroke-width="14" transform="rotate(18 120 120)"/><rect x="90" y="90" width="60" height="60" rx="10" fill="#0a0a0a" transform="rotate(18 120 120)"/>`,
  ];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs><rect width="240" height="240" fill="url(#g)"/>${shapes[kind % shapes.length]}</svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

let cache: Track[] | null = null;
/** Skladby pro demo (vyrobí se až při prvním použití, na serveru ne). */
export function demoTracks(): Track[] {
  if (cache) return cache;
  const minor = [0, 3, 5, 7, 10, 12, 7, 5];
  const major = [0, 4, 7, 9, 12, 9, 7, 4];
  const rows: [string, string, string, number, number, number[], number, number, number][] = [
    ["Neon Kód", "Barca Beats", "Žlutá hodina", 220, 104, minor, 0, 48, 0],
    ["Pull Request", "Barca Beats", "Žlutá hodina", 262, 118, major, 7, 40, 1],
    ["Noční build", "Dark Mode Duo", "Světlý a tmavý", 196, 92, minor, 3, 52, 2],
    ["Hot Reload", "Dark Mode Duo", "Světlý a tmavý", 247, 128, major, 5, 36, 3],
    ["Merge Conflict", "Barca Beats", "Žlutá hodina", 233, 110, minor, 5, 44, 4],
  ];
  cache = rows.map(([title, artist, album, root, bpm, scale, bass, hue, kind], i) => {
    const seconds = 22 + i * 3;
    return { id: i + 1, title, artist, album, src: synth(root, bpm, seconds, scale, bass), cover: cover(hue, kind), duration: seconds };
  });
  return cache;
}

function useTracks() {
  return useMemo(() => demoTracks(), []);
}

function Like({ track, liked, toggle }: { track: Track; liked: Set<string | number>; toggle: (id: string | number) => void }) {
  const on = liked.has(track.id);
  return (
    <button
      type="button"
      className="cbb-mp__btn"
      aria-pressed={on}
      aria-label={on ? "Odebrat z oblíbených" : "Přidat do oblíbených"}
      title={on ? "Odebrat z oblíbených" : "Přidat do oblíbených"}
      onClick={() => toggle(track.id)}
      style={on ? { color: "var(--cbb-accent)" } : undefined}
    >
      <HeartIcon size={18} fill={on ? "currentColor" : "none"} />
    </button>
  );
}

/** Seznam skladeb pro vyzkoušení: přehrát, přidat do fronty, přehrát jako další. */
function TrackList() {
  const tracks = useTracks();
  const p = useMusicPlayer();
  return (
    <ul className="demo-tracklist" aria-label="Skladby">
      {tracks.map((t) => (
        <li key={t.id} className="demo-trackrow">
          <button type="button" className="demo-trackrow__main" onClick={() => p.play(t, { list: tracks })}>
            <img src={t.cover} alt="" width={36} height={36} />
            <span>
              <strong>{t.title}</strong>
              <small>{t.artist}</small>
            </span>
          </button>
          <Button size="sm" variant="ghost" onClick={() => p.addToQueue(t, { next: true })} title="Přehrát jako další">Jako další</Button>
          <Button size="sm" variant="ghost" onClick={() => p.addToQueue(t)} title="Přidat na konec fronty"><PlusIcon size={14} /> Do fronty</Button>
        </li>
      ))}
    </ul>
  );
}

function Shell({ children, withList = true, keyboard = false }: { children: ReactNode; withList?: boolean; keyboard?: boolean }) {
  const [liked, setLiked] = useState<Set<string | number>>(new Set([1]));
  const toggle = (id: string | number) => setLiked((s) => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });
  return (
    <MusicPlayerProvider storageKey="cbb-demo-volume" keyboardShortcuts={keyboard}>
      <LikeContext.Provider value={{ liked, toggle }}>
        <Col gap={16}>
          {withList && <TrackList />}
          {children}
        </Col>
      </LikeContext.Provider>
    </MusicPlayerProvider>
  );
}

const LikeContext = createContext<{ liked: Set<string | number>; toggle: (id: string | number) => void }>({ liked: new Set(), toggle: () => {} });
const actions = (t: Track) => <LikeFromContext track={t} />;
function LikeFromContext({ track }: { track: Track }) {
  const { liked, toggle } = useContext(LikeContext);
  return <Like track={track} liked={liked} toggle={toggle} />;
}

function OpenFullscreen() {
  const tracks = useTracks();
  const p = useMusicPlayer();
  return (
    <Button onClick={() => { if (!p.currentTrack) p.play(tracks[0]!, { list: tracks }); p.setExpanded(true); }}>
      <PlayIcon size={14} /> Spustit a otevřít fullscreen
    </Button>
  );
}

function CustomDemo() {
  const p = useMusicPlayer();
  const tracks = useTracks();
  return (
    <Row gap={12}>
      <Button size="sm" onClick={() => p.play(tracks[0]!, { list: tracks })}>Přehrát seznam</Button>
      <Button size="sm" variant="outline" onClick={p.togglePlay}>{p.isPlaying ? "Pozastavit" : "Pokračovat"}</Button>
      <Button size="sm" variant="outline" onClick={p.next}>Další</Button>
      <Button size="sm" variant="ghost" onClick={() => p.play({ id: "chyba", title: "Skladba s chybou", artist: "neexistující soubor", src: "/neexistuje.mp3" })}>Skladba s chybou</Button>
      {p.error && <span className="demo-mono" role="status">{p.error}</span>}
      <span className="demo-mono">{p.currentTrack ? `${p.currentTrack.title} · ${Math.floor(p.currentTime)} s · fronta ${p.queue.length}` : "nic nehraje"}</span>
    </Row>
  );
}

export const PLAYER_DOCS: Doc[] = [
  {
    id: "musicplayer", name: "MusicPlayer",
    desc: "Hotový přehrávač ve stylu Spotify a Apple Music: mini lišta, která se klikem otevře do fullscreenu s velkým obalem, zvukovou stopou a frontou. Umí náhodné pořadí, opakování (vypnuto, vše, jedna skladba), přeřazování fronty tažením, ovládání z klávesnice a ovládání v systému (multimediální klávesy, zamčená obrazovka).",
    props: ["MusicPlayer"],
    block: true,
    preview: <Shell><MusicPlayer position="static" actions={actions} /></Shell>,
    note: <>Skladby v ukázce vznikají přímo v prohlížeči (krátké smyčky), takže nepotřebuješ žádné soubory. Přehrávač nic neukládá na server: oblíbené, počítadla přehrání a historii napojíš přes <code>actions</code>, <code>onTrackStart</code> a <code>onTrackEnd</code>. Doporučování skladeb záměrně neobsahuje.</>,
    code: `import { MusicPlayerProvider, MusicPlayer, useMusicPlayer, type Track } from "code-by-barca-ui";

const tracks: Track[] = [
  { id: 1, title: "Neon Kód", artist: "Barca Beats", src: "/audio/neon.mp3", cover: "/cover/neon.jpg" },
  // ...
];

function Songs() {
  const player = useMusicPlayer();
  return tracks.map((t) => (
    <button key={t.id} onClick={() => player.play(t, { list: tracks })}>{t.title}</button>
  ));
}

// layout.tsx: Provider kolem celé aplikace, přehrávač na jednom místě
<MusicPlayerProvider onTrackStart={(t) => api.countPlay(t.id)}>
  {children}
  <MusicPlayer actions={(t) => <LikeButton trackId={t.id} />} />
</MusicPlayerProvider>`,
  },
  {
    id: "miniplayer", name: "MiniPlayer",
    desc: "Mini přehrávač v jedné liště: obal, název, ovládání, čas a hlasitost. Klik na obal nebo název otevře fullscreen. Na úzkém místě se sám přeskládá a skryje hlasitost.",
    props: ["MiniPlayer"],
    block: true,
    preview: <Shell><MiniPlayer position="static" actions={actions} /><FullscreenPlayer actions={actions} /></Shell>,
    note: <>S <code>position="fixed"</code> (výchozí) se lišta přilepí k dolnímu okraji okna. Dokud nic nehraje, nevykresluje se (<code>hideWhenEmpty</code>).</>,
    code: `<MiniPlayer />                              // dole přilepená lišta
<MiniPlayer position="static" showVolume={false} />  // v kartě nebo postranním panelu
<MiniPlayer actions={(t) => <LikeButton id={t.id} />} />`,
  },
  {
    id: "fullscreenplayer", name: "FullscreenPlayer",
    desc: "Fullscreen verze: velký obal s rozmazaným pozadím, zvuková stopa pro přetáčení, ovládání, hlasitost a fronta vedle (na úzké obrazovce na samostatné záložce). Je vždy tmavý, i ve světlém režimu stránky.",
    props: ["FullscreenPlayer"],
    block: true,
    preview: <Shell withList={false}><OpenFullscreen /><FullscreenPlayer actions={actions} /></Shell>,
    note: <>Otevírá se přes <code>setExpanded(true)</code> (to dělá i <code>MiniPlayer</code>), zavírá Esc nebo tlačítko. Je to modální okno: fokus se drží uvnitř a po zavření se vrátí.</>,
    code: `const { setExpanded } = useMusicPlayer();
<button onClick={() => setExpanded(true)}>Otevřít přehrávač</button>

<FullscreenPlayer />                          // řídí se stavem přehrávače
<FullscreenPlayer open={open} onClose={() => setOpen(false)} waveform={false} />`,
  },
  {
    id: "playerqueue", name: "PlayerQueue",
    desc: "Fronta přehrávače jako samostatný panel: právě hrající skladba a seznam dalších. Skladby jde přeřadit tažením nebo úchytem a šipkami ↑ ↓, odebrat křížkem, přehrát kliknutím a celou frontu vymazat.",
    props: ["PlayerQueue"],
    block: true,
    preview: <Shell><PlayerQueue /></Shell>,
    note: <>V ukázce přidej skladby tlačítky „Jako další“ a „Do fronty“. Sedí i do postranního panelu vedle <code>MiniPlayer</code>.</>,
    code: `<PlayerQueue />
<PlayerQueue showCurrent={false} labels={{ queue: "Playlist" }} />`,
  },
  {
    id: "musicplayerprovider", name: "MusicPlayerProvider",
    desc: "Přehrávač bez vzhledu: drží zvuk, frontu, historii, míchání, opakování a hlasitost (pamatuje si ji v prohlížeči). Obaluje část aplikace, ve které chceš přehrávat; vzhled doplňují ostatní komponenty nebo vlastní kód přes useMusicPlayer.",
    props: ["MusicPlayerProvider", { type: "Track", title: "Track" }, { type: "PlayOptions", title: "PlayOptions" }, { type: "MusicPlayerLabels", title: "MusicPlayerLabels" }],
    block: true,
    preview: <Shell withList={false} keyboard><CustomDemo /></Shell>,
    note: <>Mezerník, šipky a hlasitost z klávesnice zapneš přes <code>keyboardShortcuts</code> (v téhle ukázce zapnuté: po spuštění zkus mezerník a šipky; ve výchozím stavu jsou vypnuté, aby knihovna nepřebírala klávesy stránce). <code>mediaSession</code> zapisuje skladbu do ovládání v systému.</>,
    code: `<MusicPlayerProvider
  keyboardShortcuts
  storageKey="muj-web-hlasitost"
  onTrackStart={(t) => api.countPlay(t.id)}
  onError={(msg, t) => console.warn(msg, t?.title)}
>
  <App />
</MusicPlayerProvider>`,
  },
  {
    id: "usemusicplayer", name: "useMusicPlayer",
    desc: "Hook s celým stavem a ovládáním přehrávače: aktuální skladba, čas, fronta, historie, hlasitost, shuffle, opakování a funkce play, next, previous, seek, addToQueue, moveInQueue a další. Slouží pro vlastní vzhled.",
    props: [{ type: "MusicPlayerState", title: "MusicPlayerState" }],
    preview: <Shell withList={false}><CustomDemo /></Shell>,
    code: `const { currentTrack, isPlaying, play, togglePlay, next, queue, addToQueue, repeat, cycleRepeat } = useMusicPlayer();

play(track, { list: playlist });          // zbytek playlistu se stane frontou
addToQueue(track, { next: true });        // zahraje hned po aktuální skladbě
play(track, { autoplay: false });         // jen připraví, nespustí`,
  },
];
