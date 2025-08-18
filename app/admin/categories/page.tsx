'use client';
import useSWR from 'swr';
import { useState } from 'react';
const fetcher=(u:string)=>fetch(u).then(r=>r.json());

export default function Categories(){
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
      {(data||[]).map((c:any)=>(<div key={c.id} className="card">{c.name}</div>))}
    </div>
  </div>;
}
