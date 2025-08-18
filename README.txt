Arepas Burguer – Fixes FULL (export nombrado prisma + endpoints corregidos)

Archivos incluidos:
- src/lib/prisma.ts                 (export nombrado { prisma })
- app/api/categories/route.ts       (import corregido + validación mínima)
- app/api/modifiers/route.ts        (usa Number() para priceDelta/costDelta/stock + active por defecto)
- app/api/products/route.ts         (POST con categoryId, usa Prisma.Decimal para price/cost)
- app/api/products/[id]/route.ts    (GET por id)

Notas IMPORTANTES:
- Si en tu schema Prisma `price` y `cost` NO son Decimal, cambia en products/route.ts a Number(...).
- Si `categoryId` es Int, convierte: const categoryId = Number(body?.categoryId).
- Asegúrate de tener alias `@/*` -> `src/*` en tsconfig.json. Si no, cambia los imports a rutas relativas.

Cómo usar:
1) Haz backup o crea rama.
2) Copia estos archivos en las rutas exactas y reemplaza los existentes.
3) Despliega.
