import type { ReactNode } from "react";

export interface PropsRef {
  /** Název typu v props.generated.json, např. "ButtonProps". */
  type: string;
  /** Název komponenty (pro výchozí hodnoty), např. "Button". */
  component?: string;
  title?: string;
}

export interface Doc {
  id: string;
  name: string;
  /** Krátký popis do hlavičky bloku. */
  desc: ReactNode;
  /** Tabulky parametrů. Bez zadání se vezme `${name}Props`. */
  props?: (PropsRef | string)[];
  code: string;
  preview: ReactNode;
  /** Ukázka je širší / potřebuje vlastní pozadí (bez vycentrování). */
  block?: boolean;
  /** Poznámka pod ukázkou. */
  note?: ReactNode;
}

export interface Category {
  id: string;
  title: string;
  docs: Doc[];
}
