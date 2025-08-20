'use client';
import useSWR from 'swr';
import { useState } from 'react';
const fetcher=(u:string)=>fetch(u).then(r=>r.json());

export default function Modifiers(){
  
  const move = async(index:number, dir:'up'|'down')=>{
    const arr = [...(data||[])];
    const to = dir==='up' ? index-1 : index+1;
    if (to<0 || to>=arr.length) return;
    const tmp = arr[index]; arr[index]=arr[to]; arr[to]=tmp;
    await fetch('/api/modifiers/reorder', { method:'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ ids: arr.map((x:any)=>x.id) }) });
    mutate();
  };
const { data, mutate }=useSWR('/api/modifiers', fetcher);
  const [f,setF]=useState<any>({ name:'', priceDelta:0, costDelta:0, stock:0, active:true });

  const save=async()=>{
    await fetch('/api/modifiers',{ method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(f)});
    setF({ name:'', priceDelta:0, costDelta:0, stock:0, active:true });
    mutate();
  };

  return <div className="space-y-4">
    <h1 className="text-2xl font-semibold">Modificadores</h1>
    <div className="card grid sm:grid-cols-5 gap-2">
      <input className="input" placeholder="Nombre" value={f.name} onChange={e=>setF({...f, name:e.target.value})}/>
      <input className="input" type="text" inputMode="decimal" placeholder="Precio extra" value={f.priceDelta} onChange={e=>setF({...f, priceDelta:Number(e.target.value)})}/>
      <input className="input" type="text" inputMode="decimal" placeholder="Costo extra" value={f.costDelta} onChange={e=>setF({...f, costDelta:Number(e.target.value)})}/>
      <input className="input" type="text" inputMode="decimal" placeholder="Stock" value={f.stock} onChange={e=>setF({...f, stock:Number(e.target.value)})}/>
      <button className="btn-primary" onClick={save}>Agregar</button>
    </div>
    <div className="grid gap-2">
      {(data||[]).map((m:any, idx:number)=>(<div key={m.id} className="card flex items-center justify-between">
        <div className="font-semibold">{m.name}</div>
        <div className="text-sm opacity-80">+${m.priceDelta?.toLocaleString('es-CO')} | stock {m.stock}</div>
      </div>))}
    </div>
  </div>;
}
