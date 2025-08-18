import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { modifierSchema } from '@/schemas/modifier';
export async function POST(req: Request){ try{ const data = modifierSchema.parse(await req.json()); const created = await prisma.modifier.create({ data:{ name:data.name, price:data.price }}); return NextResponse.json(created,{status:201}); } catch(e:any){ return NextResponse.json({error:e.message},{status:400}); }}