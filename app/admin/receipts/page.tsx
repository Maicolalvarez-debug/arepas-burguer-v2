
'use client';
import useSWR from 'swr';
import Link from 'next/link';
import { useMemo, useState } from 'react';

const fetcher = (u: string) => fetch(u).then(r => r.json());
const pesos = (n: number) => '$' + (n || 0).toLocaleString('es-CO');

function fmt(d: Date) { return d.toISOString().slice(0,10); }
function monday(d = new Date()) {
  const x = new Date(d);
  const day = (x.getDay() + 6) % 7; // 0..6, 0 => Monday
  x.setDate(x.getDate() - day);
  return x;
}
function sunday(d = new Date()) {
  const m = monday(d);
  const s = new Date(m);
  s.setDate(m.getDate() + 6);
  return s;
}
function firstOfMonth(d = new Date()) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}
function lastOfMonth(d = new Date()) {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0);
}

export default function Receipts(){
  const today = fmt(new Date());
  const [from,setFrom]=useState<string>(today);
  const [to,setTo]=useState<string>(today);
  const [printed,setPrinted]=useState<string>('true'); // 'all' | 'true' | 'false'

  // Build query string; SWR refetches automatically when deps change
  const query = useMemo(()=>{
    const q = new URLSearchParams();
    if (from) q.set('from', from);
    if (to) q.set('to', to);
    if (printed !== 'all') q.set('printed', String(printed === 'true'));
    return q.toString();
  }, [from,to,printed]);

  const { data, isLoading, mutate } = useSWR(`/api/orders?${query}`, fetcher);

  const setDiscount = async (id:number, current:number=0) => {
    const s = prompt('Nuevo descuento (valor numérico en pesos):', String(current || 0));
    if (s===null) return;
    const discount = Math.max(0, Number(s||0));
    await fetch(`/api/orders/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ discount }),
    });
    mutate();
  };

  const markPrinted = async (id:number, printed:boolean) => {
    await fetch(`/api/orders/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ printed }),
    });
    mutate();
  };

  const applyQuick = (type:'day'|'week'|'month') => {
    const now = new Date();
    if (type==='day') { setFrom(fmt(now)); setTo(fmt(now)); }
    if (type==='week') { setFrom(fmt(monday(now))); setTo(fmt(sunday(now))); }
    if (type==='month') { setFrom(fmt(firstOfMonth(now))); setTo(fmt(lastOfMonth(now))); }
  };

  const csvHref = useMemo(()=>{
    const q = new URLSearchParams();
    if (from) q.set('from', from);
    if (to) q.set('to', to);
    if (printed !== 'all') q.set('printed', String(printed === 'true'));
    return `/api/orders.csv?${q.toString()}`;
  }, [from,to,printed]);

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-semibold">Recibos</h1>

      <div className="card p-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:gap-4">
        <div className="flex-1">
          <label className="block text-sm mb-1">Desde</label>
          <input type="date" value={from} onChange={e=>setFrom(e.target.value)} className="input w-full" />
        </div>
        <div className="flex-1">
          <label className="block text-sm mb-1">Hasta</label>
          <input type="date" value={to} onChange={e=>setTo(e.target.value)} className="input w-full" />
        </div>
        <div className="flex-1">
          <label className="block text-sm mb-1">Estado</label>
          <select className="input w-full" value={printed} onChange={e=>setPrinted(e.target.value)}>
            <option value="all">Todos</option>
            <option value="true">Impresos</option>
            <option value="false">No impresos</option>
          </select>
        </div>
        <div className="flex gap-2">
          <button className="btn" onClick={()=>applyQuick('day')}>Hoy</button>
          <button className="btn" onClick={()=>applyQuick('week')}>Esta semana</button>
          <button className="btn" onClick={()=>applyQuick('month')}>Este mes</button>
        </div>
        <div>
          <a className="btn" href={csvHref}>Exportar CSV</a>
        </div>
      </div>

      <div className="space-y-3">
        {isLoading && <div className="text-sm opacity-70">Cargando…</div>}
        {(data||[]).map((o:any)=> (
          <div key={o.id} className="card p-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="space-y-1">
              <div className="text-sm opacity-70">#{o.id} • {new Date(o.createdAt).toLocaleString('es-CO')}</div>
              <div className="flex gap-6 text-sm">
                <span><b>Bruto:</b> {pesos(o.gross)}</span>
                {o.discount>0 && <span><b>Desc:</b> -{pesos(o.discount)}</span>}
                <span><b>Neto:</b> {pesos(o.net)}</span>
                <span><b>Impreso:</b> {o.printed ? 'Sí' : 'No'}</span>
              </div>
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
        {!(data||[]).length && !isLoading && <div className="text-sm opacity-70">No hay recibos en ese rango.</div>}
      </div>
    </div>
  );
}
