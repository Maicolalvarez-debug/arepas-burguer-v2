export function toNumber(v: unknown, fallback = 0) {
  if (v == null) return fallback;
  if (typeof v === 'number') return Number.isFinite(v) ? v : fallback;
  const s = String(v).trim().replace(/,/g, '.');
  if (s === '') return fallback;
  const n = Number(s);
  return Number.isFinite(n) ? n : fallback;
}
