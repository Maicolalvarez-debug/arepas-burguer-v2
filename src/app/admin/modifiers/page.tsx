'use client';
import useSWR from 'swr';
import { useState } from 'react';
const fetcher=(u:string)=>fetch(u).then(r=>r.json());

export default function Modifiers(){
  const { data, mutate }=useSWR('/api/modifiers', fetcher);
  const [f,setF]=useState<any>({ name:'', priceDelta:0, costDelta:0, stock:0, active:true });
  const [editingId,setEditingId]=useState<number|null>(null);
  const [edit,setEdit]=useState<any>({});

  const save=async()=>{
    await fetch('/api/modifiers',{ method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(f)});
    setF({ name:'', priceDelta:0, costDelta:0, stock:0, active:true });
    mutate();
  };

  const startEdit=(m:any)=>{ setEditingId(m.id); setEdit({ ...m }); };
  const cancelEdit=()=>{ setEditingId(null); setEdit({}); };
  const saveEdit=async()=>{
    if(!editingId) return;
    await fetch(`/api/modifiers/${editingId}`, { method:'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify(edit) });
    setEditingId(null); setEdit({}); mutate();
  };
  const remove=async(id:number)=>{
    if(!confirm('¿Eliminar este modificador?')) return;
    const res = await fetch(`/api/modifiers/${id}`, { method:'DELETE' });
    if(!res.ok){
      const j=await res.json().catch(()=>({}));
      alert(j?.error || 'No se pudo eliminar');
    }
    mutate();
  };

  const move = async (index:number, dir:'up'|'down') => {
    const arr = [...(data||[])];
    const to = dir==='up' ? index-1 : index+1;
    if (to<0 || to>=arr.length) return;
    const tmp = arr[index]; arr[index]=arr[to]; arr[to]=tmp;
    mutate();
    await fetch('/api/modifiers/reorder', { method:'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ ids: arr.map((x:any)=>x.id) }) });
    mutate();
  };

  return <div className="space-y-4">
    <h1 className="text-2xl font-semibold">Modificadores</h1>
    <div className="card grid sm:grid-cols-5 gap-3">
      <div className="flex flex-col gap-1">
        <span className="text-xs text-white/70 font-medium">Nombre</span>
        <input className="input" placeholder="Nombre" value={f.name} onChange={e=>setF({...f, name:e.target.value})}/>
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-xs text-white/70 font-medium">Precio</span>
        <input className="input" type="text" inputMode="decimal" placeholder="Precio" value={f.priceDelta} onChange={e=>setF({...f, priceDelta:Number(e.target.value)})}/>
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-xs text-white/70 font-medium">Costo</span>
        <input className="input" type="text" inputMode="decimal" placeholder="Costo" value={f.costDelta} onChange={e=>setF({...f, costDelta:Number(e.target.value)})}/>
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-xs text-white/70 font-medium">Stock</span>
        <input className="input" type="text" inputMode="decimal" placeholder="Stock" value={f.stock} onChange={e=>setF({...f, stock:Number(e.target.value)})}/>
      </div>
      <div className="flex items-end">
        <button className="btn-primary" onClick={save}>Agregar</button>
      </div>
    </div>

    <div className="grid gap-2">
      {(data||[]).map((m:any, idx:number)=>(
        <div key={m.id} className="card flex items-center justify-between gap-2">
          {editingId===m.id ? (
            <div className="grid sm:grid-cols-5 gap-3 flex-1">
              <div className="flex flex-col gap-1">
                <span className="text-xs text-white/70 font-medium">Nombre</span>
                <input className="input" value={edit.name||''} onChange={e=>setEdit({...edit, name:e.target.value})}/>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs text-white/70 font-medium">Precio</span>
                <input className="input" type="text" inputMode="decimal" value={edit.priceDelta||0} onChange={e=>setEdit({...edit, priceDelta:Number(e.target.value)})}/>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs text-white/70 font-medium">Costo</span>
                <input className="input" type="text" inputMode="decimal" value={edit.costDelta||0} onChange={e=>setEdit({...edit, costDelta:Number(e.target.value)})}/>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs text-white/70 font-medium">Stock</span>
                <input className="input" type="text" inputMode="decimal" value={edit.stock||0} onChange={e=>setEdit({...edit, stock:Number(e.target.value)})}/>
              </div>
              <div className="flex gap-2 items-end">
                <button className="btn-primary" onClick={saveEdit}>Guardar</button>
                <button className="btn" onClick={cancelEdit}>Cancelar</button>
              </div>
            </div>
          ) : (
            <>
              <div className="font-semibold">{m.name}</div>
              <div className="text-sm opacity-80">+${m.priceDelta?.toLocaleString('es-CO')} | stock {m.stock}</div>
              <div className="flex gap-2 items-center">
                <button className="btn" onClick={()=>move(idx,'up')}>↑</button>
                <button className="btn" onClick={()=>move(idx,'down')}>↓</button>
                <button className="btn" onClick={()=>{ setEdit(m); setEditingId(m.id); }}>Editar</button>
                <button className="btn-danger" onClick={()=>remove(m.id)}>Eliminar</button>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  </div>;
}
