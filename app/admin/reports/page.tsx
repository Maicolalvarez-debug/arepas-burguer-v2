'use client';
import useSWR from 'swr';
import { useState } from 'react';
const fetcher=(u:string)=>fetch(u).then(r=>r.json());
const pesos=(n:number)=>'$'+(n||0).toLocaleString('es-CO');

export default function Reports(){
  const today = new Date().toISOString().slice(0,10);
  const firstOfMonth = new Date(); firstOfMonth.setDate(1);
  const [from, setFrom] = useState(firstOfMonth.toISOString().slice(0,10));
  const [to, setTo] = useState(today);
  const [groupBy, setGroupBy] = useState<'day'|'week'|'month'>('day');
  const { data, isLoading, mutate } = useSWR(`/api/reports?from=${from}&to=${to}&groupBy=${groupBy}`, fetcher);
  const todayStr = new Date().toISOString().slice(0,10);
  const { data: todayData } = useSWR(`/api/reports?from=${todayStr}&to=${todayStr}&groupBy=day`, fetcher);

  return <div className="space-y-4">
    <h1 className="text-2xl font-semibold">Informes</h1>
    <div className="card grid sm:grid-cols-5 gap-2">
      <div className="flex flex-col gap-1"><span className="text-xs text-white/70 font-medium">Desde</span><input className="input" type="date" value={from} onChange={e=>setFrom(e.target.value)} /></div>
      <div className="flex flex-col gap-1"><span className="text-xs text-white/70 font-medium">Hasta</span><input className="input" type="date" value={to} onChange={e=>setTo(e.target.value)} /></div>
      <div className="flex flex-col gap-1">
        <span className="text-xs text-white/70 font-medium">Agrupar por</span>
        <select className="input" value={groupBy} onChange={e=>setGroupBy(e.target.value as any)}>
          <option value="day">Día</option>
          <option value="week">Semana</option>
          <option value="month">Mes</option>
        </select>
      </div>
      <div className="flex items-end gap-2">
        <button className="btn" onClick={()=>{const t=new Date(); const s=new Date(t); s.setDate(t.getDate()-6); setFrom(s.toISOString().slice(0,10)); setTo(t.toISOString().slice(0,10)); setGroupBy('day');}>Semana</button>
        <button className="btn" onClick={()=>{const t=new Date(); const s=new Date(t.getFullYear(), t.getMonth(), 1); setFrom(s.toISOString().slice(0,10)); setTo(t.toISOString().slice(0,10)); setGroupBy('day');}>Mes</button>
        <button className="btn-primary" onClick={()=>mutate()}>Actualizar</button>
        <a className="btn" href={`/api/reports.csv?from=${from}&to=${to}&groupBy=${groupBy}`} target="_blank">Exportar CSV</a>
      </div>
    </div>

    {isLoading && <div>Cargando…</div>}
    {todayData && (
      <div className="card">
        <div className="mb-2 font-semibold">Totales hoy</div>
        <div className="grid sm:grid-cols-4 gap-2">
          <div className="card"><div className="text-xs opacity-70">Brutas</div><div className="text-xl font-semibold">{pesos(todayData.totals.gross)}</div></div>
          <div className="card"><div className="text-xs opacity-70">Netas</div><div className="text-xl font-semibold">{pesos(todayData.totals.net)}</div></div>
          <div className="card"><div className="text-xs opacity-70">Costos</div><div className="text-xl font-semibold">{pesos(todayData.totals.cost)}</div></div>
          <div className="card"><div className="text-xs opacity-70">Beneficio</div><div className="text-xl font-semibold">{pesos(todayData.totals.profit)}</div></div>
        </div>
      </div>
    )}
    {data && <>
      <div className="grid sm:grid-cols-4 gap-2">
        <div className="card"><div className="text-xs opacity-70">Ventas brutas</div><div className="text-xl font-semibold">{pesos(data.totals.gross)}</div></div>
        <div className="card"><div className="text-xs opacity-70">Ventas netas</div><div className="text-xl font-semibold">{pesos(data.totals.net)}</div></div>
        <div className="card"><div className="text-xs opacity-70">Costos</div><div className="text-xl font-semibold">{pesos(data.totals.cost)}</div></div>
        <div className="card"><div className="text-xs opacity-70">Beneficio bruto</div><div className="text-xl font-semibold">{pesos(data.totals.profit)}</div></div>
      </div>
      <div className="card">
        <div className="grid grid-cols-5 gap-2 font-semibold text-sm mb-1 opacity-80"><div>Periodo</div><div>Brutas</div><div>Netas</div><div>Costos</div><div>Beneficio</div></div>
        <div className="grid gap-1">
          {data.series.map((s:any)=>(
            <div key={s.label} className="grid grid-cols-5 gap-2 text-sm">
              <div className="opacity-80">{s.label}</div>
              <div>{pesos(s.gross)}</div>
              <div>{pesos(s.net)}</div>
              <div>{pesos(s.cost)}</div>
              <div className="font-semibold">{pesos(s.profit)}</div>
            </div>
          ))}
        </div>
      </div>
    </>}
  </div>;
}
