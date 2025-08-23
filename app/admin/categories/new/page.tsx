'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function NewCategoriaPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [msg, setMsg] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMsg(null); setBusy(true)
    try {
      const res = await fetch('/api/categories', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ name }) })
      const json = await res.json()
      if (!res.ok || !json?.ok) throw new Error(json?.error || 'No se pudo crear')
      router.push('/admin/categories')
    } catch (err:any) {
      setMsg(err?.message || 'Error')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="p-4 max-w-md space-y-4">
      <h1 className="text-xl font-semibold">Nueva Categoría</h1>
      <form onSubmit={submit} className="space-y-3">
        <div>
          <label className="block text-sm mb-1">Nombre</label>
          <input
            value={name} onChange={e => setName(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 bg-gray-800 border-gray-700 text-white placeholder-gray-400"
            placeholder="Nombre"
            required
          />
        </div>
        <button disabled={busy} className="rounded-xl px-4 py-2 border">{busy ? 'Guardando…' : 'Crear'}</button>
        {msg && <div className="text-sm">{msg}</div>}
      </form>
    </div>
  )
}
