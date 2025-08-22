export const revalidate = 0;
'use client';
import useSWR from 'swr';
import { useEffect } from 'react';
import { useParams } from 'next/navigation';
const fetcher=(u:string)=>fetch(u).then(r=>r.json());
const pesos=(n:number)=>'$'+(n||0).toLocaleString('es-CO');

export default function PrintReceipt(){
  const params = useParams();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const { data } = useSWR(id ? `/api/orders/${id}` : null, fetcher);

  useEffect(()=>{
    if (data) setTimeout(()=>window.print(), 200);
  },[data]);

  if(!data) return <div className="p-6">Cargando…</div>;

  return <div className="p-6 print:p-0 font-mono text-sm">
    <div className="mb-2 text-center">
      <div className="text-lg font-semibold">Comanda #{data.id}</div>
      <div>{new Date(data.createdAt).toLocaleString('es-CO')}</div>
      <div>Mesa: {data.tableCode || 'N/A'}</div>
    </div>
    <div className="border-t border-white/20 my-2"></div>
    <div className="space-y-2">
      {data.items.map((it:any)=>(
        <div key={it.id}>
          <div className="flex justify-between"><div>{it.quantity}x {it.productName}</div><div>{pesos(it.subtotal)}</div></div>
          {it.modifiers?.length>0 && <div className="pl-4 opacity-80">
            {it.modifiers.map((m:any)=>(<div key={m.id}>- {m.quantity}x {m.modifierName}</div>))}
          </div>}
        </div>
      ))}
    </div>
    <div className="border-t border-white/20 my-2"></div>
    <div className="flex justify-between"><div>Subtotal</div><div>{pesos(data.gross)}</div></div>
    {data.discount>0 && <div className="flex justify-between"><div>Descuento</div><div>-{pesos(data.discount)}</div></div>}
    <div className="flex justify-between font-semibold"><div>Total</div><div>{pesos(data.net)}</div></div>
  </div>;
}
