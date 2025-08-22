'use client';

// app/admin/reports/page.tsx

import useSWR from 'swr';
import { useMemo, useState } from 'react';

const fetcher = (url: string) => fetch(url).then(r => r.json());

export default function ReportsPage() {
  const todayStr = new Date().toISOString().slice(0,10);
  const [from, setFrom] = useState(todayStr);
  const [to, setTo] = useState(todayStr);

  const url = useMemo(() => `/api/reports?from=${from}&to=${to}&groupBy=day`, [from, to]);
  const { data, error, isLoading } = useSWR(url, fetcher);

  return (
    <div className="space-y-4 p-4">
      <h1 className="text-2xl font-semibold">Informes</h1>
      <div className="grid sm:grid-cols-5 gap-2">
        <div className="flex flex-col gap-1">
          <span className="text-xs opacity-70 font-medium">Desde</span>
          <input className="border rounded px-2 py-1" type="date" value={from} onChange={e=>setFrom(e.target.value)} />
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-xs opacity-70 font-medium">Hasta</span>
          <input className="border rounded px-2 py-1" type="date" value={to} onChange={e=>setTo(e.target.value)} />
        </div>
      </div>

      {isLoading && <div>Cargando…</div>}
      {error && <div className="text-red-600 text-sm">Error cargando datos</div>}
      {!isLoading && !error && (
        <pre className="text-xs bg-black/5 rounded p-3 overflow-auto">{JSON.stringify(data, null, 2)}</pre>
      )}
    </div>
  );
}