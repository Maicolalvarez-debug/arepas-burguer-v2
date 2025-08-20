import { z } from 'zod';
import { toNumber } from '@/lib/number';
export const modifierSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, 'Nombre requerido'),
  price: z.union([z.string(), z.number(), z.null(), z.undefined()])
           .transform((v) => toNumber(v, 0)),
});
export type ModifierInput = z.infer<typeof modifierSchema>;
