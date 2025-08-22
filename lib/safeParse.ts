export async function safeParse(res: Response) {
  const ct = res.headers.get('content-type') || '';
  if (!res.ok) {
    // intenta leer texto para devolver error más útil
    const text = await res.text().catch(() => '');
    try {
      const j = text ? JSON.parse(text) : null;
      if (j && typeof j === 'object' && 'error' in j) {
        throw new Error(String(j.error));
      }
    } catch {}
    throw new Error(text || res.statusText);
  }
  if (res.status === 204) return null;
  if (ct.includes('application/json')) return res.json();
  if (ct.includes('text/csv') || ct.includes('text/plain')) return res.text();
  // fallback: intenta JSON, si falla devuelve texto
  const raw = await res.text();
  try { return JSON.parse(raw); } catch { return raw; }
}
