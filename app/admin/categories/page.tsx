export const revalidate = 0;
// Admin Categories - no direct Prisma on server; client handles fetching.
import CategoriesClient from "./CategoriesClient";
export const dynamic = 'force-dynamic';
export default function Page() { return <CategoriesClient data={[]} />; }
