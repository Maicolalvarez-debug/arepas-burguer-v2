export async function adminFetchList(url: string) {
  const res = await fetch(url, { cache: 'no-store' });
  const ct = res.headers.get('content-type') || '';
  if (!res.ok) return [];
  if (ct.includes('application/json')) {
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  }
  return [];
}
