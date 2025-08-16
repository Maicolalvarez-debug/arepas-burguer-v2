'use client';
import useSWR from 'swr'; import { useRouter } from 'next/navigation'; import { useEffect, useState } from 'react';
const fetcher = (u:string)=>fetch(u).then(r=>r.json());
export default function ProductForm({ id }:{ id?: number }){
  const router = useRouter();
  const { data: cats } = useSWR('/api/categories', fetcher);
  const [state, setState] = useState<any>({ name:'', description:'', price:0, cost:0, stock:0, active:true, categoryId:null });
  useEffect(()=>{ if (!id) return; (async()=>{ const j = await fetch(`/api/products/${id}`).then(r=>r.json()); setState(j); })(); },[id]);
  const save = async (e:React.FormEvent)=>{
    e.preventDefault();
    const method = id ? 'PUT' : 'POST'; const url = id ? `/api/products/${id}` : '/api/products';
    const res = await fetch(url, { method, headers: { 'Content-Type':'application/json' }, body: JSON.stringify(state) });
    if (res.ok) router.push('/admin/products');
  };
  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-semibold mb-4">{id? 'Editar':'Nuevo'} producto</h1>
      <form className="space-y-3" onSubmit={save}>
        <input className="input" placeholder="Nombre" value={state.name||''} onChange={e=>setState({...state, name:e.target.value})}/>
        <textarea className="input" placeholder="Descripción" value={state.description||''} onChange={e=>setState({...state, description:e.target.value})}/>
        <input className="input" type="number" placeholder="Precio (COP)" value={state.price||0} onChange={e=>setState({...state, price:Number(e.target.value)})}/>
        <input className="input" type="number" placeholder="Costo (COP)" value={state.cost||0} onChange={e=>setState({...state, cost:Number(e.target.value)})}/>
        <input className="input" type="number" placeholder="Stock" value={state.stock||0} onChange={e=>setState({...state, stock:Number(e.target.value)})}/>
        <select className="input" value={state.categoryId||''} onChange={e=>setState({...state, categoryId: e.target.value? Number(e.target.value): null})}>
          <option value="">Sin categoría</option>
          {(cats||[]).map((c:any)=> <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <label className="flex items-center gap-2"><input type="checkbox" checked={!!state.active} onChange={e=>setState({...state, active:e.target.checked})}/> Activo</label>
        <button className="btn-primary">Guardar</button>
      </form>
    </div>
  );
}
