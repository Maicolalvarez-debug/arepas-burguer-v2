// prisma/seed.js
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function safeHasDelegate(name) {
  try {
    return typeof prisma[name]?.findFirst === 'function'
  } catch {
    return false
  }
}

async function seedCategoriesAndProducts() {
  console.log('→ Seeding categorías y productos...')
  const categoryNames = ['Hamburguesas', 'Arepas', 'Combos', 'Bebidas']
  const catMap = {}
  for (const name of categoryNames) {
    let cat = await prisma.category.findFirst({ where: { name } })
    if (!cat) cat = await prisma.category.create({ data: { name } })
    catMap[name] = cat.id
  }

  const products = [
    { name: 'Hamburguesa Sencilla', description: 'Carne y vegetales.', price: 12000, cost: 6000, stock: 50, active: true, categoryKey: 'Hamburguesas' },
    { name: 'Hamburguesa Clásica', description: 'Con queso y jamón.', price: 16000, cost: 8000, stock: 50, active: true, categoryKey: 'Hamburguesas' },
    { name: 'Hamburguesa Hawaiana', description: 'Con piña y tocineta.', price: 18000, cost: 9000, stock: 50, active: true, categoryKey: 'Hamburguesas' },
    { name: 'Arepa con Pollo y Queso', description: 'Pollo desmechado y queso.', price: 8000, cost: 4000, stock: 50, active: true, categoryKey: 'Arepas' },
  ]

  const productMap = {}
  for (const p of products) {
    let exists = await prisma.product.findFirst({ where: { name: p.name } })
    if (!exists) {
      exists = await prisma.product.create({
        data: {
          name: p.name,
          description: p.description,
          price: p.price,
          cost: p.cost,
          stock: p.stock,
          active: p.active,
          categoryId: catMap[p.categoryKey],
        }
      })
    }
    productMap[p.name] = exists.id
  }
  return productMap
}

async function seedModifiersAndLinks(productMap) {
  const hasModifier = await safeHasDelegate('modifier')
  const hasProductModifier = await safeHasDelegate('productModifier')
  if (!hasModifier || !hasProductModifier) {
    console.log('→ Esquema sin Modifier/ProductModifier: se omite seed de modificadores.')
    return
  }

  console.log('→ Seeding modificadores...')
  const mods = [
    { name: 'Extra Queso Doble Crema', priceDelta: 1500, costDelta: 700, stock: 100, active: true },
    { name: 'Tocineta Extra',           priceDelta: 2000, costDelta: 900, stock: 100, active: true },
    { name: 'Piña Extra',               priceDelta: 1000, costDelta: 500, stock: 100, active: true },
    { name: 'Sin Cebolla',              priceDelta:   0,  costDelta:   0, stock: 9999, active: true },
  ]

  const modMap = {}
  for (const m of mods) {
    let ex = await prisma.modifier.findFirst({ where: { name: m.name } })
    if (!ex) ex = await prisma.modifier.create({ data: m })
    modMap[m.name] = ex.id
  }

  console.log('→ Asociando modificadores a productos (si no están asociados)...')
  const links = [
    { productName: 'Hamburguesa Clásica', modifiers: ['Extra Queso Doble Crema', 'Tocineta Extra', 'Sin Cebolla'] },
    { productName: 'Hamburguesa Hawaiana', modifiers: ['Extra Queso Doble Crema', 'Piña Extra', 'Tocineta Extra', 'Sin Cebolla'] },
    { productName: 'Hamburguesa Sencilla', modifiers: ['Extra Queso Doble Crema', 'Sin Cebolla'] },
  ]

  for (const l of links) {
    const pid = productMap[l.productName]
    if (!pid) continue
    for (const modName of l.modifiers) {
      const mid = modMap[modName]
      if (!mid) continue
      const exists = await prisma.productModifier.findFirst({ where: { productId: pid, modifierId: mid } })
      if (!exists) {
        await prisma.productModifier.create({ data: { productId: pid, modifierId: mid } })
      }
    }
  }
}

async function main() {
  console.log('Seeding database (auto con modificadores)...')
  const productMap = await seedCategoriesAndProducts()
  await seedModifiersAndLinks(productMap)
  console.log('Seed completo')
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error('Seed error:', e)
    await prisma.$disconnect()
    process.exit(1)
  })
