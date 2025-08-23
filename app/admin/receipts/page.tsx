'use client'
import useSWR from 'swr'
import Link from 'next/link'
import { useMemo, useState } from 'react'

const fetcher = (u:string)=>fetch(u, { cache:'no-store' }).then(r=>r.json())
const pesos = (n:number)=>'$'+(n||0).toLocaleString('es-CO')
const toISO = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).toISOString().slice(0,10)
const startOfWeek = (d: Date) => { const x=new Date(d); const day=(x.getDay()+6)%7; x.setDate(x.getDate()-day); return x }
const startOfMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth(), 1)
const endOfMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth()+1, 0)
const last7 = () => { const end = new Date(); const start = new Date(); start.setDate(end.getDate()-6); return [toISO(start), toISO(end)] as const }

export default function Receipts(){
  const [from,setFrom] = useState<string>(last7()[0])
  const [to,setTo] = useState<string>(last7()[1])
  const [printed,setPrinted] = useState<'all'|'true'|'false'>('all')

  const url = useMemo(()=>{
    const p = new URLSearchParams()
    p.set('from', from); p.set('to', to); p.set('printed', printed)
    return `/api/orders?${p.toString()}`
  },[from,to,printed])

  const { data, isLoading, mutate } = useSWR(url, fetcher)

  async function togglePrinted(id:number, printed:boolean){
    await fetch(`/api/orders/${id}`, { method:'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ printed: !printed }) })
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
          <input className="border rounded px-2 py-1 bg-gray-800 border-gray-700 text-white" type="date" value={from} onChange={e=>setFrom(e.target.value)} />
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-xs opacity-70 font-medium">Hasta</span>
          <input className="border rounded px-2 py-1 bg-gray-800 border-gray-700 text-white" type="date" value={to} onChange={e=>setTo(e.target.value)} />
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-xs opacity-70 font-medium">Estado</span>
          <select className="border rounded px-2 py-1 bg-gray-800 border-gray-700 text-white" value={printed} onChange={e=>setPrinted(e.target.value as any)}>
            <option value="all">Todos</option>
            <option value="true">Impresos</option>
            <option value="false">No impresos</option>
          </select>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 text-sm">
        <button className="border rounded px-2 py-1 bg-gray-900 text-white border-gray-700 hover:bg-gray-800" onClick={()=>{ const t=new Date(); const f=toISO(t); setFrom(f); setTo(f) }}>Hoy</button>
        <button className="border rounded px-2 py-1 bg-gray-900 text-white border-gray-700 hover:bg-gray-800" onClick={()=>{ const t=new Date(); const s=startOfWeek(t); setFrom(toISO(s)); setTo(toISO(t)) }}>Semana</button>
        <button className="border rounded px-2 py-1 bg-gray-900 text-white border-gray-700 hover:bg-gray-800" onClick={()=>{ const [a,b]=last7(); setFrom(a); setTo(b) }}>Últimos 7 días</button>
        <button className="border rounded px-2 py-1 bg-gray-900 text-white border-gray-700 hover:bg-gray-800" onClick={()=>{ const t=new Date(); const s=startOfMonth(t); setFrom(toISO(s)); setTo(toISO(t)) }}>Mes</button>
            <button className="border rounded px-2 py-1 bg-gray-900 text-white border-gray-700 hover:bg-gray-800" onClick={()=>{ const t=new Date(); const s=startOfMonth(t); const e=endOfMonth(t); (setFrom as any)(toISO(s)); (setTo as any)(toISO(e)) }}>Este mes completo</button>
      </div>

      {isLoading && <div>Cargando…</div>}
      <div className="space-y-3">
        {(data||[]).map((o:any)=>(
          <div key={o.id} className="rounded-2xl p-3 border bg-gray-900 border-gray-700 text-white">
            <div className="flex justify-between">
              <div className="font-semibold">Recibo #{o.id}</div>
              <div className="text-sm opacity-70">{new Date(o.createdAt).toLocaleString()}</div>
            </div>
            <div className="grid sm:grid-cols-4 gap-2 text-sm mt-2">
              <div>Bruto: {pesos(o.gross)}</div>
              <div>Descuento: {pesos(o.discount)}</div>
              <div>Neto: {pesos(o.net)}</div>
              <div>Costo: {pesos(o.cost)}</div>
            </div>
            <div className="flex gap-2 mt-2">
              <button className="border rounded px-2 py-1" onClick={()=>togglePrinted(o.id, o.printed)}>{o.printed ? 'Marcar NO impresa' : 'Marcar impresa'}</button>
              <button className="border rounded px-2 py-1" onClick={()=>setDiscount(o.id, o.discount)}>Editar descuento</button>
              <Link className="border rounded px-2 py-1" href={`/admin/receipts/${o.id}/print`} target="_blank">Imprimir</Link>
            </div>
          </div>
        ))}
        {!(data||[]).length && <div className="opacity-60">Sin recibos en el rango seleccionado.</div>}
      </div>
    </div>
  )
}
