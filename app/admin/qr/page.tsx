'use client';
import { useState } from 'react';

export default function QRPage(){
  const [tables, setTables] = useState('1,2,3,4,5');
  const [result, setResult] = useState<any>(null);

  const generate = async () => {
    const res = await fetch('/api/qr', { method:'POST', body: JSON.stringify({ ids: tables.split(',').map(x=>x.trim()) }) });
    const data = await res.json();
    setResult(data);
  };

  return (
    <div className="card">
      <h1>Generar QRs por mesa</h1>
      <p>Escribe IDs de mesa separadas por coma. Ej: 1,2,3</p>
      <div className="mt-2"><input className="input" value={tables} onChange={(e)=>setTables(e.target.value)} /></div>
      <button className="btn mt-3" onClick={generate}>Generar</button>

      {result && (
        <div className="grid mt-3">
          {result.qrs.map((q:any)=> (
            <div key={q.id} className="card">
              <div><b>Mesa {q.id}</b></div>
              <img src={q.dataUrl} alt={`QR mesa ${q.id}`} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
