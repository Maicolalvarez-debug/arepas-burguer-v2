# Arepas Burguer – Nuevo Proyecto

Stack: **Next.js 14 (App Router) + Prisma + PostgreSQL (Neon)**

## Deploy rápido (Vercel)

1. Crea un proyecto en Vercel y sube este repo como ZIP.
2. Configura la variable **DATABASE_URL** (usa tu cadena de conexión de Neon y asegúrate de `sslmode=require`).
3. Deploy. El `postinstall` hace `prisma db push` (crea/esquema sin migraciones) y `prisma generate`.

## Rutas API

- `GET/POST /api/categories`
- `GET/POST /api/products`
- `GET/POST /api/modifiers`
- `GET /api/orders?include=items` y `POST /api/orders`
- `GET /api/orders.csv?from=YYYY-MM-DD&to=YYYY-MM-DD`
- `GET /api/reports?from=YYYY-MM-DD&to=YYYY-MM-DD&groupBy=day|month`

Todas las respuestas `GET` devuelven **arrays** y evitan caché.
Los `POST` responden `{ ok: true, id }` o `{ ok: false, error }`.

## Admin

- `/admin/categories` (crear/listar)
- `/admin/products` y `/admin/products/new`
- `/admin/modifiers` y `/admin/modifiers/new`
- `/admin/orders`

## Menú público

- `/` lista categorías y productos.

## Notas

- Los campos de imagen se guardan en `image` (no `imageUrl`).
- Modificadores usan `priceDelta` y `costDelta`.
- Se usan helpers para normalizar números y booleanos.
