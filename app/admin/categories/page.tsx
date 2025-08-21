// app/admin/categories/page.tsx
// Server component: fetch data from Prisma and render the client component.
import CategoriesClient from "./CategoriesClient";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export default async function Page() {
  const data = await prisma.category.findMany({
    orderBy: [
      { name: 'asc' },
    ],
  });
  return <CategoriesClient data={data} />;
}
