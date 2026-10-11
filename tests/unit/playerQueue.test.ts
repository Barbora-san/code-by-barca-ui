import { describe, expect, it } from "vitest";
import {
  addToQueue, clearQueue, initialQueueState, moveInQueue, nextRepeat, nextTrack, playFromQueue, previousTrack, removeFromQueue,
  shuffled, startTrack, toggleShuffle, type QueueState, type Track,
} from "../../src/lib/playerQueue";

const t = (id: number): Track => ({ id, title: `Skladba ${id}`, src: `/${id}.mp3` });
const list = [1, 2, 3, 4, 5].map(t);
const ids = (xs: Track[]) => xs.map((x) => x.id);
/** Předvídatelné „náhodné“ číslo, aby míchání dávalo vždy stejný výsledek. */
const seq = (...n: number[]) => { let i = 0; return () => n[i++ % n.length]!; };

const started = (shuffle = false, repeat: QueueState["repeat"] = "off"): QueueState =>
  startTrack({ ...initialQueueState, shuffle, repeat }, list[1]!, list); // hraje 2, zbývá 3, 4, 5

describe("startTrack", () => {
  it("zbytek seznamu za skladbou se stane frontou", () => {
    const s = started();
    expect(s.current!.id).toBe(2);
    expect(ids(s.queue)).toEqual([3, 4, 5]);
    expect(ids(s.context)).toEqual([1, 2, 3, 4, 5]);
  });
  it("skladba mimo seznam dostane do fronty celý seznam", () => {
    expect(ids(startTrack(initialQueueState, t(9), list).queue)).toEqual([1, 2, 3, 4, 5]);
  });
  it("bez seznamu se fronta vymaže, s keepQueue zůstane", () => {
    const withQ = addToQueue(started(), t(7));
    expect(startTrack(withQ, t(8)).queue).toEqual([]);
    expect(ids(startTrack(withQ, t(8), undefined, { keepQueue: true }).queue)).toEqual([3, 4, 5, 7]);
  });
  it("předchozí skladba se uloží do historie a historie je omezená na 50", () => {
    let s = initialQueueState;
    for (let i = 1; i <= 60; i++) s = startTrack(s, t(i));
    expect(s.history).toHaveLength(50);
    expect(s.history[49]!.id).toBe(59);
  });
  it("původní stav se nezmění", () => {
    const before = started();
    const snapshot = JSON.stringify(before);
    startTrack(before, t(9), list);
    nextTrack(before);
    toggleShuffle(before);
    expect(JSON.stringify(before)).toBe(snapshot);
  });
});

describe("nextTrack", () => {
  it("přejde na první ve frontě a aktuální dá do historie", () => {
    const step = nextTrack(started());
    expect(step.play!.id).toBe(3);
    expect(ids(step.state.queue)).toEqual([4, 5]);
    expect(ids(step.state.history)).toEqual([2]);
  });
  it("na konci s vypnutým opakováním nemá co hrát", () => {
    let s = startTrack(initialQueueState, list[4]!, list);
    expect(nextTrack(s).play).toBeNull();
    s = started();
    for (let i = 0; i < 3; i++) s = nextTrack(s).state;
    expect(nextTrack(s).play).toBeNull();
  });
  it("opakování jedné: po doznění hraje tatáž skladba, tlačítko „další“ ale přeskočí", () => {
    const s = started(false, "one");
    const auto = nextTrack(s, true);
    expect(auto.play!.id).toBe(2);
    expect(auto.restart).toBe(true);
    expect(auto.state.history).toHaveLength(0);
    expect(nextTrack(s, false).play!.id).toBe(3);
  });
  it("opakování všeho: po posledním se fronta znovu naplní z původního pořadí", () => {
    let s = startTrack({ ...initialQueueState, repeat: "all" }, list[3]!, list); // 4, zbývá 5
    s = nextTrack(s).state; // hraje 5, fronta prázdná
    const step = nextTrack(s);
    expect(step.play!.id).toBe(1);
    expect(ids(step.state.queue)).toEqual([2, 3, 4, 5]);
  });
  it("opakování všeho s jedinou skladbou ji pustí znovu", () => {
    const s = startTrack({ ...initialQueueState, repeat: "all" }, t(1));
    const step = nextTrack(s);
    expect(step.play!.id).toBe(1);
    expect(step.restart).toBe(true);
  });
  it("opakování všeho se zapnutým shuffle míchá znovu naplněnou frontu", () => {
    let s = startTrack({ ...initialQueueState, repeat: "all", shuffle: true }, list[4]!, list, {}, seq(0));
    const step = nextTrack(s, true, seq(0));
    expect(step.play).not.toBeNull();
    expect(new Set([step.play!.id, ...ids(step.state.queue)]).size).toBe(5); // všech 5 skladeb právě jednou
    s = step.state;
  });
});

describe("previousTrack", () => {
  it("po více než 3 sekundách jen vrátí skladbu na začátek", () => {
    const s = nextTrack(started()).state;
    const step = previousTrack(s, 10);
    expect(step.play!.id).toBe(3);
    expect(step.restart).toBe(true);
    expect(step.state).toBe(s);
  });
  it("do 3 sekund se vrátí na předchozí a aktuální se vrátí do fronty", () => {
    const s = nextTrack(started()).state; // hraje 3, historie [2], fronta 4, 5
    const step = previousTrack(s, 1);
    expect(step.play!.id).toBe(2);
    expect(ids(step.state.queue)).toEqual([3, 4, 5]);
    expect(step.state.history).toEqual([]);
  });
  it("bez historie restartuje aktuální skladbu", () => {
    const step = previousTrack(started(), 0);
    expect(step.play!.id).toBe(2);
    expect(step.restart).toBe(true);
  });
  it("bez skladby nic nepřehraje", () => {
    expect(previousTrack(initialQueueState, 0).play).toBeNull();
  });
});

describe("úpravy fronty", () => {
  it("přidání na konec a jako další", () => {
    expect(ids(addToQueue(started(), t(9)).queue)).toEqual([3, 4, 5, 9]);
    expect(ids(addToQueue(started(), t(9), true).queue)).toEqual([9, 3, 4, 5]);
  });
  it("odebrání a odebrání neexistujícího indexu", () => {
    expect(ids(removeFromQueue(started(), 1).queue)).toEqual([3, 5]);
    const s = started();
    expect(removeFromQueue(s, 9)).toBe(s);
    expect(removeFromQueue(s, -1)).toBe(s);
  });
  it("přesun dopředu, dozadu a neplatný přesun", () => {
    expect(ids(moveInQueue(started(), 0, 2).queue)).toEqual([4, 5, 3]);
    expect(ids(moveInQueue(started(), 2, 0).queue)).toEqual([5, 3, 4]);
    const s = started();
    expect(moveInQueue(s, 0, 0)).toBe(s);
    expect(moveInQueue(s, 0, 9)).toBe(s);
  });
  it("vymazání fronty", () => {
    expect(clearQueue(started()).queue).toEqual([]);
  });
  it("přehrání z fronty přeskočené skladby zapíše do historie", () => {
    const step = playFromQueue(started(), 1); // hraje 2, fronta 3 4 5 → vybrat 4
    expect(step.play!.id).toBe(4);
    expect(ids(step.state.queue)).toEqual([5]);
    expect(ids(step.state.history)).toEqual([2, 3]);
  });
  it("přehrání z neexistujícího indexu nic neudělá", () => {
    expect(playFromQueue(started(), 9).play).toBeNull();
  });
});

describe("shuffle", () => {
  it("zapnutí zamíchá frontu, ale zachová všechny skladby", () => {
    const s = toggleShuffle(started(), seq(0.1, 0.6, 0.3));
    expect(s.shuffle).toBe(true);
    expect(ids(s.queue).sort()).toEqual([3, 4, 5]);
  });
  it("vypnutí obnoví původní pořadí od aktuální skladby", () => {
    let s = toggleShuffle(started(), seq(0, 0, 0));
    s = toggleShuffle(s);
    expect(s.shuffle).toBe(false);
    expect(ids(s.queue)).toEqual([3, 4, 5]);
  });
  it("vypnutí zachová ručně přidané skladby na konci a respektuje již odebrané", () => {
    let s = toggleShuffle(started(), seq(0, 0, 0));
    s = addToQueue(s, t(9));
    s = removeFromQueue(s, s.queue.findIndex((x) => x.id === 4));
    s = toggleShuffle(s);
    expect(ids(s.queue)).toEqual([3, 5, 9]);
  });
  it("míchání je Fisher–Yates: stejná čísla dají stejné pořadí a nic se neztratí", () => {
    const a = shuffled([1, 2, 3, 4, 5, 6], seq(0.9, 0.2, 0.5, 0.1, 0.7));
    expect(a).toEqual(shuffled([1, 2, 3, 4, 5, 6], seq(0.9, 0.2, 0.5, 0.1, 0.7)));
    expect([...a].sort()).toEqual([1, 2, 3, 4, 5, 6]);
  });
  it("nový seznam při zapnutém shuffle se zamíchá", () => {
    const s = startTrack({ ...initialQueueState, shuffle: true }, list[0]!, list, {}, seq(0, 0, 0));
    expect(ids(s.queue).sort()).toEqual([2, 3, 4, 5]);
    expect(ids(s.queue)).not.toEqual([2, 3, 4, 5]);
  });
});

describe("opakování", () => {
  it("cykluje vypnuto → vše → jedna → vypnuto", () => {
    expect(nextRepeat("off")).toBe("all");
    expect(nextRepeat("all")).toBe("one");
    expect(nextRepeat("one")).toBe("off");
  });
});
