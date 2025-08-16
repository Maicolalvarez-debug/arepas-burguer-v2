# Arepas Burguer — Menú + Carrito + WhatsApp + Inventario + Reportes (Next.js + Prisma + Postgres)

Listo para **GitHub + Vercel (gratis y sencillo)**.

## Variables (Vercel → Settings → Environment Variables)
- `DATABASE_URL` → tu Postgres (Neon o Vercel Postgres) con `sslmode=require` (y `pgbouncer=true` recomendado en Neon).
- `ADMIN_PASSWORD` → contraseña para `/admin`.
- `WHATSAPP_NUMBER` → `573118651391`
- (Opcional) `BASE_URL` → dominio Vercel (para QR) `https://tu-proyecto.vercel.app`

## Deploy
- Build: `prisma generate && prisma migrate deploy && next build`
- Runtime Node.js (API) asegurado en rutas.
