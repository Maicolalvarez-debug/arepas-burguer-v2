# Arepas Burguer — Paquete de fixes

Archivos incluidos para corregir el build en Vercel:

## Cambios clave
1. **Rutas duplicadas**: elimina `app/menu/page.tsx` si mantienes `app/(public)/menu/page.tsx`. No pueden coexistir dos páginas para `/menu`.
2. **Páginas admin**: reemplazadas por versiones válidas TSX que renderizan el `<form>` dentro del componente.
3. **Prisma**:
   - `updatedAt` ahora tiene `@default(now())` para `db push` con datos existentes.
   - `Modifier.name` es `@unique` para permitir `upsert` en el seed.
4. **Seed**:
   - Idempotente, ESM, sin campos que ya no existen (description, imageUrl, stock, active, cost).
5. **next.config.mjs**:
   - Eliminado `experimental.serverActions` que ya no es válido en Next 14+.
6. **lib/prisma.ts**:
   - Cliente Prisma singleton compatible con App Router.

## Estructura
- `prisma/schema.prisma`
- `prisma/seed.ts`
- `app/admin/modifiers/[id]/page.tsx`
- `app/admin/modifiers/new/page.tsx`
- `app/admin/products/[id]/page.tsx`
- `lib/prisma.ts`
- `next.config.mjs`

## Pasos
1. Copia estos archivos en tu repo (respetando rutas).
2. **Borra** `app/menu/page.tsx` (si usas `app/(public)/menu/page.tsx`).
3. Asegúrate que `package.json` tenga:
   - `"type": "module"` (recomendado para el seed ESM)
   - En producción, preferible usar `"build": "prisma generate && prisma migrate deploy && next build"` y correr el seed manualmente con `npm run seed`.
4. Ejecuta localmente (opcional):
   ```bash
   npx prisma format
   npx prisma db push
   npm run seed
   npm run build
   ```

¡Listo!
