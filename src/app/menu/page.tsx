export const dynamic = "force-dynamic";
export const revalidate = 0;

import { prisma } from "@/lib/prisma";

export default async function MenuPage() {
  const cfg = await prisma.config.findFirst({ where: { id: 1 } });
  const envWa = process.env.WHATSAPP_NUMBER;
  const waNumber = envWa && envWa.trim() !== "" ? envWa : (cfg?.whatsapp || "");
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    include: {
      products: {
        where: { active: true },
        orderBy: { order: "asc" }
      }
    }
  });

  const empty = categories.length === 0 || categories.every(c => c.products.length === 0);

  return (
    <main className="container py-10 space-y-8">
      <h1 className="text-2xl font-bold">Menú</h1>
      {empty && (
        <p className="text-neutral-300">No hay productos aún. Usa <code>/api/seed</code> o carga tus datos.</p>
      )}
      <div className="space-y-10">
        {categories.map(cat => (
          <section key={cat.id} className="space-y-4">
            <h2 className="text-xl font-semibold border-b border-neutral-800 pb-2">{cat.name}</h2>
            <ul className="grid gap-4">
              {cat.products.map(p => (
                <li key={p.id} className="rounded-2xl border border-neutral-800 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-medium">{p.name}</h3>
                      {p.description && <p className="text-sm text-neutral-300 mt-1">{p.description}</p>}
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(p.price)}</div>
                      {p.stock !== null && <div className="text-xs text-neutral-400">Stock: {p.stock}</div>}
                    </div>
                  </div>
                  {waNumber && (
                    <div className="mt-3">
                      <a
                        className="inline-block rounded-xl border border-green-700 px-3 py-1 text-sm hover:bg-green-700/20"
                        href={`https://wa.me/${waNumber}?text=${encodeURIComponent(`Hola! Quiero pedir ${p.name}`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Pedir por WhatsApp
                      </a>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </main>
  );
}
