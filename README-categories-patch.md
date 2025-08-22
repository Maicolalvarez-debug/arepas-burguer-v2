# Patch integrado: Admin Categories con reordenar y guardar (Prisma)

Cambios aplicados:
- `app/admin/categories/page.tsx`: server component que trae categorías desde Prisma, ordenadas por `position` y `name`.
- `app/admin/categories/CategoriesClient.tsx`: client component con mover ↑/↓ y botón **Guardar orden**.
- `app/api/categories/reorder/route.ts`: endpoint para persistir el orden.

**Requisitos del modelo** (`prisma/schema.prisma`):
```prisma
model Category {
  id       String  @id @default(cuid())
  name     String
  position Int     @default(0)
  @@index([position])
}
```

Luego ejecuta:
```
npx prisma generate
npx prisma migrate dev -n add_position_to_category
# o: npx prisma migrate deploy (prod)
```
