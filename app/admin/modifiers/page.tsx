
'use client';
import useSWR from 'swr';
import { useState } from 'react';
const fetcher=(u:string)=>fetch(u).then(r=>r.json());

export default function Modifiers(){
  const { data, mutate }=useSWR('/api/modifiers', fetcher);

  const move = async (index:number, dir:'up'|'down')=>{
    const arr = [ ...((data as any[])||[]) ];
    const to = dir==='up' ? index-1 : index+1;
    if (index<0 || to<0 || to>=arr.length) return;
    const t = arr[index]; arr[index] = arr[to]; arr[to] = t;
    try { (mutate as any)(arr, { revalidate: false }); } catch { (mutate as any)(); }
    try {
      await fetch('/api/modifiers/reorder', {
        method:'PUT',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ ids: arr.map((x:any)=>x.id) })
      });
    } finally {
      (mutate as any)();
    }
  };

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

  return <div className="space-y-4">
    <h1 className="text-2xl font-semibold">Modificadores</h1>
    <div className="card grid sm:grid-cols-5 gap-2">
      <input className="input" placeholder="Nombre" value={f.name} onChange={e=>setF({...f, name:e.target.value})}/>
      <input className="input" type="text" inputMode="decimal" placeholder="Δ Precio" value={f.priceDelta} onChange={e=>setF({...f, priceDelta:Number(e.target.value)})}/>
      <input className="input" type="text" inputMode="decimal" placeholder="Δ Costo" value={f.costDelta} onChange={e=>setF({...f, costDelta:Number(e.target.value)})}/>
      <input className="input" type="text" inputMode="decimal" placeholder="Stock" value={f.stock} onChange={e=>setF({...f, stock:Number(e.target.value)})}/>
      <button className="btn-primary" onClick={save}>Agregar</button>
    </div>

    <div className="grid gap-2">
      {(data||[]).map((m:any)=>(
        <div key={m.id} className="card flex items-center justify-between gap-2">
          {editingId===m.id ? (
            <div className="grid sm:grid-cols-5 gap-2 flex-1">
              <input className="input" value={edit.name||''} onChange={e=>setEdit({...edit, name:e.target.value})}/>
              <input className="input" type="text" inputMode="decimal" value={edit.priceDelta||0} onChange={e=>setEdit({...edit, priceDelta:Number(e.target.value)})}/>
              <input className="input" type="text" inputMode="decimal" value={edit.costDelta||0} onChange={e=>setEdit({...edit, costDelta:Number(e.target.value)})}/>
              <input className="input" type="text" inputMode="decimal" value={edit.stock||0} onChange={e=>setEdit({...edit, stock:Number(e.target.value)})}/>
              <div className="flex gap-2 items-center">
                <button className="btn-primary" onClick={saveEdit}>Guardar</button>
                <button className="btn" onClick={cancelEdit}>Cancelar</button>
              </div>
            </div>
          ) : (
            <>
              <div className="font-semibold">{m.name}</div>
              <div className="text-sm opacity-80">+${m.priceDelta?.toLocaleString('es-CO')} | stock {m.stock}</div>
              <div className="flex gap-2 items-center">
                <button className="btn" onClick={()=>startEdit(m)}>Editar</button>
                <button className="btn-danger" onClick={()=>remove(m.id)}>Eliminar</button>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  </div>;
}
