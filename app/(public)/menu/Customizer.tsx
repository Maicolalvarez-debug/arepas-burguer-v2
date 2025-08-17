'use client';
import { useMemo, useState } from 'react';
import { fmtCOP } from '@/components/Number';

type Modifier = { id:number; name:string; priceDelta:number; costDelta:number; stock:number; active:boolean };
type Product = { id:number; name:string; description?:string; price:number; imageUrl?:string; modifiers: Modifier[] };

export default function Customizer({ product, onClose, onAdd }:{ product: Product; onClose:()=>void; onAdd:(payload:{ quantities: Record<number, number> })=>void }){
  const [q, setQ] = useState<Record<number, number>>({});
  const setQty = (id:number, val:number)=> setQ(prev=> ({...prev, [id]: Math.max(0, val)}));

  const extras = useMemo(()=> Object.entries(q).reduce((sum,[id,qty])=>{
    const m = product.modifiers.find(x=>x.id===Number(id));
    return sum + (m? m.priceDelta * (qty as any): 0);
  }, 0), [q, product.modifiers]);

  const total = product.price + extras;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={e=>e.stopPropagation()}>
        <div className="flex items-start justify-between gap-3 mb-2">
          <div>
            <div className="text-lg font-semibold">{product.name}</div>
            <div className="text-sm text-gray-400">{product.description || ''}</div>
          </div>
          <button className="btn" onClick={onClose}>✕</button>
        </div>
        {product.imageUrl ? <img src={product.imageUrl} alt={product.name} className="rounded-md w-full h-40 object-cover mb-3" /> : null}
        <div className="space-y-3 max-h-64 overflow-auto pr-1">
          {product.modifiers?.map(m=>(
            <div key={m.id} className="flex items-center justify-between">
              <div>
                <div className="font-medium">{m.name}</div>
                <div className="text-xs text-gray-400">+ {fmtCOP(m.priceDelta)}</div>
              </div>
              <div className="qty">
                <button onClick={()=>setQty(m.id, (q[m.id]||0)-1)}>-</button>
                <input type="number" value={q[m.id]||0} onChange={e=>setQty(m.id, Number(e.target.value))}/>
                <button onClick={()=>setQty(m.id, (q[m.id]||0)+1)}>+</button>
              </div>
            </div>
          ))}
          {!product.modifiers?.length && <div className="text-sm text-gray-400">Este producto no tiene adicionales.</div>}
        </div>
        <div className="flex items-center justify-between mt-4">
          <div className="text-lg font-semibold">Total: {fmtCOP(total)}</div>
          <button className="btn-primary" onClick={()=>onAdd({ quantities: q })}>Agregar</button>
        </div>
      </div>
    </div>
  );
}
