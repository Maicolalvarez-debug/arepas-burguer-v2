import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'

export default async function PrintPage({ params }: { params: { id: string } }) {
  const id = Number(params.id)
  const order = await prisma.order.findUnique({ where: { id }, include: { items: { include: { modifiers: true } } } })
  if (!order) return notFound()
  return (
    <html>
      <body>
        <h1>Comanda #{order.id}</h1>
        <p>Fecha: {new Date(order.createdAt).toLocaleString()}</p>
        <ul>
          {order.items.map((it:any)=>(
            <li key={it.id}>
              {it.quantity} × {it.productName} — ${Number(it.subtotal).toLocaleString()}
              {it.modifiers?.length ? (
                <ul>
                  {it.modifiers.map((m:any)=>(
                    <li key={m.id}> + {m.quantity} × {m.modifierName}</li>
                  ))}
                </ul>
              ): null}
            </li>
          ))}
        </ul>
        <p><b>Neto:</b> ${Number(order.net).toLocaleString()}</p>
        <script>window.print()</script>
      </body>
    </html>
  )
}
