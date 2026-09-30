export type ClassValue = string | number | false | null | undefined;

/** Spojí CSS třídy, falsy hodnoty zahodí. */
export function cn(...values: ClassValue[]): string {
  return values.filter(Boolean).join(" ");
}
