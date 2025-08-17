import { prisma } from "@/lib/prisma"; import Card from "@/components/Card"; import Link from "next/link";
export const runtime='nodejs'; export const dynamic='force-dynamic';
export default async function CategoriesPage(){ const cats = await prisma.category.findMany({ orderBy: { name:'asc' } });
  return (<div className="space-y-4">
    <div className="flex justify-between items-center"><h1 className="text-2xl font-semibold">Categorías</h1><Link className="btn" href="/admin/categories/new">Nueva</Link></div>
    <Card><table><thead><tr><th>Nombre</th><th></th></tr></thead><tbody>{cats.map(c=>(<tr key={c.id}><td>{c.name}</td><td><Link className="btn" href={`/admin/categories/${c.id}`}>Editar</Link></td></tr>))}</tbody></table></Card>
  </div>); }