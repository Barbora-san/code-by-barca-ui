import { useId, useLayoutEffect, useRef, type ClipboardEvent, type KeyboardEvent, type ReactNode } from "react";
import { cn } from "../lib/cn";
import { useControllable } from "../lib/floating";
import { Field } from "./Field";
import { PlusIcon, XIcon } from "./Icons";

/** Obsah tabulky: názvy sloupců a řádky buněk. */
export interface TableData {
  /** Texty záhlaví sloupců. */
  headers: string[];
  /** Řádky tabulky (pole buněk). */
  rows: string[][];
}

export interface TableEditorLabels {
  /** Popisek tlačítka přidání sloupce. */
  addColumn: string;
  /** Popisek tlačítka přidání řádku. */
  addRow: string;
  /** Popisek tlačítka odebrání sloupce. */
  removeColumn: string;
  /** Popisek tlačítka odebrání řádku. */
  removeRow: string;
  /** Použije se v názvu sloupce, který nemá název (čtečky obrazovky). */
  column: string;
  /** Slovo „Řádek“ pro čtečky obrazovky. */
  row: string;
  /** Placeholder buňky v záhlaví. */
  headerPlaceholder: string;
}

const CS: TableEditorLabels = {
  addColumn: "Sloupec", addRow: "Řádek", removeColumn: "Odebrat sloupec", removeRow: "Odebrat řádek",
  column: "Sloupec", row: "Řádek", headerPlaceholder: "Název",
};

export interface TableEditorProps {
  /** Řízená hodnota. */
  value?: TableData;
  /** Počáteční hodnota (neřízené použití). */
  defaultValue?: TableData;
  /** Zavolá se při změně, dostane novou hodnotu. */
  onChange?: (value: TableData) => void;
  /** Popisek / text. */
  label?: ReactNode;
  /** Nápověda pod polem. */
  hint?: ReactNode;
  /** Chybová hláška – zvýrazní pole červeně a připojí text pod něj. */
  error?: ReactNode;
  /** Nejmenší počet sloupců (u tohoto počtu se tlačítko odebrání skryje). */
  minColumns?: number;
  /** Největší počet sloupců. */
  maxColumns?: number;
  /** Největší počet řádků. */
  maxRows?: number;
  /** Přepsání textů (čeština je výchozí). */
  labels?: Partial<TableEditorLabels>;
  /** Zakáže prvek (nejde ho použít, je ztlumený). */
  disabled?: boolean;
  /** Atribut `id` prvku (pro propojení s `<label htmlFor>`). */
  id?: string;
  /** Vlastní CSS třída přidaná ke kořenovému prvku. */
  className?: string;
}

const EMPTY: TableData = { headers: ["Sloupec 1", "Sloupec 2"], rows: [["", ""]] };

/** Rozdělí text ze schránky (Excel, Google Sheets) na buňky. */
const parseClipboard = (t: string) =>
  t.replace(/\r\n?/g, "\n").replace(/\n$/, "").split("\n").map((r) => r.split("\t"));

/**
 * Editor tabulky: úprava buněk a názvů sloupců, přidávání a odebírání řádků i sloupců,
 * pohyb šipkami ↑ ↓ a Enterem a vkládání buněk přímo z Excelu / Google Sheets.
 */
export function TableEditor({
  value, defaultValue = EMPTY, onChange, label, hint, error,
  minColumns = 1, maxColumns = 12, maxRows = 100, labels, disabled, id, className,
}: TableEditorProps) {
  const auto = useId();
  const baseId = id ?? auto;
  const [data, setData] = useControllable<TableData>(value, defaultValue, onChange);
  const box = useRef<HTMLDivElement>(null);
  const focusAt = useRef<[number, number] | null>(null); // [řádek, sloupec], řádek -1 = záhlaví
  const L = { ...CS, ...labels };

  const headers = data.headers;
  const cols = headers.length;
  // Řádky vždy srovnáme na počet sloupců, aby chybějící buňky nerozbily tabulku.
  const rows = data.rows.map((r) => Array.from({ length: cols }, (_, i) => r[i] ?? ""));

  useLayoutEffect(() => {
    if (!focusAt.current) return;
    const [r, c] = focusAt.current;
    focusAt.current = null;
    box.current?.querySelector<HTMLInputElement>(`[data-r="${r}"][data-c="${c}"]`)?.focus();
  });

  /** Název nového sloupce: první volné číslo, aby se nepovedlo vytvořit dva stejné. */
  const freshName = (taken: string[]) => {
    let n = taken.length + 1;
    while (taken.includes(`${L.column} ${n}`)) n++;
    return `${L.column} ${n}`;
  };
  const set = (headersNext: string[], rowsNext: string[][]) => setData({ headers: headersNext, rows: rowsNext });
  const setCell = (r: number, c: number, v: string) =>
    set(headers, rows.map((row, i) => (i === r ? row.map((x, j) => (j === c ? v : x)) : row)));
  const setHeader = (c: number, v: string) => set(headers.map((h, j) => (j === c ? v : h)), rows);
  const addColumn = () => {
    if (cols >= maxColumns) return;
    set([...headers, freshName(headers)], rows.map((r) => [...r, ""]));
    focusAt.current = [-1, cols];
  };
  const addRow = () => {
    if (rows.length >= maxRows) return;
    set(headers, [...rows, Array(cols).fill("")]);
    focusAt.current = [rows.length, 0];
  };
  const removeColumn = (c: number) =>
    set(headers.filter((_, j) => j !== c), rows.map((r) => r.filter((_, j) => j !== c)));
  const removeRow = (r: number) => set(headers, rows.filter((_, i) => i !== r));

  const onKey = (e: KeyboardEvent<HTMLInputElement>, r: number, c: number) => {
    if (e.key === "Enter" || e.key === "ArrowDown" || e.key === "ArrowUp") {
      const up = e.key === "ArrowUp" || (e.key === "Enter" && e.shiftKey);
      e.preventDefault();
      const next = up ? r - 1 : r + 1;
      if (next < -1) return;
      if (next >= rows.length) {
        if (e.key === "Enter" && rows.length < maxRows) {
          set(headers, [...rows, Array(cols).fill("")]);
          focusAt.current = [next, c];
        }
        return;
      }
      box.current?.querySelector<HTMLInputElement>(`[data-r="${next}"][data-c="${c}"]`)?.focus();
    }
  };

  const onPaste = (e: ClipboardEvent<HTMLInputElement>, r: number, c: number) => {
    const text = e.clipboardData.getData("text");
    if (!/[\t\n]/.test(text.replace(/\n$/, ""))) return; // jedna buňka → normální vložení
    e.preventDefault();
    const grid = parseClipboard(text);
    const needCols = Math.min(maxColumns, c + Math.max(...grid.map((g) => g.length)));
    const needRows = Math.min(maxRows, r + grid.length);
    const nextHeaders = [...headers];
    while (nextHeaders.length < needCols) nextHeaders.push(freshName(nextHeaders));
    const nextRows = Array.from({ length: Math.max(rows.length, needRows) }, (_, i) =>
      Array.from({ length: nextHeaders.length }, (_, j) => rows[i]?.[j] ?? "")
    );
    grid.forEach((line, i) =>
      line.forEach((cell, j) => {
        if (r + i < nextRows.length && c + j < nextHeaders.length) nextRows[r + i][c + j] = cell;
      })
    );
    set(nextHeaders, nextRows);
  };

  const canRemoveCol = cols > minColumns;
  const name = (c: number) => headers[c] || `${L.column} ${c + 1}`;

  return (
    <Field label={label} hint={hint} error={error} htmlFor={`${baseId}-0-0`} className={className}>
      <div ref={box} className={cn("cbb-tbl-edit", error && "is-invalid", disabled && "is-disabled")}>
        <div className="cbb-tbl-edit__scroll">
          <table className="cbb-tbl-edit__table">
            <thead>
              <tr>
                {headers.map((h, c) => (
                  <th key={c}>
                    <div className="cbb-tbl-edit__head">
                      <input
                        className="cbb-tbl-edit__input is-head"
                        value={h}
                        data-r={-1}
                        data-c={c}
                        disabled={disabled}
                        placeholder={L.headerPlaceholder}
                        aria-label={`${L.column} ${c + 1}`}
                        onChange={(e) => setHeader(c, e.target.value)}
                        onKeyDown={(e) => onKey(e, -1, c)}
                      />
                      {canRemoveCol && !disabled && (
                        <button type="button" className="cbb-tbl-edit__x" aria-label={`${L.removeColumn}: ${name(c)}`} title={L.removeColumn} onClick={() => removeColumn(c)}>
                          <XIcon size={12} />
                        </button>
                      )}
                    </div>
                  </th>
                ))}
                <th className="cbb-tbl-edit__corner" />
              </tr>
            </thead>
            <tbody>
              {rows.map((row, r) => (
                <tr key={r}>
                  {row.map((cell, c) => (
                    <td key={c}>
                      <input
                        id={`${baseId}-${r}-${c}`}
                        className="cbb-tbl-edit__input"
                        value={cell}
                        data-r={r}
                        data-c={c}
                        disabled={disabled}
                        aria-label={`${name(c)}, ${L.row} ${r + 1}`}
                        onChange={(e) => setCell(r, c, e.target.value)}
                        onKeyDown={(e) => onKey(e, r, c)}
                        onPaste={(e) => onPaste(e, r, c)}
                      />
                    </td>
                  ))}
                  <td className="cbb-tbl-edit__corner">
                    {!disabled && (
                      <button type="button" className="cbb-tbl-edit__x" aria-label={`${L.removeRow} ${r + 1}`} title={L.removeRow} onClick={() => removeRow(r)}>
                        <XIcon size={12} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="cbb-tbl-edit__actions">
          <button type="button" className="cbb-tbl-edit__add" disabled={disabled || cols >= maxColumns} onClick={addColumn}>
            <PlusIcon size={14} /> {L.addColumn}
          </button>
          <button type="button" className="cbb-tbl-edit__add" disabled={disabled || rows.length >= maxRows} onClick={addRow}>
            <PlusIcon size={14} /> {L.addRow}
          </button>
        </div>
      </div>
    </Field>
  );
}
