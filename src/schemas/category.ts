import { z } from 'zod';
export const categorySchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, 'Nombre requerido'),
});
export type CategoryInput = z.infer<typeof categorySchema>;
