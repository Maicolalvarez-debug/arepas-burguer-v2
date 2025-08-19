'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import NumberField from '@/components/ui/NumberField';
import { modifierSchema, ModifierInput } from '@/schemas/modifier';
export default function ModifierForm({ onSubmit, defaultValues }:{ onSubmit:(d:ModifierInput)=>void|Promise<void>; defaultValues?: Partial<ModifierInput>;}){ const { register, handleSubmit, setValue, watch, formState:{errors,isSubmitting}}=useForm<ModifierInput>({ resolver: zodResolver(modifierSchema), defaultValues:{ name:'', price:'', ...(defaultValues as any)},}); return (<form onSubmit={handleSubmit(onSubmit)} className="space-y-3"><input placeholder="Nombre" {...register('name')}/>{errors.name && <p className="text-red-500 text-sm">{String(errors.name.message)}</p>}<NumberField placeholder="Precio" value={watch('price') as any} onChange={(v)=>setValue('price', v as any)}/><button disabled={isSubmitting} type="submit">Guardar</button></form>);}