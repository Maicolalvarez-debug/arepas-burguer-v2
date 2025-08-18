// app/api/categories/reorder/route.ts
import { NextResponse } from 'next/server'

// Compatibilidad: tu esquema estable probablemente no tiene "order".
export async function PATCH() {
  return NextResponse.json({ error: 'Reordenamiento no soportado en este esquema' }, { status: 501 })
}
