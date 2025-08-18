Arepas Burguer – Fixes ZIP (export nombrado de prisma + create product con categoryId)

Archivos incluidos (reemplaza en tu repo respetando las rutas):
- src/lib/prisma.ts                 (export nombrado: { prisma })
- app/api/categories/route.ts       (import corregido + validación mínima)
- app/api/modifiers/route.ts        (import corregido + validación mínima)
- app/api/products/route.ts         (POST crea usando categoryId; incluye GET de lista)
- app/api/products/[id]/route.ts    (GET por id)

Pasos sugeridos:
1) Haz un backup rápido o crea una rama nueva.
2) Copia/pega los archivos en las mismas rutas dentro de tu proyecto.
3) Verifica que tu tsconfig.json tenga el alias "@/*" -> "src/*". Si no, cambia los imports a ruta relativa.
4) Vuelve a desplegar.

Notas:
- Si en tu schema Prisma (prisma/schema.prisma) price/cost NO son Decimal, cambia a Number(...) en products/route.ts.
- Si categoryId es Int, usa Number(body.categoryId) antes de enviar al create.
