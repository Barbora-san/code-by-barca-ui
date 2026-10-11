/** Texty přehrávače. Čeština je výchozí, přepsat jde kterýkoli. */
export interface PlayerLabels {
  play: string;
  pause: string;
  next: string;
  previous: string;
  shuffle: string;
  repeatOff: string;
  repeatAll: string;
  repeatOne: string;
  mute: string;
  unmute: string;
  volume: string;
  /** Popisek posuvníku s časem skladby. */
  seek: string;
  /** Hodnota posuvníku času, např. „1:05 z 3:40“. Funkce dostane uplynulý a celkový čas už zformátované. */
  seekValue: (elapsed: string, total: string) => string;
  expand: string;
  collapse: string;
  nowPlaying: string;
  queue: string;
  nextInQueue: string;
  emptyQueue: string;
  clearQueue: string;
  removeFromQueue: string;
  /** Popisek úchytu pro přesouvání (funguje i šipkami ↑ ↓). */
  moveInQueue: string;
  player: string;
}

export const CS_PLAYER_LABELS: PlayerLabels = {
  play: "Přehrát",
  pause: "Pozastavit",
  next: "Další skladba",
  previous: "Předchozí skladba",
  shuffle: "Náhodné pořadí",
  repeatOff: "Opakování vypnuto",
  repeatAll: "Opakovat vše",
  repeatOne: "Opakovat jednu skladbu",
  mute: "Ztlumit",
  unmute: "Zapnout zvuk",
  volume: "Hlasitost",
  seek: "Přetáčení skladby",
  seekValue: (elapsed, total) => `${elapsed} z ${total}`,
  expand: "Otevřít přehrávač",
  collapse: "Zavřít přehrávač",
  nowPlaying: "Právě hraje",
  queue: "Fronta",
  nextInQueue: "Další ve frontě",
  emptyQueue: "Fronta je prázdná",
  clearQueue: "Vymazat frontu",
  removeFromQueue: "Odebrat z fronty",
  moveInQueue: "Přesunout (šipky nahoru a dolů)",
  player: "Přehrávač",
};

export const formatTime = (seconds: number) => {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const s = Math.floor(seconds);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = String(s % 60).padStart(2, "0");
  return h > 0 ? `${h}:${String(m).padStart(2, "0")}:${sec}` : `${m}:${sec}`;
};
