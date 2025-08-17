'use client';
import { useState } from 'react';

export default function QrPage(){
  const [text, setText] = useState('T01,T02,T03');
  const [svg, setSvg] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const gen = async (e: React.FormEvent)=>{
    e.preventDefault();
    setLoading(true); setSvg('');
    const ids = text.split(',').map(s=>s.trim()).filter(Boolean);
    const res = await fetch('/api/qr', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ ids }) });
    if(res.ok){
      const xml = await res.text();
      setSvg(xml);
    }else{
      const j = await res.json().catch(()=>({error:'Error'}));
      alert('Error generando QR: ' + j.error);
    }
    setLoading(false);
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">QR por mesa</h1>
      <form onSubmit={gen} className="flex gap-2">
        <input className="input flex-1" value={text} onChange={e=>setText(e.target.value)} placeholder="T01,T02,T03" />
        <button className="btn-primary">{loading? 'Generando…' : 'Generar'}</button>
      </form>
      <div className="card">
        {svg ? <div dangerouslySetInnerHTML={{ __html: svg }} /> : <div className="text-sm text-gray-400">Aquí verás los QR. Imprime esta página o guarda la imagen.</div>}
      </div>
    </div>
  );
}
