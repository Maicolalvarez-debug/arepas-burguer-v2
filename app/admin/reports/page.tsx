'use client'

import { useMemo, useState } from 'react'
import useSWR from 'swr'
import dynamic from 'next/dynamic'

const fetcher = (u:string)=>fetch(u).then(r=>r.json())
const Chart = dynamic(()=>import('./Chart'),{ssr:false})

export default function ReportsPage(){
  // Default a HOY, si prefieres últimos 7 días lo cambiamos
  const today = new Date().toISOString().slice(0,10)
  const [from,setFrom] = useState<string>(today)
  const [to,setTo]     = useState<string>(today)
  const [groupBy,setGroupBy] = useState<'day'|'week'|'month'>('day')

  const url = useMemo(()=>`/api/reports?from=${from}&to=${to}&groupBy=${groupBy}`,[from,to,groupBy])
  const { data, error, isLoading } = useSWR(url, fetcher)

  return (
    <div className="space-y-6 p-4">
      <h1 className="text-2xl font-semibold">Informes</h1>

      <div className="grid sm:grid-cols-6 gap-3 items-end">
        <div className="flex flex-col gap-1">
          <span className="text-xs opacity-70 font-medium">Desde</span>
          <input className="border rounded px-2 py-1" type="date" value={from} onChange={e=>setFrom(e.target.value)} />
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-xs opacity-70 font-medium">Hasta</span>
          <input className="border rounded px-2 py-1" type="date" value={to} onChange={e=>setTo(e.target.value)} />
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-xs opacity-70 font-medium">Agrupar por</span>
          <select className="border rounded px-2 py-1" value={groupBy} onChange={e=>setGroupBy(e.target.value as any)}>
            <option value="day">Día</option>
            <option value="week">Semana</option>
            <option value="month">Mes</option>
          </select>
        </div>
        <div className="sm:col-span-3 flex gap-2 justify-end">
          <a className="inline-flex items-center border rounded px-3 py-1 text-sm" href={`/api/reports.csv?from=${from}&to=${to}&groupBy=${groupBy}`}>
            Descargar CSV
          </a>
        </div>
      </div>

      {isLoading && <div>Cargando…</div>}
      {error && <div className="text-red-600 text-sm">Error cargando datos</div>}

      {!isLoading && !error && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label:'Bruto',    value: data?.totals?.gross || 0 },
              { label:'Neto',     value: data?.totals?.net   || 0 },
              { label:'Costo',    value: data?.totals?.cost  || 0 },
              { label:'Utilidad', value: data?.totals?.profit|| 0 },
            ].map(c=>(
              <div key={c.label} className="rounded-2xl p-4 shadow border bg-white/5">
                <div className="text-xs opacity-70">{c.label}</div>
                <div className="text-xl font-semibold">${(c.value as number).toLocaleString()}</div>
              </div>
            ))}
          </div>

          <Chart data={data?.series || []} />
        </>
      )}
    </div>
  )
}
