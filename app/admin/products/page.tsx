'use client'

import useSWR from 'swr'
import { useMemo, useState } from 'react'

const fetcher = (u:string)=>fetch(u).then(r=>r.json())
const pesos = (n:number)=>'$'+(n||0).toLocaleString('es-CO')

type Status = 'active'|'archived'|'all'

export default function AdminProducts() {
  const [status, setStatus] = useState<Status>('active')
  const [q, setQ] = useState('')

  const url = useMemo(()=>{
    const p = new URLSearchParams()
    p.set('status', status)
    if (q.trim()) p.set('q', q.trim())
    return `/api/products?${p.toString()}`
  }, [status, q])

  const { data, isLoading, mutate } = useSWR(url, fetcher)

  async function archive(id:number){
    if (!confirm('¿Archivar este producto?')) return
    const res = await fetch(`/api/products/${id}`, { method:'DELETE' })
    if (!res.ok) alert('No se pudo archivar')
    mutate()
  }
  async function restore(id:number){
    const res = await fetch(`/api/products/${id}`, { method:'PATCH', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ isActive: true }) })
    if (!res.ok) alert('No se pudo restaurar')
    mutate()
  }
  async function quickEditPrice(id:number, current:number){
    const str = prompt('Nuevo precio', String(current||0))
    if (str===null) return
    const price = Number(str)||0
    const res = await fetch(`/api/products/${id}`, { method:'PATCH', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ price }) })
    if (!res.ok) alert('No se pudo actualizar precio')
    mutate()
  }
  async function quickEditCost(id:number, current:number){
    const str = prompt('Nuevo costo', String(current||0))
    if (str===null) return
    const cost = Number(str)||0
    const res = await fetch(`/api/products/${id}`, { method:'PATCH', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ cost }) })
    if (!res.ok) alert('No se pudo actualizar costo')
    mutate()
  }

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-semibold">Productos</h1>

      <div className="flex gap-2 items-center">
        <button onClick={()=>setStatus('active')} className={`px-3 py-1 rounded border ${status==='active'?'bg-black text-white':''}`}>Activos</button>
        <button onClick={()=>setStatus('archived')} className={`px-3 py-1 rounded border ${status==='archived'?'bg-black text-white':''}`}>Archivados</button>
        <button onClick={()=>setStatus('all')} className={`px-3 py-1 rounded border ${status==='all'?'bg-black text-white':''}`}>Todos</button>
        <input className="ml-4 border rounded px-3 py-1 bg-gray-800 border-gray-700 text-white placeholder-gray-400" placeholder="Buscar..." value={q} onChange={e=>setQ(e.target.value)} />
      </div>

      {isLoading && <div>Cargando…</div>}
      {!isLoading && (
        <div className="overflow-auto">
          <table className="min-w-[800px] w-full border">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left p-2 border">ID</th>
                <th className="text-left p-2 border">Nombre</th>
                <th className="text-left p-2 border">Categoría</th>
                <th className="text-right p-2 border">Precio</th>
                <th className="text-right p-2 border">Costo</th>
                <th className="text-center p-2 border">Estado</th>
                <th className="text-center p-2 border">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {(data||[]).map((p:any)=>(
                <tr key={p.id} className="border-t">
                  <td className="p-2 border border-gray-700 text-white">{p.id}</td>
                  <td className="p-2 border border-gray-700 text-white">{p.name}</td>
                  <td className="p-2 border border-gray-700 text-white">{p.categoryId}</td>
                  <td className="p-2 border border-gray-700 text-white text-right">{pesos(p.price)}</td>
                  <td className="p-2 border border-gray-700 text-white text-right">{pesos(p.cost)}</td>
                  <td className="p-2 border border-gray-700 text-white text-center">{p.isActive ? 'Activo' : 'Archivado'}</td>
                  <td className="p-2 border border-gray-700 text-white text-center">
                    <div className="flex gap-2 justify-center">
                      <button className="border border-gray-700 text-white rounded px-2 py-1" onClick={()=>quickEditPrice(p.id, p.price)}>Precio</button>
                      <button className="border border-gray-700 text-white rounded px-2 py-1" onClick={()=>quickEditCost(p.id, p.cost)}>Costo</button>
                      {p.isActive
                        ? <button className="border border-gray-700 text-white rounded px-2 py-1" onClick={()=>archive(p.id)}>Archivar</button>
                        : <button className="border border-gray-700 text-white rounded px-2 py-1 bg-black text-white" onClick={()=>restore(p.id)}>Restaurar</button>
                      }
                    </div>
                  </td>
                </tr>
              ))}
              {!(data||[]).length && (
                <tr><td className="p-3 text-center opacity-60" colSpan={7}>Sin resultados.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
