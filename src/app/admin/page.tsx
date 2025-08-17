
export const dynamic = "force-dynamic";
export const revalidate = 0;

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

async function getToken(searchParams: URLSearchParams) {
  const token = searchParams.get("token") || "";
  const ok = process.env.ADMIN_TOKEN && token === process.env.ADMIN_TOKEN;
  return ok ? token : "";
}

export default async function AdminPage({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined }}) {
  const token = await getToken(new URLSearchParams(Object.entries(searchParams).flatMap(([k,v]) => Array.isArray(v) ? v.map(vv => [k, String(vv)]) : [[k, String(v)]])));
  if (!token) {
    return (
      <main className="container py-10 space-y-6">
        <h1 className="text-2xl font-bold">Admin</h1>
        <p className="text-sm text-neutral-300">Acceso protegido. Agrega <code>?token=TU_TOKEN</code> en la URL.</p>
      </main>
    );
  }

  async function updateProduct(formData: FormData) {
    "use server";
    const id = Number(formData.get("id"));
    const price = Number(formData.get("price"));
    const active = formData.get("active") === "on";
    await prisma.product.update({
      where: { id },
      data: { price, active }
    });
  }

  async function setWhatsapp(formData: FormData) {
    "use server";
    const number = String(formData.get("whatsapp") || "");
    await prisma.config.upsert({
      where: { id: 1 },
      create: { id: 1, whatsapp: number },
      update: { whatsapp: number }
    });
  }

  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    include: { products: { orderBy: { order: "asc" } } }
  });
  const cfg = await prisma.config.findFirst({ where: { id: 1 } });

  return (
    <main className="container py-10 space-y-8">
      <h1 className="text-2xl font-bold">Panel Admin</h1>
      <section className="rounded-2xl border border-neutral-800 p-4 space-y-3">
        <h2 className="font-semibold">WhatsApp</h2>
        <form action={setWhatsapp} className="flex items-center gap-3">
          <input name="whatsapp" defaultValue={cfg?.whatsapp ?? ""} placeholder="57..." className="bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 w-64" />
          <button className="rounded-xl border border-neutral-700 px-3 py-2 text-sm hover:bg-neutral-800">Guardar</button>
        </form>
        <p className="text-xs text-neutral-400">También puedes usar la variable de entorno <code>WHATSAPP_NUMBER</code>. Si está presente, tiene prioridad.</p>
      </section>

      {categories.map(cat => (
        <section key={cat.id} className="space-y-4">
          <h2 className="text-xl font-semibold border-b border-neutral-800 pb-2">{cat.name}</h2>
          <ul className="grid gap-3">
            {cat.products.map(p => (
              <li key={p.id} className="rounded-2xl border border-neutral-800 p-4">
                <form action={updateProduct} className="flex items-center justify-between gap-4">
                  <input type="hidden" name="id" value={p.id} />
                  <div className="flex-1">
                    <div className="font-medium">{p.name}</div>
                    <div className="text-xs text-neutral-400">ID: {p.id}</div>
                  </div>
                  <label className="flex items-center gap-2 text-sm">
                    <span>Activo</span>
                    <input type="checkbox" name="active" defaultChecked={p.active} />
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <span>Precio</span>
                    <input type="number" name="price" defaultValue={p.price} className="w-28 bg-neutral-900 border border-neutral-800 rounded-xl px-2 py-1" />
                  </label>
                  <button className="rounded-xl border border-neutral-700 px-3 py-2 text-sm hover:bg-neutral-800">Guardar</button>
                </form>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </main>
  );
}
