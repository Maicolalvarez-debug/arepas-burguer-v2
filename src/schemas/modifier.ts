import { z } from 'zod';
import { toNumber } from '@/lib/number';
export const modifierSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, 'Nombre requerido'),
  price: z.union([z.string(), z.number(), z.null(), z.undefined()])
           .transform((v) => toNumber(v, 0)),
  cost: z.union([z.string(), z.number(), z.null(), z.undefined()])
           .transform((v) => toNumber(v, 0)).optional(),
  stock: z.union([z.string(), z.number(), z.null(), z.undefined()])
           .transform((v) => toNumber(v, 0)).optional(),
  active: z.union([z.boolean(), z.string(), z.number(), z.null(), z.undefined()])
           .transform((v) => {
             if (typeof v === 'boolean') return v;
             if (typeof v === 'string') return v === 'true' || v === '1';
             if (typeof v === 'number') return v !== 0;
             return true; // default
           }).optional(),
});
export type ModifierInput = z.infer<typeof modifierSchema>;
