export const toNumber = (v: any, d = 0) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : d;
};
export const toInt = (v: any, d = 0) => {
  const n = parseInt(String(v ?? ''), 10);
  return Number.isFinite(n) ? n : d;
};
export const toBool = (v: any) => {
  if (typeof v === 'boolean') return v;
  const s = String(v ?? '').toLowerCase();
  return s === 'true' || s === '1' || s === 'on' || s === 'yes';
};
export const toIdOrNull = (v: any) => {
  const n = toInt(v, NaN);
  return Number.isFinite(n) ? n : null;
};
