'use client';
import { useEffect, useState } from 'react';
export default function QRPage(){
  const [mesaIds, setMesaIds] = useState<string>("T01,T02,T03"); const [list, setList] = useState<string[]>([]);
  const generate = async ()=>{
    const ids = mesaIds.split(",").map(s=>s.trim()).filter(Boolean);
    const res = await fetch('/api/qr', { method: 'POST', headers: { 'Content-Type':'application/json' }, body: JSON.stringify({ ids }) });
    const j = await res.json(); setList(j.files||[]);
  };
  useEffect(()=>{ generate(); },[]);
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">QR por mesa</h1>
      <div className="card flex gap-2">
        <input className="input" value={mesaIds} onChange={e=>setMesaIds(e.target.value)} placeholder="IDs separados por coma, ej: T01,T02" />
        <button className="btn" onClick={generate}>Generar</button>
      </div>
      <div className="grid sm:grid-cols-3 gap-4">
        {list.map((src, i)=>(
          <div key={i} className="card">
            <img src={src} alt="QR" className="w-full h-auto" />
            <a className="btn mt-2" href={src} download>Descargar PNG</a>
          </div>
        ))}
      </div>
    </div>
  );
}
