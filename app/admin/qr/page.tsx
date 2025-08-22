'use client';
import { useState } from 'react';
export default function Qr(){
  const [ids,setIds]=useState('T01,T02,T03');
  const gen=async()=>{
    const res=await fetch('/api/qr',{ method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ ids: ids.split(',').map(x=>x.trim()).filter(Boolean) })});
    const html=await res.text();
    const w=window.open('about:blank','_blank');
    if(w){ w.document.write(html); w.document.close(); }
  };
  return <div className="space-y-4">
    <h1 className="text-2xl font-semibold">Generador de QR</h1>
    <div className="card">
      <label className="label">IDs de mesa (separados por coma)</label>
      <input className="input" value={ids} onChange={e=>setIds(e.target.value)} />
      <button className="btn-primary mt-2" onClick={gen}>Generar</button>
    </div>
  </div>;
}
