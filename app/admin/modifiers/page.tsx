'use client';
import useSWR from 'swr';
import { useState } from 'react';
const fetcher=(u:string)=>fetch(u).then(r=>r.json());

export default function Modifiers(){
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
      <input className="input" type="number" placeholder="Precio extra" value={f.priceDelta} onChange={e=>setF({...f, priceDelta:Number(e.target.value)})}/>
      <input className="input" type="number" placeholder="Costo extra" value={f.costDelta} onChange={e=>setF({...f, costDelta:Number(e.target.value)})}/>
      <input className="input" type="number" placeholder="Stock" value={f.stock} onChange={e=>setF({...f, stock:Number(e.target.value)})}/>
      <button className="btn-primary" onClick={save}>Agregar</button>
    </div>
    <div className="grid gap-2">
      {(data||[]).map((m:any)=>(<div key={m.id} className="card flex items-center justify-between">
        <div className="font-semibold">{m.name}</div>
        <div className="text-sm opacity-80">+${m.priceDelta?.toLocaleString('es-CO')} | stock {m.stock}</div>
      </div>))}
    </div>
  </div>;
}
