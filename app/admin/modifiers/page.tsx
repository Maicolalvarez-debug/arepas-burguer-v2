// app/admin/modifiers/page.tsx
// Server component: fetch data from Prisma and render the client component.
import ModifiersClient from "./ModifiersClient";
import { prisma } from "@/lib/prisma";
import type { Modifier } from "@prisma/client";

export const dynamic = 'force-dynamic';

export default async function Page() {
  const data: Modifier[] = await prisma.modifier.findMany({
    orderBy: [
      { name: 'asc' },
    ],
  });
  return <ModifiersClient data={data} />;
}
