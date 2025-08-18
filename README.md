# Arepas Burguer - Stable Starter (Next.js 14 + Prisma)

This is a stable copy with:
- Prisma schema for Category (with `order`), Product, Modifier, ProductModifier.
- API routes for CRUD + reordering categories.
- Simple admin UI to create/edit Products, Categories, Modifiers with visible price/cost/stock.

## Quick Start

1. Copy `.env.example` to `.env` and set `DATABASE_URL`.
2. Install deps:
   ```bash
   npm i
   ```
3. Create tables:
   ```bash
   npx prisma migrate dev --name init
   # or: npx prisma db push
   ```
4. Seed sample data:
   ```bash
   npm run seed
   ```
5. Run dev server:
   ```bash
   npm run dev
   ```

Open http://localhost:3000 to access the admin.

> Category order can be changed via drag & drop, then click "Guardar orden".
