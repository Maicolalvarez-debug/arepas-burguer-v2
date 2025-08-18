// prisma/seed.ts
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function ensureCategory(name: string) {
  const existing = await prisma.category.findUnique({ where: { name } })
  if (existing) return existing
  return prisma.category.create({ data: { name } })
}

async function ensureModifier(name: string, priceDelta: number) {
  return prisma.modifier.upsert({
    where: { name },
    update: { priceDelta },
    create: { name, priceDelta },
  })
}

type ProductInput = { name: string; price: number; categoryName: string }

async function ensureProduct({ name, price, categoryName }: ProductInput) {
  const category = await ensureCategory(categoryName)

  const existing = await prisma.product.findFirst({
    where: { name, categoryId: category.id },
  })

  if (existing) {
    return prisma.product.update({
      where: { id: existing.id },
      data: { price, categoryId: category.id },
    })
  }

  return prisma.product.create({
    data: { name, price, category: { connect: { id: category.id } } },
  })
}

async function linkProductModifier(productId: number, modifierId: number) {
  try {
    await prisma.productModifier.create({ data: { productId, modifierId } })
  } catch (e) {
    // ignore duplicates (unique constraint)
  }
}

async function main() {
  const categorias = ['Hamburguesas', 'Arepas', 'Bebidas', 'Combos']
  await Promise.all(categorias.map((c) => ensureCategory(c)))

  const modificadores = [
    { name: 'Queso extra (doble crema)', priceDelta: 2000 },
    { name: 'Tocineta extra', priceDelta: 2500 },
    { name: 'Jamón extra', priceDelta: 1500 },
    { name: 'Piña extra', priceDelta: 1500 },
    { name: 'Champiñones extra', priceDelta: 2500 },
    { name: 'Salsa cheddar extra', priceDelta: 2000 },
  ]
  const modifierMap: Record<string, number> = {}
  for (const m of modificadores) {
    const mod = await ensureModifier(m.name, m.priceDelta)
    modifierMap[m.name] = mod.id
  }

  const productos: ProductInput[] = [
    { name: 'Sencilla', price: 12000, categoryName: 'Hamburguesas' },
    { name: 'Clásica', price: 16000, categoryName: 'Hamburguesas' },
    { name: 'Doble Carne', price: 21000, categoryName: 'Hamburguesas' },
    { name: 'Hawaiana', price: 19000, categoryName: 'Hamburguesas' },
    { name: 'Costeña (huevo)', price: 20000, categoryName: 'Hamburguesas' },
    { name: 'Costeña (costra + plátano + suero)', price: 23000, categoryName: 'Hamburguesas' },
    { name: 'Especial (mixta)', price: 24000, categoryName: 'Hamburguesas' },
    { name: 'Champiñones', price: 20000, categoryName: 'Hamburguesas' },
    { name: 'Malcriada', price: 22000, categoryName: 'Hamburguesas' },
    { name: 'Chesseburguer', price: 18000, categoryName: 'Hamburguesas' },

    { name: 'Arepa con pollo y queso', price: 8000, categoryName: 'Arepas' },

    { name: 'Coca-Cola 500ml', price: 4000, categoryName: 'Bebidas' },
    { name: 'Postobón 400ml', price: 3500, categoryName: 'Bebidas' },

    { name: 'Combo Clásica + Gaseosa', price: 19000, categoryName: 'Combos' },
  ]

  const productMap: Record<string, number> = {}
  for (const p of productos) {
    const prod = await ensureProduct(p)
    productMap[`${p.categoryName}::${p.name}`] = prod.id
  }

  const hamburguesas = productos.filter((p) => p.categoryName === 'Hamburguesas')
  for (const h of hamburguesas) {
    const pid = productMap[`${h.categoryName}::${h.name}`]
    const modsParaHamburguesa = [
      'Queso extra (doble crema)',
      'Tocineta extra',
      'Jamón extra',
      'Piña extra',
      'Champiñones extra',
      'Salsa cheddar extra',
    ]
    for (const modName of modsParaHamburguesa) {
      const mid = modifierMap[modName]
      if (mid) await linkProductModifier(pid, mid)
    }
  }

  const counts = await prisma.$transaction([
    prisma.category.count(),
    prisma.product.count(),
    prisma.modifier.count(),
    prisma.productModifier.count(),
  ])
  console.log(`Seed OK -> Categorías: ${counts[0]}, Productos: ${counts[1]}, Modificadores: ${counts[2]}, Vinculaciones: ${counts[3]}`)
}

main()
  .then(async () => { await prisma.$disconnect() })
  .catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1) })
