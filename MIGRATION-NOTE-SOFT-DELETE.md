# Soft-delete para Productos

Se agregó el campo `isActive Boolean @default(true)` al modelo `Product` en `prisma/schema.prisma`.
Ahora la API de productos:
- Lista solo productos activos (`GET /api/products`)
- "Elimina" con soft-delete (`DELETE /api/products/:id`) -> `isActive=false`
- Permite restaurar (`PATCH /api/products/:id` con `{ "isActive": true }`)

### Pasos de migración
1. Ejecuta:
   ```bash
   npx prisma migrate dev -n add-product-isActive
   # En producción:
   npx prisma migrate deploy
   ```
2. (Opcional) Si quieres permitir *hard-delete* sin violar FK:
   - Cambia la relación en `OrderItem` para que `productId` sea opcional y `onDelete: SetNull`.
   - SQL rápido (Postgres):
     ```sql
     ALTER TABLE "OrderItem" DROP CONSTRAINT "OrderItem_productId_fkey";
     ALTER TABLE "OrderItem" ALTER COLUMN "productId" DROP NOT NULL;
     ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_productId_fkey"
       FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;
     ```
   - Ajusta tu `schema.prisma` acorde y migra.
3. Asegúrate de que las vistas/páginas que listan productos invoquen el endpoint `/api/products` (que ya filtra `isActive=true`).

### Restaurar un producto archivado
```bash
curl -X PATCH /api/products/123 -H 'Content-Type: application/json' -d '{"isActive": true}'
```
