'use client'
import { useMemo, useState } from 'react'
import useSWR from 'swr'
import dynamic from 'next/dynamic'

const fetcher = (u:string)=>fetch(u, { cache:'no-store' }).then(r=>r.json())
const Chart = dynamic(()=>import('./Chart'),{ ssr:false })

const toISO = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).toISOString().slice(0,10)
const startOfWeek = (d: Date) => { const x=new Date(d); const day=(x.getDay()+6)%7; x.setDate(x.getDate()-day); return x }
const startOfMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth(), 1)
const endOfMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth()+1, 0)
const last7 = () => { const end = new Date(); const start = new Date(); start.setDate(end.getDate()-6); return [toISO(start), toISO(end)] as const }

export default function ReportsPage(){
  const [from,setFrom] = useState<string>(last7()[0])
  const [to,setTo]     = useState<string>(last7()[1])
  const [groupBy,setGroupBy] = useState<'day'|'week'|'month'>('day')

  const url = useMemo(()=>`/api/reports?from=${from}&to=${to}&groupBy=${groupBy}`,[from,to,groupBy])
  const { data, error, isLoading } = useSWR(url, fetcher)

  return (
    <div className="space-y-6 p-4">
      <h1 className="text-2xl font-semibold">Informes</h1>

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
          <span className="text-xs opacity-70 font-medium">Agrupar por</span>
          <select className="border rounded px-2 py-1 bg-gray-800 border-gray-700 text-white"
            value={groupBy}
            onChange={(e)=>{
              const v = e.target.value as 'day'|'week'|'month'
              setGroupBy(v)
              const now = new Date()
              if (v==='day'){ const f=toISO(now); setFrom(f); setTo(f) }
              if (v==='week'){ const s=startOfWeek(now); setFrom(toISO(s)); setTo(toISO(now)) }
              if (v==='month'){ const s=startOfMonth(now); setFrom(toISO(s)); setTo(toISO(now)) }
            }}
          >
            <option value="day">Día</option>
            <option value="week">Semana</option>
            <option value="month">Mes</option>
          </select>
        </div>
        <div className="sm:col-span-3 flex gap-2 justify-end">
          <a className="inline-flex items-center border rounded px-3 py-1 text-sm bg-gray-900 text-white border-gray-700 hover:bg-gray-800"
             href={`/api/reports.csv?from=${from}&to=${to}&groupBy=${groupBy}`}>Descargar CSV</a>
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
      {error && <div className="text-red-400">Error cargando datos</div>}

      {data && (
        <div className="space-y-4">
          <div className="grid sm:grid-cols-4 gap-3">
            <div className="rounded-2xl p-4 border bg-gray-900 border-gray-700 text-white">
              <div className="text-sm opacity-70">Bruto</div>
              <div className="text-2xl font-semibold">{(data.totals.gross||0).toLocaleString('es-CO')}</div>
            </div>
            <div className="rounded-2xl p-4 border bg-gray-900 border-gray-700 text-white">
              <div className="text-sm opacity-70">Neto</div>
              <div className="text-2xl font-semibold">{(data.totals.net||0).toLocaleString('es-CO')}</div>
            </div>
            <div className="rounded-2xl p-4 border bg-gray-900 border-gray-700 text-white">
              <div className="text-sm opacity-70">Costo</div>
              <div className="text-2xl font-semibold">{(data.totals.cost||0).toLocaleString('es-CO')}</div>
            </div>
            <div className="rounded-2xl p-4 border bg-gray-900 border-gray-700 text-white">
              <div className="text-sm opacity-70">Utilidad</div>
              <div className="text-2xl font-semibold">{((data.totals.net||0)-(data.totals.cost||0)).toLocaleString('es-CO')}</div>
            </div>
          </div>

          <Chart data={data.series} />
        </div>
      )}
    </div>
  )
}
