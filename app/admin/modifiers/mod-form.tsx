'use client';
import { useEffect, useState } from 'react'; import { useRouter } from 'next/navigation';
export default function ModForm({ id }:{ id?: number }){
  const router = useRouter();
  const [state, setState] = useState<any>({ name:'', priceDelta:0, costDelta:0, stock:0, active:true });
  useEffect(()=>{ if (!id) return; (async()=>{ const j = await fetch(`/api/modifiers/${id}`).then(r=>r.json()); setState(j); })(); },[id]);
  const save = async (e:React.FormEvent)=>{
    e.preventDefault();
    const method = id ? 'PUT' : 'POST'; const url = id ? `/api/modifiers/${id}` : '/api/modifiers';
    const res = await fetch(url, { method, headers: { 'Content-Type':'application/json' }, body: JSON.stringify(state) });
    if (res.ok) router.push('/admin/modifiers');
  };
  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-semibold mb-4">{id? 'Editar':'Nuevo'} adicional</h1>
      <form className="space-y-3" onSubmit={save}>
        <input className="input" placeholder="Nombre" value={state.name||''} onChange={e=>setState({...state, name:e.target.value})}/>
        <input className="input" type="number" placeholder="Δ Precio (COP)" value={state.priceDelta||0} onChange={e=>setState({...state, priceDelta:Number(e.target.value)})}/>
        <input className="input" type="number" placeholder="Δ Costo (COP)" value={state.costDelta||0} onChange={e=>setState({...state, costDelta:Number(e.target.value)})}/>
        <input className="input" type="number" placeholder="Stock" value={state.stock||0} onChange={e=>setState({...state, stock:Number(e.target.value)})}/>
        <label className="flex items-center gap-2"><input type="checkbox" checked={!!state.active} onChange={e=>setState({...state, active:e.target.checked})}/> Activo</label>
        <button className="btn-primary">Guardar</button>
      </form>
    </div>
  );
}
