'use client';

import useSWR from 'swr';
import { useMemo, useState } from 'react';
import { buildWhatsAppUrl } from '@/lib/whatsapp';

const fetcher = (url: string) => fetch(url).then(r => r.json());

type Modifier = { id:number; name:string; priceDelta:number; costDelta:number; active:boolean };
type Product = { id:number; name:string; description?:string; price:number; imageUrl?:string; stock:number; modifiers:Modifier[] };
type Category = { id:number; name:string; products:Product[] };

type CartLine = { product: Product; qty:number; mods: Modifier[] };

export default function MenuPage(){
  const { data, error } = useSWR<Category[]>('/api/menu', fetcher);
  const [openCat, setOpenCat] = useState<number | null>(null);
  const [cart, setCart] = useState<CartLine[]>([]);
  const [modal, setModal] = useState<{product: Product | null, mods:Set<number>}>({product:null, mods:new Set()});

  const total = useMemo(() => {
    return cart.reduce((sum, l) => {
      const modSum = l.mods.reduce((m,id) => {
        const mm = l.product.modifiers.find(x => x.id === id); return m + (mm?.priceDelta || 0);
      }, 0);
      return sum + (l.product.price + modSum) * l.qty;
    }, 0);
  }, [cart]);

  if (error) return <div className="card">Error cargando menú</div>;
  if (!data) return <div className="card">Cargando...</div>;

  const addToCart = (p: Product, mods: number[] = []) => {
    setCart(prev => {
      const key = JSON.stringify({id:p.id, mods:[...mods].sort()});
      // try to find same combo
      const idx = prev.findIndex(l => JSON.stringify({id:l.product.id, mods:[...l.mods].sort()}) === key);
      if (idx >= 0){
        const copy = [...prev]; copy[idx] = {...copy[idx], qty: copy[idx].qty + 1}; return copy;
      }
      const modObjs = p.modifiers.filter(m => mods.includes(m.id));
      return [...prev, { product: p, qty: 1, mods: modObjs }];
    });
  };

  const openModifiers = (p: Product) => setModal({product:p, mods:new Set()});

  const sendWhatsApp = () => {
    let text = `🧾 *Pedido Arepas Burguer*\n\n`;
    cart.forEach(l => {
      const modTxt = l.mods.length ? ` + ${l.mods.map(m=>m.name).join(', ')}` : '';
      const unit = l.product.price + l.mods.reduce((s,m)=>s+m.priceDelta,0);
      text += `• ${l.qty} x ${l.product.name}${modTxt} — $${unit.toLocaleString()}\n`;
    });
    text += `\nTotal: *$${total.toLocaleString()}*`;
    const url = buildWhatsAppUrl(text);
    window.location.href = url;
  };

  return (
    <div>
      <div className="card">
        <input className="input" placeholder="🔎 Buscar producto..." onChange={(e)=>{
          const q = e.target.value.toLowerCase();
          const first = data.flatMap(c=>c.products).find(p => p.name.toLowerCase().includes(q));
          if (first) {
            const cat = data.find(c => c.products.some(pp=>pp.id===first.id));
            if (cat) setOpenCat(cat.id);
          }
        }}/>
      </div>

      {data.map(cat => (
        <div className="card mt-3" key={cat.id}>
          <div className="flex items-center justify-between" onClick={()=> setOpenCat(openCat === cat.id ? null : cat.id)} style={{cursor:'pointer'}}>
            <h2>{cat.name}</h2>
            <span className="badge">{openCat === cat.id ? 'Ocultar' : 'Ver'}</span>
          </div>
          {openCat === cat.id && (
            <div className="grid mt-3">
              {cat.products.map(p => (
                <div className="card" key={p.id}>
                  <div className="flex items-center gap-3">
                    <img src={p.imageUrl || '/logo.png'} width={56} height={56} alt={p.name} style={{borderRadius:12}} />
                    <div>
                      <div style={{fontWeight:700}}>{p.name}</div>
                      <div style={{opacity:.8, fontSize:13}}>{p.description}</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <div style={{fontWeight:700}}>${p.price.toLocaleString()}</div>
                    <div className="flex gap-2">
                      {p.modifiers.length > 0 && <button className="btn" onClick={()=>openModifiers(p)}>Elegir adicionales</button>}
                      <button className="btn" onClick={()=>addToCart(p)}>Agregar</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      <div className="card mt-4">
        <div className="flex items-center justify-between">
          <div>🛒 {cart.reduce((s,l)=>s+l.qty,0)} ítems</div>
          <div style={{fontWeight:700}}>${total.toLocaleString()}</div>
        </div>
        <button className="btn mt-3" disabled={cart.length===0} onClick={sendWhatsApp}>
          Enviar pedido ({cart.reduce((s,l)=>s+l.qty,0)}) — ${total.toLocaleString()}
        </button>
      </div>

      {/* Modal de modificadores simple */}
      {modal.product && (
        <div style={{position:'fixed', inset:0, background:'rgba(0,0,0,.7)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:50}} onClick={()=>setModal({product:null, mods:new Set()})}>
          <div className="card" style={{width:480, maxWidth:'95vw'}} onClick={(e)=>e.stopPropagation()}>
            <h3>Adicionales — {modal.product.name}</h3>
            <div className="mt-3" style={{maxHeight:300, overflow:'auto'}}>
              {modal.product.modifiers.map(m => (
                <label key={m.id} className="flex items-center justify-between mt-2">
                  <span className="flex items-center gap-2">{m.imageUrl ? <img src={m.imageUrl} width={28} height={28} style={{borderRadius:6}} alt={m.name}/> : null}{m.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="badge">+${m.priceDelta.toLocaleString()}</span>
                    <input type="checkbox" onChange={(e)=>{
                      const ns = new Set(modal.mods);
                      e.target.checked ? ns.add(m.id) : ns.delete(m.id);
                      setModal({product: modal.product, mods: ns});
                    }}/>
                  </div>
                </label>
              ))}
            </div>
            <button className="btn mt-3" onClick={()=>{
              addToCart(modal.product!, Array.from(modal.mods));
              setModal({product:null, mods:new Set()});
            }}>Agregar — ${(() => {
              const modsTotal = Array.from(modal.mods).reduce((s,id)=>{
                const m = modal.product!.modifiers.find(x=>x.id===id);
                return s + (m?.priceDelta || 0);
              }, 0);
              return (modal.product!.price + modsTotal).toLocaleString();
            })()}</button>
          </div>
        </div>
      )}
    </div>
  );
}
