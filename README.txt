Fix para /app/api/modifiers/route.ts

- Agrega los campos requeridos por el schema: priceDelta, costDelta, stock, active.
- Usa Prisma.Decimal para *Delta*. Cambia a Number(...) si no son Decimal en tu schema.
- Defaults: priceDelta=0, costDelta=0, stock=0, active=true.

Copia este archivo a la misma ruta de tu proyecto y vuelve a desplegar.
