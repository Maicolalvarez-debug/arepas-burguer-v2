'use client';
import { useState } from 'react';
export default function SetupPage(){
  const [log,setLog]=useState('');
  const call=async(path:string,label:string)=>{
    setLog(prev=>prev+`\n→ ${label}...`);
    const r=await fetch(path,{ method:'POST' });
    if(r.ok) setLog(prev=>prev+`\n✔ ${label} OK`);
    else { const j=await r.json().catch(()=>({error:'Error'})); setLog(prev=>prev+`\n✖ ${label}: ${j.error}`); }
  };
  return (
    <div className="max-w-xl space-y-4">
      <h1 className="text-2xl font-semibold">Configuración inicial</h1>
      <p className="text-gray-300">Ahora el menú demo se carga **automáticamente** en cada deploy. Aquí puedes *re-enlazar* los adicionales a todos los productos si lo necesitas.</p>
      <div className="card space-y-2">
        <button className="btn w-full" onClick={()=>call('/api/setup/link','Enlazar adicionales')}>Enlazar adicionales</button>
      </div>
      <pre className="card whitespace-pre-wrap text-sm">{log || 'Sin acciones aún.'}</pre>
    </div>
  );
}
