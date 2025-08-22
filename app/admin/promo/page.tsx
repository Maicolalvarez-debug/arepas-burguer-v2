'use client';
import useSWR from 'swr';
import { useState } from 'react';
const fetcher=(u:string)=>fetch(u).then(r=>r.json());

export default function Promo(){
  const { data: current, mutate } = useSWR('/api/promo', fetcher);
  const [f,setF] = useState<any>({ title:'', description:'', price:0, cost:0, imageUrl:'', active:true, startDate:'', endDate:'' });

  const save = async()=>{
    if(!f.title) { alert('Título requerido'); return; }
    const res = await fetch('/api/promo', { method:'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify(f) });
    if(res.ok){ setF({ title:'', description:'', price:0, cost:0, imageUrl:'', active:true, startDate:'', endDate:'' }); mutate(); }
  };

  return <div className="space-y-4">
    <h1 className="text-2xl font-semibold">Promo del día</h1>
    <div className="card grid sm:grid-cols-2 gap-2">
      <div className="flex flex-col gap-1"><span className="text-xs text-white/70 font-medium">Título</span><input className="input" value={f.title} onChange={e=>setF({...f,title:e.target.value})}/></div>
      <div className="flex flex-col gap-1"><span className="text-xs text-white/70 font-medium">Precio</span><input className="input" type="text" inputMode="decimal" value={f.price} onChange={e=>setF({...f, price:Number(e.target.value)})}/></div>
      <div className="flex flex-col gap-1"><span className="text-xs text-white/70 font-medium">Costo</span><input className="input" type="text" inputMode="decimal" value={f.cost} onChange={e=>setF({...f, cost:Number(e.target.value)})}/></div>
      <div className="flex flex-col gap-1 sm:col-span-2"><span className="text-xs text-white/70 font-medium">Descripción</span><textarea className="input" value={f.description} onChange={e=>setF({...f,description:e.target.value})}/></div>
      <div className="flex flex-col gap-1"><span className="text-xs text-white/70 font-medium">Imagen (URL)</span><input className="input" value={f.imageUrl} onChange={e=>setF({...f,imageUrl:e.target.value})}/></div>
      <div className="flex items-end gap-2"><label className="flex items-center gap-2"><input type="checkbox" checked={!!f.active} onChange={e=>setF({...f, active: e.target.checked})}/> Activa</label></div>
      <div className="flex flex-col gap-1"><span className="text-xs text-white/70 font-medium">Desde</span><input className="input" type="date" value={f.startDate} onChange={e=>setF({...f,startDate:e.target.value})}/></div>
      <div className="flex flex-col gap-1"><span className="text-xs text-white/70 font-medium">Hasta</span><input className="input" type="date" value={f.endDate} onChange={e=>setF({...f,endDate:e.target.value})}/></div>
      <div className="flex items-end"><button className="btn-primary" onClick={save}>Guardar/Activar</button></div>
    </div>

    <div className="card">
      <div className="font-semibold mb-2">Promo activa</div>
      {!current && <div className="text-sm opacity-70">No hay promo activa.</div>}
      {current && <div className="flex items-center gap-3">
        <div className="grow">
          <div className="text-lg font-semibold">{current.title}</div>
          <div className="text-sm opacity-80">{current.description}</div>
          <div className="text-sm mt-1">Precio: ${'{'}current.price?.toLocaleString('es-CO'){'}'}</div>
          <div className="text-sm">Costo: ${'{'}current.cost?.toLocaleString('es-CO'){'}'}</div>
        </div>
        {current.imageUrl && <img src={current.imageUrl} alt="promo" className="w-28 h-20 object-cover rounded-lg" />}
      </div>}
    </div>
  </div>;
}