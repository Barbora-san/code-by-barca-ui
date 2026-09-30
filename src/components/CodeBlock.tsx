import { useEffect, useRef, useState } from "react";
import { cn } from "../lib/cn";
import { CheckIcon, CopyIcon } from "./Icons";

export interface CodeBlockProps {
  code: string;
  /** Jen popisek v hlavičce – knihovna nezvýrazňuje syntaxi (žádná těžká závislost). */
  language?: string;
  showLineNumbers?: boolean;
  copyLabel?: string;
  copiedLabel?: string;
  className?: string;
}

/** Blok kódu s hlavičkou a tlačítkem Kopírovat. Pro highlighting si `code` obal vlastním highlighterem. */
export function CodeBlock({
  code,
  language = "text",
  showLineNumbers = true,
  copyLabel = "Kopírovat",
  copiedLabel = "Zkopírováno!",
  className,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      /* schránka nedostupná (http / oprávnění) – nic se neděje */
    }
  };

  const lines = code.replace(/\n$/, "").split("\n");

  return (
    <div className={cn("cbb-code", className)}>
      <div className="cbb-code__head">
        <span>{language}</span>
        <button type="button" onClick={copy}>
          {copied ? <CheckIcon size={12} /> : <CopyIcon size={12} />}
          {copied ? copiedLabel : copyLabel}
        </button>
      </div>
      <pre className="cbb-code__pre">
        <code>
          {lines.map((line, i) => (
            <span key={i} className="cbb-code__line">
              {showLineNumbers && <span className="cbb-code__no">{i + 1}</span>}
              {line || "\u00a0"}
              {"\n"}
            </span>
          ))}
        </code>
      </pre>
    </div>
  );
}
