export async function safeParse(res: Response) {
  const ct = res.headers.get('content-type') || '';
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(text || res.statusText);
  }
  if (res.status === 204) return null;
  if (ct.includes('application/json')) return res.json();
  const raw = await res.text();
  try { return JSON.parse(raw); } catch { return raw; }
}
