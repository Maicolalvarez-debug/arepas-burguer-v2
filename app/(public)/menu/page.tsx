'use client';
import useSWR from 'swr';
import { useEffect, useMemo, useState } from 'react';
import Card from '@/components/Card';
import { fmtCOP } from '@/components/Number';
import Customizer from './Customizer';
const fetcher = (u:string)=>fetch(u).then(r=>r.json());
type Category={id:number; name:string}
type Modifier={id:number; name:string; priceDelta:number; costDelta:number; stock:number; active:boolean}
type Product={id:number; name:string; description?:string; price:number; cost:number; stock:number; active:boolean; categoryId:number|null; imageUrl?:string; modifiers: Modifier[]}
type CartItem = { product: Product; qty:number; chosen: { modifierId:number; name:string; priceDelta:number; qty:number }[] }

export default function MenuPage(){
  const { data, error } = useSWR('/api/menu', fetcher);
  const [mesa, setMesa] = useState<string>("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [active, setActive] = useState<Product|null>(null);

  useEffect(()=>{ const p = new URLSearchParams(window.location.search); setMesa(p.get('mesa')||''); },[]);

  const categories: Category[] = data?.categories || [];
  const products: Product[] = data?.products || [];

  const openCustomizer = (p: Product)=> setActive(p);
  const addFromCustomizer = ({ quantities }:{ quantities: Record<number, number> })=>{
    if (!active) return;
    const chosen = Object.entries(quantities).filter(([,qty])=> (qty as any) > 0).map(([id, qty])=>{
      const m = active.modifiers.find(x=> x.id === Number(id))!;
      return { modifierId: m.id, name: m.name, priceDelta: m.priceDelta, qty: Number(qty) };
    });
    const item: CartItem = { product: active, qty: 1, chosen };
    setCart(prev=> [...prev, item]);
    setActive(null);
  };

  const total = useMemo(()=> cart.reduce((sum, ci)=>{
    const mods = ci.chosen?.reduce((s,m)=> s + m.priceDelta * m.qty, 0) || 0;
    return sum + (ci.product.price + mods) * ci.qty;
  },0),[cart]);

  const message = useMemo(()=>{
    const lines = [];
    lines.push(`*AREPAS BURGUER*`);
    if (mesa) lines.push(`Mesa: ${mesa}`); lines.push(``);
    cart.forEach(ci=>{
      const mods = ci.chosen?.length ? ` (${ci.chosen.map(m=> m.qty>1? m.name+ ' x'+m.qty : m.name).join(', ')})` : '';
      lines.push(`• ${ci.qty} x ${ci.product.name}${mods} — ${fmtCOP((ci.product.price + (ci.chosen?.reduce((s,m)=> s + m.priceDelta*m.qty,0)||0)) * ci.qty)}`);
    });
    lines.push(``); lines.push(`Total: ${fmtCOP(total)}`); lines.push(``); lines.push(`Gracias!`);
    return encodeURIComponent(lines.join("\n"));
  },[cart, mesa, total]);

  const sendWhatsApp = async ()=>{
    await fetch('/api/orders', {
      method: 'POST', headers: { 'Content-Type':'application/json' },
      body: JSON.stringify({
        mesa,
        items: cart.map(ci=>({
          productId: ci.product.id,
          quantity: ci.qty,
          modifiers: ci.chosen.map(m=>({id:m.modifierId, name:m.name, priceDelta:m.priceDelta, quantity:m.qty}))
        }))
      })
    });
    const cfg = await fetch('/api/config').then(r=>r.json());
    const href = `https://wa.me/${cfg.whatsapp}?text=${message}`;
    window.location.href = href;
  };

  if (error) return <div>Error cargando menú</div>;
  if (!data) return <div>Cargando...</div>;

  return (
    <div className="grid md:grid-cols-[2fr,1fr] gap-6">
      <div>
        <h1 className="text-2xl font-semibold mb-4">Menú</h1>
        {categories.map(cat=>(
          <div key={cat.id} className="mb-6">
            <h2 className="text-xl font-semibold mb-2">{cat.name}</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.filter(p=>p.categoryId===cat.id && p.active).map(p=>(
                <Card key={p.id}>
                  <div className="flex flex-col gap-2">
                    {p.imageUrl ? <img src={p.imageUrl} alt={p.name} className="rounded-md w-full h-40 object-cover" /> : null}
                    <div className="font-semibold">{p.name}</div>
                    {p.description && <div className="text-sm text-gray-300">{p.description}</div>}
                    <div className="text-lg">{fmtCOP(p.price)}</div>
                    <button className="btn-primary" onClick={()=>openCustomizer(p)}>Agregar</button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div>
        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <div className="text-lg font-semibold">Carrito</div>
            <div className="text-sm text-gray-400">Mesa: {mesa || "-"}</div>
          </div>
          <div className="space-y-3">
            {cart.map((ci, idx)=>(
              <div key={idx} className="flex justify-between items-start">
                <div>
                  <div className="font-medium">{ci.qty} x {ci.product.name}</div>
                  {ci.chosen?.length>0 && (
                    <div className="text-xs text-gray-400">{ci.chosen.map(m=> (m.qty>1? m.name+' x'+m.qty : m.name)).join(", ")}</div>
                  )}
                </div>
                <div>{fmtCOP((ci.product.price + (ci.chosen?.reduce((s,m)=>s+m.priceDelta*m.qty,0)||0)) * ci.qty)}</div>
              </div>
            ))}
            <div className="flex justify-between border-t border-white/10 pt-3">
              <div className="font-semibold">Total</div>
              <div className="font-semibold">{fmtCOP(total)}</div>
            </div>
            <button disabled={!cart.length} className="btn-primary w-full disabled:opacity-50" onClick={sendWhatsApp}>
              Enviar por WhatsApp
            </button>
          </div>
        </div>
      </div>
      {active && <Customizer product={active} onClose={()=>setActive(null)} onAdd={addFromCustomizer} />}
    </div>
  );
}
