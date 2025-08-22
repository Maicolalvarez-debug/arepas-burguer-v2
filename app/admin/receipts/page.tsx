'use client'
import useSWR from 'swr'
import Link from 'next/link'
import { useMemo, useState } from 'react'

const fetcher = (u:string)=>fetch(u).then(r=>r.json())
const pesos = (n:number)=>'$'+(n||0).toLocaleString('es-CO')
const fmt = (d:Date)=>d.toISOString().slice(0,10)

export default function Receipts(){
  const toISO = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).toISOString().slice(0,10)
const startOfWeek = (d: Date) => { const x=new Date(d); const day=(x.getDay()+6)%7; x.setDate(x.getDate()-day); return x }
const startOfMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth(), 1)
const last7 = () => { const end = new Date(); const start = new Date(); start.setDate(end.getDate()-6); return [toISO(start), toISO(end)] as const }
const [from,setFrom] = useState<string>(last7()[0])
const [to,setTo] = useState<string>(last7()[1])
  const [printed,setPrinted] = useState<'all'|'true'|'false'>('all')

  const qs = useMemo(()=>{
    const q = new URLSearchParams()
    if (from) q.set('from', from)
    if (to)   q.set('to', to)
    if (printed !== 'all') q.set('printed', printed)
    return q.toString()
  }, [from,to,printed])

  const { data, isLoading, mutate } = useSWR(`/api/orders?${qs}`, fetcher)

  async function markPrinted(id:number, val:boolean){
    await fetch(`/api/orders/${id}`, { method:'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ printed: val }) })
    mutate()
  }
  async function setDiscount(id:number, current:number){
    const str = prompt('Nuevo descuento', String(current||0))
    if (str===null) return
    const discount = Number(str)||0
    await fetch(`/api/orders/${id}`, { method:'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ discount }) })
    mutate()
  }

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-semibold">Recibos</h1>
      <div className="grid sm:grid-cols-6 gap-3 items-end">
        <div className="flex flex-col gap-1">
          <span className="text-xs opacity-70 font-medium">Desde</span>
          <input className="border border-gray-700 text-white rounded px-2 py-1" type="date" value={from} onChange={e=>setFrom(e.target.value)} />
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-xs opacity-70 font-medium">Hasta</span>
          <input className="border border-gray-700 text-white rounded px-2 py-1" type="date" value={to} onChange={e=>setTo(e.target.value)} />
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-xs opacity-70 font-medium">Estado</span>
          <select className="border border-gray-700 text-white rounded px-2 py-1" value={printed} onChange={e=>setPrinted(e.target.value as any)}>
            <option value="all">Todos</option>
            <option value="true">Impresos</option>
            <option value="false">No impresos</option>
          </select>
        </div>
      </div>

      <div className="space-y-3">
        {(data||[]).map((o:any)=>(
          <div key={o.id} className="border border-gray-700 text-white rounded-xl p-3 shadow">
            <div className="flex justify-between items-center">
              <div className="font-medium">#{o.id} — {new Date(o.createdAt).toLocaleString()}</div>
              <div className="text-sm opacity-70">{o.tableCode || 'Mostrador'}</div>
            </div>
            <div className="text-sm">Bruto: {pesos(o.gross)} · Descuento: {pesos(o.discount)} · Neto: <b>{pesos(o.net)}</b></div>
            <div className="text-xs opacity-70">Costo: {pesos(o.cost)}</div>
            <div className="flex gap-2 items-center mt-2">
              <button className="border border-gray-700 text-white px-3 py-1 rounded" onClick={()=>setDiscount(o.id, o.discount)}>Descuento</button>
              <Link className="border border-gray-700 text-white px-3 py-1 rounded" href={`/admin/receipts/${o.id}/print`} target="_blank">Imprimir comanda</Link>
              {o.printed
                ? <button className="border border-gray-700 text-white px-3 py-1 rounded" onClick={()=>markPrinted(o.id,false)}>Marcar como NO impresa</button>
                : <button className="border border-gray-700 text-white px-3 py-1 rounded bg-black text-white" onClick={()=>markPrinted(o.id,true)}>Marcar como impresa</button>}
            </div>
          </div>
        ))}
        {!(data||[]).length && !isLoading && <div className="text-sm opacity-70">No hay recibos en ese rango.</div>}
      </div>
    </div>
  )
}
