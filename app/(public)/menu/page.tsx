'use client';
import useSWR from 'swr';
import { useState } from 'react';

const fetcher = (u:string)=>fetch(u).then(r=>r.json());

export default function MenuPage(){
  const { data } = useSWR('/api/menu', fetcher);
  const [open, setOpen] = useState<{[k:number]:boolean}>({});
  const [lang, setLang] = useState(typeof window !== 'undefined' ? (localStorage.getItem('lang') || 'es') : 'es');
  const t = (es:string, en:string)=> lang==='es'? es : en;

  const toggle = (id:number)=> setOpen(prev=>({ ...prev, [id]: !prev[id] }));
  if (!data) return <div className="card">Cargando...</div>;

  const cats = data.categories || [];
  const catProducts = data.productsByCategory || {};

  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <h1>{t('Menú','Menu')}</h1>
        <div className="flex items-center gap-2">
          <button className="btn" onClick={()=>{ const n = lang==='es'?'en':'es'; setLang(n); localStorage.setItem('lang', n); }}>{lang==='es'?'EN':'ES'}</button>
        </div>
      </div>
      {cats.map((c:any)=>(
        <div key={c.id} className="mt-3">
          <button className="btn" onClick={()=>toggle(c.id)}>{open[c.id]? '−' : '+'} {c.name}</button>
          {open[c.id] && (
            <div className="mt-2" style={{display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))', gap:12}}>
              {(catProducts[c.id]||[]).map((p:any)=>(
                <div key={p.id} className="card">
                  <img src={p.imageUrl || '/placeholder.png'} alt="" style={{width:'100%', height:140, objectFit:'cover', borderRadius:8}}/>
                  <div className="mt-2" style={{fontWeight:600}}>{p.name}</div>
                  <div className="text-sm opacity-80">${p.price}</div>
                  <a className="btn mt-2" href={`/menu/product/${p.id}`}>{t('Ver','View')}</a>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
