'use client';
import useSWR from 'swr';
import Link from 'next/link';
import { useMemo, useState } from 'react';
const fetcher=(u:string)=>fetch(u).then(r=>r.json());

export default function Products(){
  const [q,setQ]=useState('');
  const [categoryId, setCategoryId] = useState<string>('');
  const { data: cats }=useSWR('/api/categories', fetcher);
  const { data: items, mutate }=useSWR(`/api/products?q=${encodeURIComponent(q)}&categoryId=${categoryId}`, fetcher);

  const del = async(id:number)=>{
    if(!confirm('¿Eliminar este producto?')) return;
    await fetch(`/api/products/${id}`, { method:'DELETE' });
    mutate();
  };

  const move = async (index:number, dir:'up'|'down') => {
    const arr = [...(items||[])];
    const to = dir==='up' ? index-1 : index+1;
    if (to<0 || to>=arr.length) return;
    const tmp = arr[index]; arr[index]=arr[to]; arr[to]=tmp;
    mutate();
    await fetch('/api/products/reorder', { method:'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ ids: arr.map((x:any)=>x.id) }) });
    mutate();
  };

  const list = items||[];
  const catsMap = useMemo(()=>Object.fromEntries((cats||[]).map((c:any)=>[c.id,c.name])),[cats]);

  return <div className="space-y-3">
    <div className="flex items-center justify-between">
      <h1 className="text-2xl font-semibold">Productos</h1>
      <Link className="btn-primary" href="/admin/products/new">Nuevo producto</Link>
    </div>
    <div className="card grid sm:grid-cols-3 gap-2">
      <input className="input" placeholder="Buscar..." value={q} onChange={e=>setQ(e.target.value)} />
      <select className="input" value={categoryId} onChange={e=>setCategoryId(e.target.value)}>
        <option value="">Todas las categorías</option>
        {(cats||[]).map((c:any)=>(<option key={c.id} value={c.id}>{c.name}</option>))}
      </select>
    </div>

    <div className="grid gap-2">
      {list.map((p:any, idx:number)=>(
        <div key={p.id} className="card flex items-center gap-3 justify-between">
          <div className="grow">
            <div className="font-semibold">{p.name}</div>
            <div className="text-xs text-white/60">{(catsMap as any)[p.categoryId] || 'Sin categoría'} · ${p.price?.toLocaleString('es-CO')}</div>
          </div>
          <div className="flex gap-2 items-center">
            <button className="btn" onClick={()=>move(idx,'up')}>↑</button>
            <button className="btn" onClick={()=>move(idx,'down')}>↓</button>
            <Link className="btn" href={`/admin/products/${p.id}`}>Editar</Link>
            <button className="btn" onClick={()=>del(p.id)}>Eliminar</button>
          </div>
        </div>
      ))}
      {!list.length && <div className="text-sm text-white/60">No hay productos con ese filtro.</div>}
    </div>
  </div>;
}
