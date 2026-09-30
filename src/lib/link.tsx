import { createContext, useContext, type ElementType, type ReactNode } from "react";

type LinkCtx = { linkComponent: ElementType };

const LinkContext = createContext<LinkCtx>({ linkComponent: "a" });

export interface CbbProviderProps {
  /**
   * Komponenta pro interní odkazy – v Next.js předej `next/link`,
   * v React Routeru `Link` (pozor, ten chce `to` místo `href`, tam použij wrapper).
   * Výchozí je obyčejné `<a>`.
   */
  linkComponent?: ElementType;
  children: ReactNode;
}

export function CbbProvider({ linkComponent = "a", children }: CbbProviderProps) {
  return <LinkContext.Provider value={{ linkComponent }}>{children}</LinkContext.Provider>;
}

/** Vrací komponentu, kterou knihovna používá pro odkazy. */
export function useLinkComponent(): ElementType {
  return useContext(LinkContext).linkComponent;
}

/** Externí odkaz? (http/https/mailto/tel nebo //) – ty se nikdy nepředávají routeru. */
export function isExternalHref(href?: string): boolean {
  return !!href && /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(href);
}
