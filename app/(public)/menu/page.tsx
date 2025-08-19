'use client';
import useSWR from 'swr';
import { useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';

const fetcher=(u:string)=>fetch(u).then(r=>r.json());

type CartItem = {
  productId: number;
  name: string;
  qty: number;
  basePrice: number;
  modifiers: { id:number; name:string; qty:number; priceDelta:number }[];
};

export default function Menu(){
  const search = useSearchParams();
  const table = (search.get('table')||'').trim();
  const { data: cats }=useSWR('/api/categories', fetcher);
  const { data: items }=useSWR('/api/products', fetcher);
  const [open,setOpen]=useState<Record<number,boolean>>({});
  const [cart,setCart]=useState<CartItem[]>([]);

  const [showModal,setShowModal]=useState(false);
  const [loading,setLoading]=useState(false);
  const [selected,setSelected]=useState<any|null>(null);
  const [qty,setQty]=useState(1);
  const [modsState,setModsState]=useState<Record<number, number>>({}); // modifierId -> qty

  const grouped = useMemo(()=>{
    const g:Record<number, any[]> = {};
    (items||[]).forEach((p:any)=>{ g[p.categoryId] ??= []; g[p.categoryId].push(p) });
    return g;
  },[items]);

  const toggle=(id:number)=> setOpen(o=>({...o, [id]: !o[id]}));

  const openProduct=(p:any)=>{
    setShowModal(true);
    setLoading(true);
    setQty(1);
    setModsState({});
    fetch(`/api/products/${p.id}`).then(r=>r.json()).then(full=>{
      setSelected(full);
    }).finally(()=> setLoading(false));
  };

  const currentModalTotal = () => {
    if(!selected) return 0;
    const base = selected.price || 0;
    const modsSum = (selected.modifiers||[]).map((mw:any)=> mw.modifier || mw).reduce((s:number,m:any)=> s + (modsState[m.id]||0)*(m.priceDelta||0), 0);
    return qty * (base + modsSum);
  };

  const addFromModal=()=>{
    if(!selected) return;
    const chosen = (selected.modifiers||[])
      .map((mwrap:any)=> mwrap.modifier || mwrap)
      .map((m:any)=>{
        const q = modsState[m.id]||0;
        return q>0 ? { id:m.id, name:m.name, qty:q, priceDelta:m.priceDelta||0 } : null;
      }).filter(Boolean) as {id:number; name:string; qty:number; priceDelta:number}[];

    const item: CartItem = {
      productId: selected.id,
      name: selected.name,
      qty,
      basePrice: selected.price||0,
      modifiers: chosen
    };
    setCart(c=>[...c, item]);
    setShowModal(false);
    setSelected(null);
  };

  const addQuick=(p:any)=> openProduct(p);

  const calculateItemTotal = (ci: CartItem) => {
    const modsTotal = ci.modifiers.reduce((s,m)=> s + m.qty * (m.priceDelta||0), 0);
    return ci.qty * (ci.basePrice + modsTotal);
  };
  const totalCart = () => cart.reduce((s,i)=> s + calculateItemTotal(i), 0);

  const sendWhatsApp=()=>{
    const phone = process.env.NEXT_PUBLIC_WHATSAPP || '3118651391';
    const lines = cart.flatMap(i=>{
      const head = `• ${i.qty} x ${i.name} - $${(i.basePrice).toLocaleString('es-CO')}`;
      const mods = i.modifiers.map(m=>`    - ${m.qty} x ${m.name} (+$${m.priceDelta.toLocaleString('es-CO')})`);
      return [head, ...mods];
    });
    const total = totalCart();
    const title = `Pedido Arepas Burguer${table?` - Mesa ${table}`:''}`;
    const msg = encodeURIComponent(`${title}:\n${lines.join('\n')}\nTotal: $${total.toLocaleString('es-CO')}`);
    const url = `https://wa.me/${phone}?text=${msg}`;
    window.location.href = url;
  };

  const ModRow = ({m}:{m:any})=>{
    const q = modsState[m.id]||0;
    const inc=()=> setModsState(s=>({ ...s, [m.id]: (s[m.id]||0) + 1 }));
    const dec=()=> setModsState(s=>({ ...s, [m.id]: Math.max(0, (s[m.id]||0) - 1) }));
    return (
      <div className="flex items-center justify-between sticky top-0 z-40 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 py-2 border-b">
        <div className="text-sm">
          <div className="font-medium">{m.name}</div>
          {m.priceDelta ? <div className="text-xs opacity-70">+${m.priceDelta.toLocaleString('es-CO')}</div> : <div className="text-xs opacity-50">sin costo</div>}
        </div>
        <div className="flex items-center gap-2">
          <button type="button" className="btn" onClick={dec}>-</button>
          <div className="w-8 text-center">{q}</div>
          <button type="button" className="btn" onClick={inc}>+</button>
        </div>
      </div>
    );
  };

  return <div className="space-y-4 pb-24">
    <div className="flex items-center justify-between sticky top-0 z-40 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 py-2 border-b">
      <h1 className="text-2xl font-semibold">Menú</h1>{table && <div className="mb-2 text-sm opacity-80">Pedido para <span className="font-semibold">Mesa {table}</span></div>}
      <button className="hidden md:inline-flex btn-primary" onClick={sendWhatsApp}>
        {`Enviar pedido (${cart.length}) — $${totalCart().toLocaleString('es-CO')}`}
      </button>
    </div>

    <div className="space-y-2">
      {(cats||[]).map((c:any)=>(
        <div key={c.id} className="card">
          <button className="w-full text-left flex items-center justify-between" onClick={()=>toggle(c.id)}>
            <span className="font-semibold">{c.name}</span>
            <span className="text-sm opacity-70">{open[c.id] ? 'Ocultar' : 'Ver'}</span>
          </button>
          {open[c.id] && (
            <div className="grid-menu mt-3">
              {(grouped[c.id]||[]).map((p:any)=>(
                <div key={p.id} className="card">
                  {p.imageUrl && <img src={p.imageUrl} className="product-img" />}
                  <div className="mt-2 font-semibold">{p.name}</div>
                  <div className="text-sm opacity-80">{p.description}</div>
                  <div className="mt-2 font-bold">${(p.price||0).toLocaleString('es-CO')}</div>
                  <button className="btn-primary mt-2" onClick={()=>addQuick(p)}>Agregar</button>
                </div>
              ))}
              {!grouped[c.id]?.length && <div className="text-sm opacity-70">Sin productos aún.</div>}
            </div>
          )}
        </div>
      ))}
    </div>

    {showModal && (
      <div className="modal-backdrop" onClick={()=>setShowModal(false)}>
        <div className="modal-card" onClick={(e)=>e.stopPropagation()}>
          {loading && <div>Cargando...</div>}
          {!loading && selected && (
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                {selected.imageUrl && <img src={selected.imageUrl} className="w-24 h-20 object-cover rounded-md" />}
                <div>
                  <div className="text-lg font-semibold">{selected.name}</div>
                  {selected.description && <div className="text-sm opacity-80">{selected.description}</div>}
                  <div className="font-bold mt-1">${selected.price?.toLocaleString('es-CO')}</div>
                </div>
              </div>

              <div>
                <div className="label">Cantidad</div>
                <div className="flex items-center gap-2">
                  <button className="btn" onClick={()=>setQty(Math.max(1, qty-1))}>-</button>
                  <div className="w-10 text-center">{qty}</div>
                  <button className="btn" onClick={()=>setQty(qty+1)}>+</button>
                </div>
              </div>

              <div className="space-y-2">
                <div className="font-semibold">Adicionales</div>
                <div className="grid gap-2">
                  {(selected.modifiers||[]).map((mw:any)=>{
                    const m = mw.modifier || mw;
                    return <div key={m.id} className="card"><ModRow m={m} /></div>
                  })}
                  {!(selected.modifiers||[]).length && <div className="text-sm opacity-70">No hay adicionales disponibles.</div>}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2">
                <button className="btn" onClick={()=>setShowModal(false)}>Cancelar</button>
                <button className="btn-primary" onClick={addFromModal}>
                  {`Agregar — $${currentModalTotal().toLocaleString('es-CO')}`}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    )}

    {/* Mobile bottom sticky cart bar */}
    {cart.length > 0 && (
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 border-t">
        <div className="max-w-screen-lg mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <div className="text-sm">
            {table ? (
              <div className="opacity-80">Mesa <span className="font-semibold">{table}</span></div>
            ) : (
              <div className="opacity-80">Tu pedido</div>
            )}
            <div className="font-semibold">{cart.length} {cart.length === 1 ? 'producto' : 'productos'} — ${totalCart().toLocaleString('es-CO')}</div>
          </div>
          <button className="btn-primary" onClick={sendWhatsApp}>
            Enviar
          </button>
        </div>
      </div>
    )}

  </div>;
}
