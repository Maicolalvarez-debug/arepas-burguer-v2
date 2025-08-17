'use client';
import useSWR from 'swr';
import Link from 'next/link';
import { useState, useMemo } from 'react';
const fetcher=(u:string)=>fetch(u).then(r=>r.json());

export default function AdminProducts(){
  const [q,setQ]=useState('');
  const [categoryId, setCategoryId] = useState<string>('');
  const { data: cats }=useSWR('/api/categories', fetcher);
  const { data: items, mutate }=useSWR(`/api/products?q=${encodeURIComponent(q)}&categoryId=${categoryId}`, fetcher);

  const del = async(id:number)=>{
    if(!confirm('¿Eliminar este producto?')) return;
    await fetch(`/api/products/${id}`, { method:'DELETE' });
    mutate();
  };

  const list = items||[];
  const catsMap = useMemo(()=>Object.fromEntries((cats||[]).map((c:any)=>[c.id,c.name])),[cats]);

  return <div className="space-y-4">
    <div className="flex items-center justify-between">
      <h1 className="text-2xl font-semibold">Productos</h1>
      <Link className="btn-primary" href="/admin/products/new">Nuevo</Link>
    </div>

    <div className="flex flex-wrap gap-2 items-end">
      <div className="grow">
        <label className="label">Buscar</label>
        <input className="input" placeholder="Nombre o descripción..." value={q} onChange={e=>setQ(e.target.value)} />
      </div>
      <div>
        <label className="label">Categoría</label>
        <select className="input" value={categoryId} onChange={e=>setCategoryId(e.target.value)}>
          <option value="">Todas</option>
          {(cats||[]).map((c:any)=><option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>
    </div>

    <div className="grid gap-3">
      {list.map((p:any)=>(
        <div key={p.id} className="card flex items-center gap-3">
          <div className="w-20 h-16 overflow-hidden rounded-md bg-white/5">
            {p.imageUrl ? <img src={p.imageUrl} className="w-full h-full object-cover" /> : <div className="w-full h-full grid place-items-center text-xs text-white/40">Sin img</div>}
          </div>
          <div className="grow">
            <div className="font-semibold">{p.name}</div>
            <div className="text-xs text-white/60">{(catsMap as any)[p.categoryId]||'Sin categoría'} · ${p.price?.toLocaleString('es-CO')}</div>
          </div>
          <div className="flex gap-2">
            <Link className="btn" href={`/admin/products/${p.id}`}>Editar</Link>
            <button className="btn" onClick={()=>del(p.id)}>Eliminar</button>
          </div>
        </div>
      ))}
      {!list.length && <div className="text-sm text-white/60">No hay productos con ese filtro.</div>}
    </div>
  </div>;
}
