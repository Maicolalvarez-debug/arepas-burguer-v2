// Prisma 6+ config. Reemplaza este archivo en la raíz del proyecto.
import { defineConfig } from '@prisma/config';

export default defineConfig({
  // Ubicación del schema (ajústalo si tu ruta es distinta)
  schema: './prisma/schema.prisma',

  // Configuración de seed en el nuevo formato
  seeding: {
    provider: 'ts-node',           // usa ts-node para ejecutar TypeScript
    path: 'prisma/seed.ts',        // ruta del seed
    // args: ['--transpile-only'], // opcional: si quieres pasar flags
  },
});
