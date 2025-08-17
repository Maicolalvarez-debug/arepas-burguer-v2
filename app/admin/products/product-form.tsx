'use client';
import useSWR from 'swr'; import { useRouter } from 'next/navigation'; import { useEffect, useMemo, useState } from 'react';
const fetcher=(u:string)=>fetch(u).then(r=>r.json());

type Modifier = { id:number; name:string; priceDelta:number; active:boolean };
export default function ProductForm({ id }:{ id?: number }){
  const router=useRouter();
  const { data: cats }=useSWR('/api/categories', fetcher);
  const { data: allMods }=useSWR('/api/modifiers', fetcher);
  const [state,setState]=useState<any>({ name:'', description:'', price:0, cost:0, stock:0, active:true, categoryId:null, imageUrl:'', modifierIds: [] as number[] });
  useEffect(()=>{ if(!id) return; (async()=>{ const j=await fetch(`/api/products/${id}`).then(r=>r.json()); setState({ ...j, modifierIds: (j.modifiers||[]).map((x:any)=> x.modifier?.id ?? x.id) }); })(); },[id]);
  const toggleMod = (mid:number)=> setState((prev:any)=> ({ ...prev, modifierIds: prev.modifierIds.includes(mid) ? prev.modifierIds.filter((x:number)=>x!==mid) : [...prev.modifierIds, mid] }));
  const save=async(e:React.FormEvent)=>{ e.preventDefault(); const method=id?'PUT':'POST'; const url=id?`/api/products/${id}`:'/api/products';
    const res=await fetch(url,{ method, headers:{'Content-Type':'application/json'}, body: JSON.stringify(state) }); if(res.ok) router.push('/admin/products'); else alert('No se pudo guardar'); };
  const modifiers = useMemo(()=> (allMods||[]).filter((m:Modifier)=> m.active!==false), [allMods]);
  return (<div className="max-w-2xl"><h1 className="text-2xl font-semibold mb-4">{id?'Editar':'Nuevo'} producto</h1>
    <form className="space-y-3" onSubmit={save}>
      <div><label className="label">Nombre</label><input className="input" value={state.name||''} onChange={e=>setState({...state, name:e.target.value})}/></div>
      <div><label className="label">Descripción</label><textarea className="input" value={state.description||''} onChange={e=>setState({...state, description:e.target.value})}/></div>
      <div className="grid grid-cols-3 gap-3">
        <div><label className="label">Precio (COP)</label><input className="input" type="number" value={state.price||0} onChange={e=>setState({...state, price:Number(e.target.value)})}/></div>
        <div><label className="label">Costo (COP)</label><input className="input" type="number" value={state.cost||0} onChange={e=>setState({...state, cost:Number(e.target.value)})}/></div>
        <div><label className="label">Stock</label><input className="input" type="number" value={state.stock||0} onChange={e=>setState({...state, stock:Number(e.target.value)})}/></div>
      </div>
      <div><label className="label">Categoría</label>
        <select className="input" value={state.categoryId||''} onChange={e=>setState({...state, categoryId: e.target.value? Number(e.target.value): null})}>
          <option value="">Sin categoría</option>{(cats||[]).map((c:any)=> <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>
      <div>
        <label className="label">Imagen (URL)</label>
        <input className="input" placeholder="https://..." value={state.imageUrl||''} onChange={e=>setState({...state, imageUrl:e.target.value})}/>
        {state.imageUrl ? <img src={state.imageUrl} alt="preview" className="mt-2 rounded-lg max-h-48" /> : <div className="text-xs text-gray-400 mt-1">Pega un enlace a una imagen (JPG/PNG)</div>}
      </div>
      <div className="card">
        <div className="font-semibold mb-2">Adicionales disponibles para este producto</div>
        <div className="grid sm:grid-cols-2 gap-2">
          {modifiers.map((m:Modifier)=> (
            <label key={m.id} className="flex items-center gap-2">
              <input type="checkbox" checked={state.modifierIds.includes(m.id)} onChange={()=>toggleMod(m.id)} />
              <span>{m.name}</span>
            </label>
          ))}
        </div>
        {!modifiers.length && <div className="text-sm text-gray-400">No hay adicionales creados aún.</div>}
      </div>
      <label className="flex items-center gap-2"><input type="checkbox" checked={!!state.active} onChange={e=>setState({...state, active:e.target.checked})}/> Activo</label>
      <button className="btn-primary">Guardar</button>
    </form></div>); }