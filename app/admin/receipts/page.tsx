'use client';
import useSWR from 'swr';
import Link from 'next/link';
import { useState } from 'react';
const fetcher=(u:string)=>fetch(u).then(r=>r.json());
const pesos=(n:number)=>'$'+(n||0).toLocaleString('es-CO');

export default function Receipts(){
  const today = new Date().toISOString().slice(0,10);
  const [from,setFrom]=useState(today);
  const [to,setTo]=useState(today);
  const [printed,setPrinted]=useState<string>('all');

  const q = new URLSearchParams();
  if (from) q.set('from', from);
  if (to) q.set('to', to);
  if (printed!=='all') q.set('printed', String(printed==='true'));

  const { data, mutate } = useSWR(`/api/orders?${q.toString()}`, fetcher);

  const markPrinted = async(id:number, p:boolean)=>{
    await fetch(`/api/orders/${id}`,{ method:'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ printed: p })});
    mutate();
  };
  const setDiscount = async (id:number, current:number=0)=>{
    const v = window.prompt('Descuento en $', String(current||0));
    if(v===null) return;
    const discount = Math.max(0, Number(v)||0);
    await fetch(`/api/orders/${id}`, { method:'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ discount }) });
    mutate();
  };

  return <div className="space-y-4">
    <h1 className="text-2xl font-semibold">Recibos</h1>
    <div className="card grid sm:grid-cols-5 gap-2">
      <div className="flex flex-col gap-1"><span className="text-xs text-white/70 font-medium">Desde</span><input className="input" type="date" value={from} onChange={e=>setFrom(e.target.value)} /></div>
      <div className="flex flex-col gap-1"><span className="text-xs text-white/70 font-medium">Hasta</span><input className="input" type="date" value={to} onChange={e=>setTo(e.target.value)} /></div>
      <div className="flex flex-col gap-1">
        <span className="text-xs text-white/70 font-medium">Estado</span>
        <select className="input" value={printed} onChange={e=>setPrinted(e.target.value)}>
          <option value="all">Todos</option>
          <option value="false">Pendientes</option>
          <option value="true">Impresos</option>
        </select>
      </div>
      <div className="flex items-end gap-2">
        <a className="btn" href={`/api/orders.csv?${q.toString()}`} target="_blank">Exportar CSV</a>
      </div>
    </div>

    <div className="grid gap-2">
      {(data||[]).map((o:any)=>(
        <div key={o.id} className="card flex items-center justify-between gap-3">
          <div className="grow">
            <div className="font-semibold">#{o.id} — {o.tableCode || 'Sin mesa'}</div>
            <div className="text-xs opacity-80">{new Date(o.createdAt).toLocaleString('es-CO')}</div>
          </div>
          <div className="text-sm text-right">
            <div className="font-semibold">{pesos(o.net)}</div>
            {o.discount>0 && <div className="text-xs opacity-80">Desc: {pesos(o.discount)}</div>}
          </div>
          <div className="flex gap-2 items-center">
            <button className="btn" onClick={()=>setDiscount(o.id, o.discount)}>Descuento</button>
            <Link className="btn" href={`/admin/receipts/${o.id}/print`} target="_blank">Imprimir comanda</Link>
            {o.printed
              ? <button className="btn" onClick={()=>markPrinted(o.id,false)}>Marcar como NO impresa</button>
              : <button className="btn-primary" onClick={()=>markPrinted(o.id,true)}>Marcar como impresa</button>}
          </div>
        </div>
      ))}
      {!(data||[]).length && <div className="text-sm opacity-70">No hay recibos en ese rango.</div>}
    </div>
  </div>;
}
