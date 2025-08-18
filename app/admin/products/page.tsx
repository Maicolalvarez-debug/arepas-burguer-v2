'use client';
import useSWR from 'swr';
import { useMemo, useState } from 'react';

const fetcher = (url:string)=>fetch(url).then(r=>r.json());

export default function AdminProductsPage(){
  const { data, mutate } = useSWR('/api/products?all=1', fetcher);
  const [query, setQuery] = useState('');
  const [cat, setCat] = useState<number|''>('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const products = data?.items || [];
  const categories = data?.categories || [];

  const filtered = useMemo(()=>{
    return products.filter((p:any)=>{
      const okName = p.name.toLowerCase().includes(query.toLowerCase());
      const okCat = cat === '' ? true : p.categoryId === cat;
      const okMin = minPrice ? p.price >= Number(minPrice) : true;
      const okMax = maxPrice ? p.price <= Number(maxPrice) : true;
      return okName && okCat && okMin && okMax;
    }).sort((a:any,b:any)=> (a.order??0)-(b.order??0));
  }, [products, query, cat, minPrice, maxPrice]);

  let tempOrder = filtered.slice();

  function onDragStart(e:React.DragEvent, idx:number){
    e.dataTransfer.setData('text/plain', String(idx));
  }
  function onDrop(e:React.DragEvent, idx:number){
    const from = Number(e.dataTransfer.getData('text/plain'));
    const arr = filtered.slice();
    const [moved] = arr.splice(from,1);
    arr.splice(idx,0,moved);
    fetch('/api/products/reorder', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ ids: arr.map((p:any)=>p.id) })
    }).then(()=>mutate());
  }

  return (
    <div className="card">
      <h1>Productos</h1>
      <div className="grid" style={{gridTemplateColumns:'1fr 1fr 1fr 1fr', gap:8}}>
        <input className="input" placeholder="Buscar por nombre" value={query} onChange={e=>setQuery(e.target.value)} />
        <select className="input" value={cat} onChange={e=>setCat(e.target.value===''? '': Number(e.target.value))}>
          <option value="">Todas las categorías</option>
          {categories.map((c:any)=>(<option key={c.id} value={c.id}>{c.name}</option>))}
        </select>
        <input className="input" placeholder="Precio mín" value={minPrice} onChange={e=>setMinPrice(e.target.value)} />
        <input className="input" placeholder="Precio máx" value={maxPrice} onChange={e=>setMaxPrice(e.target.value)} />
      </div>

      <div className="mt-4" style={{display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))', gap:12}}>
        {filtered.map((p:any, i:number)=>(
          <div key={p.id} className="card" draggable onDragStart={(e)=>onDragStart(e,i)} onDragOver={(e)=>e.preventDefault()} onDrop={(e)=>onDrop(e,i)}>
            <div className="flex items-center gap-2">
              <img src={p.imageUrl || '/placeholder.png'} alt="" width={48} height={48} style={{objectFit:'cover',borderRadius:8}}/>
              <div style={{fontWeight:600}}>{p.name}</div>
            </div>
            <div className="mt-2 text-sm opacity-80">#{p.id} · ${p.price}</div>
            <div className="mt-2 flex gap-2">
              <a className="btn" href={`/admin/products/${p.id}`}>Editar</a>
              <form action={`/api/products/${p.id}`} method="post" onSubmit={(e)=>{ if(!confirm('¿Eliminar producto?')) e.preventDefault(); }}>
                <input type="hidden" name="_method" value="DELETE"/>
                <button className="btn" type="submit">Eliminar</button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
