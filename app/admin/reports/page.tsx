'use client';
import { useEffect, useState } from 'react'; import { fmtCOP } from '@/components/Number';
export default function ReportsPage(){
  const [from, setFrom] = useState<string>(''); const [to, setTo] = useState<string>(''); const [data, setData] = useState<any>(null);
  const load = async ()=>{ const params = new URLSearchParams(); if (from) params.set('from', from); if (to) params.set('to', to);
    const j = await fetch('/api/reports?'+params.toString()).then(r=>r.json()); setData(j); };
  useEffect(()=>{ load(); },[]);
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Reportes</h1>
      <div className="card flex gap-3">
        <div><div className="label">Desde</div><input className="input" type="date" value={from} onChange={e=>setFrom(e.target.value)} /></div>
        <div><div className="label">Hasta</div><input className="input" type="date" value={to} onChange={e=>setTo(e.target.value)} /></div>
        <button className="btn" onClick={load}>Actualizar</button>
      </div>
      {data && (<div className="grid md:grid-cols-3 gap-4">
        <div className="card"><div className="text-sm text-gray-400">Ventas</div><div className="text-2xl font-semibold">{fmtCOP(data.sales)}</div></div>
        <div className="card"><div className="text-sm text-gray-400">Costos</div><div className="text-2xl font-semibold">{fmtCOP(data.costs)}</div></div>
        <div className="card"><div className="text-sm text-gray-400">Utilidad bruta</div><div className="text-2xl font-semibold">{fmtCOP(data.profit)}</div></div>
        <div className="card md:col-span-3">
          <div className="text-lg font-semibold mb-2">Top productos</div>
          <table><thead><tr><th>Producto</th><th>Unidades</th><th>Ingresos</th></tr></thead>
            <tbody>{data.top.map((t:any)=>(<tr key={t.productId}><td>{t.name}</td><td>{t.qty}</td><td>{fmtCOP(t.revenue)}</td></tr>))}</tbody>
          </table>
        </div>
      </div>)}
    </div>
  );
}
