
'use client';
import useSWR from 'swr';
import { useState } from 'react';


  const move = async (index:number, dir:'up'|'down')=>{
    const arr = [ ...((data as any[])||[]) ];
    const to = dir==='up' ? index-1 : index+1;
    if (index<0 || to<0 || to>=arr.length) return;
    const t = arr[index]; arr[index] = arr[to]; arr[to] = t;
    // Optimistic
    try { (mutate as any)(arr, { revalidate: false }); } catch { (mutate as any)(); }
    try {
      await fetch('/api/categories/reorder', {
        method:'PUT',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ ids: arr.map((x:any)=>x.id) })
      });
    } finally {
      (mutate as any)();
    }
  };
const fetcher=(u:string)=>fetch(u).then(r=>r.json());

export default function Categories(){
  const { data, mutate }=useSWR('/api/categories', fetcher);
  const [name,setName]=useState('');
  const [editingId,setEditingId]=useState<number|null>(null);
  const [editName,setEditName]=useState('');

  const add=async()=>{
    await fetch('/api/categories',{ method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ name }) });
    setName(''); mutate();
  };
  const startEdit=(c:any)=>{ setEditingId(c.id); setEditName(c.name); };
  const cancelEdit=()=>{ setEditingId(null); setEditName(''); };
  const saveEdit=async()=>{
    if(!editingId) return;
    await fetch(`/api/categories/${editingId}`, { method:'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ name: editName }) });
    setEditingId(null); setEditName(''); mutate();
  };
  const remove=async(id:number)=>{
    if(!confirm('¿Eliminar esta categoría?')) return;
    const res = await fetch(`/api/categories/${id}`, { method:'DELETE' });
    if(!res.ok){
      const j=await res.json().catch(()=>({}));
      alert(j?.error || 'No se pudo eliminar');
    }
    mutate();
  };

  return <div className="space-y-4">
    <h1 className="text-2xl font-semibold">Categorías</h1>
    <div className="card flex gap-2">
      <input className="input" placeholder="Nombre de categoría" value={name} onChange={e=>setName(e.target.value)} />
      <button className="btn-primary" onClick={add}>Agregar</button>
    </div>
    <div className="grid gap-2">
      {(data||[]).map((c:any)=>(
        <div key={c.id} className="card flex items-center justify-between gap-2">
          {editingId===c.id ? (
            <div className="flex-1 flex gap-2">
              <input className="input w-full" value={editName} onChange={e=>setEditName(e.target.value)} />
              <button className="btn-primary" onClick={saveEdit}>Guardar</button>
              <button className="btn" onClick={cancelEdit}>Cancelar</button>
            </div>
          ) : (
            <>
              <div className="font-semibold">{c.name}</div>
              <div className="flex gap-2 items-center">
                <button className="btn" onClick={()=>move((data||[]).findIndex((x:any)=>x.id===c.id),'up')}>↑</button>
                <button className="btn" onClick={()=>move((data||[]).findIndex((x:any)=>x.id===c.id),'down')}>↓</button>
                <button className="btn" onClick={()=>startEdit(c)}>Editar</button>
                <button className="btn-danger" onClick={()=>remove(c.id)}>Eliminar</button>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  </div>;
}
