'use client'
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts'

export default function ReportsChart({ data }: { data: any[] }) {
  return (
    <div className="w-full h-80 rounded-2xl border shadow p-2">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
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
  )
}
