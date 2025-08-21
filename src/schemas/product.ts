import { z } from 'zod';
import { toNumber } from '@/lib/number';

export const productSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, 'Nombre requerido'),
  description: z.string().optional(),
  categoryId: z.number().int().optional(),
  price: z.union([z.string(), z.number(), z.null(), z.undefined()])
           .transform((v) => toNumber(v, 0))
           .refine((n) => n >= 0, { message: 'Precio inválido' }),
  cost: z.union([z.string(), z.number(), z.null(), z.undefined()])
           .transform((v) => toNumber(v, 0))
           .refine((n) => n >= 0, { message: 'Costo inválido' }),
  stock: z.union([z.string(), z.number(), z.null(), z.undefined()])
           .transform((v) => Math.max(0, Math.floor(toNumber(v, 0)))),
});

export type ProductInput = z.infer<typeof productSchema>;
