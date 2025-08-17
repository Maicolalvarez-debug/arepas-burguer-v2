'use client';
import useSWR from 'swr';
import { useMemo, useState } from 'react';
import Link from 'next/link';

const fetcher=(u:string)=>fetch(u).then(r=>r.json());

export default function Menu(){
  const { data: cats }=useSWR('/api/categories', fetcher);
  const { data: items }=useSWR('/api/products', fetcher);
  const [open,setOpen]=useState<Record<number,boolean>>({});

  const grouped = useMemo(()=>{
    const g:Record<number, any[]> = {};
    (items||[]).forEach((p:any)=>{ g[p.categoryId] ??= []; g[p.categoryId].push(p) });
    return g;
  },[items]);

  const toggle=(id:number)=> setOpen(o=>({...o, [id]: !o[id]}));

  return <div className="space-y-4">
    <div className="flex items-center justify-between">
      <h1 className="text-2xl font-semibold">Menú</h1>
      <Link className="btn" href="/cart">Carrito</Link>
    </div>

    <div className="space-y-2">
      {(cats||[]).map((c:any)=>(
        <div key={c.id} className="card">
          <button className="w-full text-left flex items-center justify-between" onClick={()=>toggle(c.id)}>
            <span className="font-semibold">{c.name}</span>
            <span className="text-sm opacity-70">{open[c.id] ? 'Ocultar' : 'Ver'}</span>
          </button>
          {open[c.id] && (
            <div className="grid-menu mt-3">
              {(grouped[c.id]||[]).map((p:any)=>(
                <div key={p.id} className="card">
                  {p.imageUrl && <img src={p.imageUrl} className="product-img" />}
                  <div className="mt-2 font-semibold">{p.name}</div>
                  <div className="text-sm opacity-80">{p.description}</div>
                  <div className="mt-2 font-bold">${(p.price||0).toLocaleString('es-CO')}</div>
                  <button className="btn-primary mt-2" onClick={()=>alert('Agregado (demo)')}>Agregar</button>
                </div>
              ))}
              {!grouped[c.id]?.length && <div className="text-sm opacity-70">Sin productos aún.</div>}
            </div>
          )}
        </div>
      ))}
    </div>
  </div>;
}
