// app/admin/categories/page.tsx
// Server component: fetch data from Prisma and render the client component.
import CategoriesClient from "./CategoriesClient";
import { prisma } from "@/lib/prisma";
import type { Category } from "@prisma/client";

export const dynamic = 'force-dynamic';

export default async function Page() {
  const data: Category[] = await prisma.category.findMany({
    orderBy: [
      // Usa sortOrder si existe en tu modelo. Si no, Prisma marcará error de tipos.
      { sortOrder: 'asc' as any },
      { name: 'asc' },
    ],
  });
  return <CategoriesClient data={data} />;
}
