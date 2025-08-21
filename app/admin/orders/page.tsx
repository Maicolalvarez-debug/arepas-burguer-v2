
'use client';
import useSWR from 'swr';
import Link from 'next/link';

type OrderItem = { id:number; productName:string; quantity:number; modifiers: { modifierName: string; quantity:number }[] };
type Order = { id:number; tableCode:string|null; status:string; gross:number; discount:number; net:number; createdAt:string; items?: OrderItem[] };

const fetcher = (url:string)=> fetch(url).then(r=>r.json());

export default function OrdersPage(){
  const { data, mutate, isLoading, error } = useSWR<Order[]>(`/api/orders?status=pending&include=items`, fetcher, { refreshInterval: 4000 });
  const list = Array.isArray(data) ? data : [];

  const updateStatus = async (id:number, status:'preparing'|'cancelled')=>{
    await fetch(`/api/orders/${id}`, { method:'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ status }) });
    mutate();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Órdenes</h1>
        <Link className="btn" href="/admin">Volver</Link>
      </div>
      {error && <div className="text-red-400 text-sm">Error cargando órdenes</div>}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <section className="card">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-semibold">En preparación</h2>
            <span className="badge">{list.length}</span>
          </div>
          <div className="space-y-2">
            {list.map(o=>(
              <div key={o.id} className="border rounded-xl p-3 bg-white/5">
                <div className="flex items-center justify-between">
                  <div className="font-medium">ID: {o.id} {o.tableCode ? `• Mesa ${o.tableCode}`:''}</div>
                  <div className="text-xs opacity-70">{new Date(o.createdAt).toLocaleTimeString()}</div>
                </div>
                <ul className="mt-2 text-sm space-y-1">
                  {o.items?.map(it=>(
                    <li key={it.id} className="flex justify-between">
                      <span>{it.quantity}x {it.productName}</span>
                      <span className="opacity-70">
                        {it.modifiers?.length ? it.modifiers.map(m=>`${m.quantity} ${m.modifierName}`).join(', ') : null}
                      </span>
                    </li>
                  ))}
                </ul>
                <div className="mt-3 flex gap-2">
                  <button onClick={()=>updateStatus(o.id,'preparing')} className="btn">Aceptar</button>
                  <button onClick={()=>updateStatus(o.id,'cancelled')} className="btn-secondary">Cancelar</button>
                </div>
              </div>
            ))}
            {!list.length && <div className="text-sm opacity-70">No hay órdenes pendientes.</div>}
          </div>
        </section>
        <section className="card">
          <h2 className="font-semibold mb-2">Por entregar</h2>
          <div className="opacity-70 text-sm">Esta columna se llenará cuando una orden pase a "ready".</div>
        </section>
      </div>
    </div>
  );
}
