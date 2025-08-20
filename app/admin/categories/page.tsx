'use client';
import useSWR from 'swr';
import { useState } from 'react';
const fetcher=(u:string)=>fetch(u).then(r=>r.json());

export default function Categories(){
  
  const move = async(index:number, dir:'up'|'down')=>{
    const arr = [...(data||[])];
    const to = dir==='up' ? index-1 : index+1;
    if (to<0 || to>=arr.length) return;
    const tmp = arr[index]; arr[index]=arr[to]; arr[to]=tmp;
    await fetch('/api/categories/reorder', { method:'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ ids: arr.map((x:any)=>x.id) }) });
    mutate();
  };
const { data, mutate }=useSWR('/api/categories', fetcher);
  const [name,setName]=useState('');
  const add=async()=>{
    await fetch('/api/categories',{ method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ name }) });
    setName(''); mutate();
  };
  return <div className="space-y-4">
    <h1 className="text-2xl font-semibold">Categorías</h1>
    <div className="card flex gap-2">
      <input className="input" placeholder="Nombre de categoría" value={name} onChange={e=>setName(e.target.value)} />
      <button className="btn-primary" onClick={add}>Agregar</button>
    </div>
    <div className="grid gap-2">
      {(data||[]).map((c:any, idx:number)=>(<div key={c.id} className="card">{c.name}</div>))}
    </div>
  </div>;
}
