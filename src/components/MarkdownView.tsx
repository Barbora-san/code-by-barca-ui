import { useMemo } from "react";
import { cn } from "../lib/cn";
import { markdownToHtml } from "../lib/markdown";

export interface MarkdownViewProps {
  /** Markdown text k vykreslení. */
  source: string;
  /** Velikost písma: malý, normální nebo úvodní (velký) text. */
  size?: "small" | "normal" | "lead";
  /** Text, který se zobrazí, když je `source` prázdný. */
  emptyText?: string;
  /** Vlastní CSS třída přidaná ke kořenovému prvku. */
  className?: string;
}

/**
 * Vykreslí Markdown jako stylovaný text. Vstup se escapuje a adresy se kontrolují,
 * takže je bezpečné ho použít i na obsahu od uživatelů.
 */
export function MarkdownView({ source, size = "normal", emptyText, className }: MarkdownViewProps) {
  const html = useMemo(() => markdownToHtml(source), [source]);
  if (!html && emptyText) return <p className={cn("cbb-md cbb-md--empty", className)}>{emptyText}</p>;
  return <div className={cn("cbb-md", `cbb-md--${size}`, className)} dangerouslySetInnerHTML={{ __html: html }} />;
}
