import { defineConfig } from '@prisma/config';

export default defineConfig({
  // semilla del proyecto
  seed: "ts-node --transpile-only prisma/seed.ts",
});
