// app/admin/products/page.tsx
// Server component: fetch data from Prisma and render the client component.
import ProductsClient from "./ProductsClient";
import { prisma } from "@/lib/prisma";
import type { Product } from "@prisma/client";

export const dynamic = 'force-dynamic';

export default async function Page() {
  const data: Product[] = await prisma.product.findMany({
    orderBy: [
      { name: 'asc' },
    ],
  });
  return <ProductsClient data={data} />;
}
