'use client'

import { useMemo, useState } from 'react'
import useSWR from 'swr'
import dynamic from 'next/dynamic'

const RC: any = dynamic(() => import('recharts').then(m => ({
  ResponsiveContainer: m.ResponsiveContainer,
  LineChart: m.LineChart,
  Line: m.Line,
  CartesianGrid: m.CartesianGrid,
  XAxis: m.XAxis,
  YAxis: m.YAxis,
  Tooltip: m.Tooltip,
  Legend: m.Legend,
})), { ssr: false })

const fetcher = (url: string) => fetch(url).then((r) => r.json())

const Chart = dynamic(() => import('./Chart'), { ssr: false })

export default function ReportsPage() {
  const todayStr = new Date().toISOString().slice(0, 10)
  const [from, setFrom] = useState(todayStr)
  const [to, setTo] = useState(todayStr)
  const [groupBy, setGroupBy] = useState<'day' | 'week' | 'month'>('day')

  const url = useMemo(() => `/api/reports?from=${from}&to=${to}&groupBy=${groupBy}`, [from, to, groupBy])
  const { data, error, isLoading } = useSWR(url, fetcher)

  return (
    <div className="space-y-6 p-4">
      <h1 className="text-2xl font-semibold">Informes</h1>

      <div className="grid sm:grid-cols-6 gap-3 items-end">
        <div className="flex flex-col gap-1">
          <span className="text-xs opacity-70 font-medium">Desde</span>
          <input className="border rounded px-2 py-1" type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-xs opacity-70 font-medium">Hasta</span>
          <input className="border rounded px-2 py-1" type="date" value={to} onChange={(e) => setTo(e.target.value)} />
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-xs opacity-70 font-medium">Agrupar por</span>
          <select className="border rounded px-2 py-1" value={groupBy} onChange={(e) => setGroupBy(e.target.value as any)}>
            <option value="day">Día</option>
            <option value="week">Semana</option>
            <option value="month">Mes</option>
          </select>
        </div>
        <div className="sm:col-span-3 flex gap-2 justify-end">
          <a
            href={`/api/reports.csv?from=${from}&to=${to}&groupBy=${groupBy}`}
            className="inline-flex items-center border rounded px-3 py-1 text-sm"
          >
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
              { label: 'Bruto', value: data?.totals?.gross || 0 },
              { label: 'Neto', value: data?.totals?.net || 0 },
              { label: 'Costo', value: data?.totals?.cost || 0 },
              { label: 'Utilidad', value: data?.totals?.profit || 0 },
            ].map((c) => (
              <div key={c.label} className="rounded-2xl p-4 shadow border bg-white/5">
                <div className="text-xs opacity-70">{c.label}</div>
                <div className="text-xl font-semibold">${(c.value as number).toLocaleString()}</div>
              </div>
            ))}
          </div>

          <Chart data={data?.series || []} />
{/* Old container kept for reference removed by build script */}
{/* <div className="w-full h-80 rounded-2xl border shadow p-2"> */}
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data?.series || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="gross" />
                <Line type="monotone" dataKey="net" />
                <Line type="monotone" dataKey="cost" />
                <Line type="monotone" dataKey="profit" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  )
}
