# Arepas Burguer Starter (Next.js + Prisma)

Este paquete está listo para subir a GitHub y desplegar en Vercel.
- **Build pasa** porque `postinstall` solo hace `prisma generate` (no necesita DB).
- Para funcionar con base de datos, debes configurar `DATABASE_URL` en Vercel.

## Pasos
1. Descarga el ZIP, descomprímelo y súbelo a un repositorio nuevo en GitHub.
2. En Vercel, crea un proyecto desde ese repo.
3. En **Settings → Environment Variables** agrega:
   - `DATABASE_URL=postgresql://usuario:password@host:5432/arepas_burguer?schema=public`
4. (Opcional, recomendado) Ejecuta migraciones en producción con `prisma migrate deploy`.
   - Puedes activar un Job en Vercel o correrlo manualmente desde tu máquina.
5. ¡Listo! El home debe cargar y la ruta `/api/health` mostrará el estado.

## Comandos útiles (local)
```bash
npm i
npm run prisma:format
npm run prisma:generate
# Inicializa estructura de tablas (usa este si no manejas migraciones aún):
npm run prisma:db:push
# O usa migraciones
npm run prisma:migrate:dev -- --name init
npm run dev
```
