import { useId, useRef, useState, type DragEvent, type ReactNode } from "react";
import { cn } from "../lib/cn";
import { XIcon } from "./Icons";

export interface FileUploadProps {
  /** Např. `.png,.jpg,.pdf` nebo `image/*`. */
  accept?: string;
  /** Číslo v bajtech, nebo text `"10MB"`, `"500KB"`. */
  maxSize?: number | string;
  multiple?: boolean;
  label?: ReactNode;
  hint?: ReactNode;
  /** Dostane jen platné soubory. */
  onUpload?: (files: File[]) => void;
  disabled?: boolean;
  className?: string;
}

const UNITS: Record<string, number> = { B: 1, KB: 1024, MB: 1024 ** 2, GB: 1024 ** 3 };

export function parseSize(size?: number | string): number | undefined {
  if (size === undefined) return undefined;
  if (typeof size === "number") return size;
  const m = size.trim().match(/^([\d.]+)\s*(B|KB|MB|GB)?$/i);
  if (!m) return undefined;
  return Math.round(parseFloat(m[1]) * UNITS[(m[2] ?? "B").toUpperCase()]);
}

function formatSize(bytes: number): string {
  if (bytes >= UNITS.MB) return `${(bytes / UNITS.MB).toFixed(1)} MB`;
  if (bytes >= UNITS.KB) return `${Math.round(bytes / UNITS.KB)} KB`;
  return `${bytes} B`;
}

function matchesAccept(file: File, accept?: string): boolean {
  if (!accept) return true;
  const rules = accept.split(",").map((r) => r.trim().toLowerCase()).filter(Boolean);
  const name = file.name.toLowerCase();
  const type = file.type.toLowerCase();
  return rules.some((r) => {
    if (r.startsWith(".")) return name.endsWith(r);
    if (r.endsWith("/*")) return type.startsWith(r.slice(0, -1));
    return type === r;
  });
}

/** Dropzone – klik nebo přetažení, validace typu a velikosti, seznam souborů s odebráním. */
export function FileUpload({ accept, maxSize, multiple, label = "Nahrát soubor", hint, onUpload, disabled, className }: FileUploadProps) {
  const id = useId();
  const input = useRef<HTMLInputElement>(null);
  const [drag, setDrag] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const limit = parseSize(maxSize);

  const accept_ = (incoming: File[]) => {
    setError(null);
    const ok: File[] = [];
    for (const f of incoming) {
      if (!matchesAccept(f, accept)) {
        setError(`${f.name}: nepodporovaný typ souboru`);
        continue;
      }
      if (limit && f.size > limit) {
        setError(`${f.name}: větší než ${formatSize(limit)}`);
        continue;
      }
      ok.push(f);
    }
    if (!ok.length) return;
    const next = multiple ? [...files, ...ok] : ok.slice(0, 1);
    setFiles(next);
    onUpload?.(next);
  };

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setDrag(false);
    if (disabled) return;
    accept_(Array.from(e.dataTransfer.files));
  };

  const remove = (f: File) => {
    const next = files.filter((x) => x !== f);
    setFiles(next);
    onUpload?.(next);
  };

  return (
    <div className={cn("cbb-field", className)}>
      <label
        htmlFor={id}
        className={cn("cbb-upload", drag && "is-drag", disabled && "is-disabled")}
        onDragOver={(e) => {
          e.preventDefault();
          if (!disabled) setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={onDrop}
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <path d="m17 8-5-5-5 5" />
          <path d="M12 3v12" />
        </svg>
        <span className="cbb-upload__title">{label}</span>
        <span className="cbb-upload__hint">{hint ?? "Přetáhni soubor sem nebo klikni pro výběr"}</span>
        {(accept || limit) && (
          <span className="cbb-upload__meta">
            {accept && <>Povoleno: {accept}</>}
            {accept && limit ? " · " : ""}
            {limit && <>Max {formatSize(limit)}</>}
          </span>
        )}
        <input
          ref={input}
          id={id}
          type="file"
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          className="cbb-upload__input"
          onChange={(e) => {
            accept_(Array.from(e.target.files ?? []));
            e.target.value = "";
          }}
        />
      </label>
      {error && (
        <p className="cbb-field__error" role="alert">
          {error}
        </p>
      )}
      {files.length > 0 && (
        <ul className="cbb-upload__list">
          {files.map((f) => (
            <li key={f.name + f.size}>
              <span className="cbb-upload__name">{f.name}</span>
              <span className="cbb-upload__size">{formatSize(f.size)}</span>
              <button type="button" onClick={() => remove(f)} aria-label={`Odebrat ${f.name}`}>
                <XIcon size={14} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
