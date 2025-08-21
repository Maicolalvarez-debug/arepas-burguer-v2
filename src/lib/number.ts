// src/lib/number.ts
/**
 * Convierte un valor a número de forma segura.
 * - Si ya es número y es finito, lo retorna.
 * - Si es string (o algo parseable), intenta Number(...).
 * - Si no es válido, retorna el fallback (por defecto 0).
 */
export function toNumber(value: unknown, fallback: number = 0): number {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  const str = typeof value === 'string' ? value : (value as any)?.toString?.();
  const n = Number(str);
  return Number.isFinite(n) ? n : fallback;
}
