export type ClassValue = string | number | bigint | boolean | null | undefined;

/** Spojí CSS třídy, falsy hodnoty zahodí. */
export function cn(...values: ClassValue[]): string {
  return values.filter(Boolean).join(" ");
}
