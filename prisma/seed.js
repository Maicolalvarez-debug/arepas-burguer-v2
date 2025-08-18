const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  const categoryNames = ['Hamburguesas', 'Arepas', 'Combos', 'Bebidas']
  const catMap = {}
  for (const name of categoryNames) {
    let cat = await prisma.category.findFirst({ where: { name } })
    if (!cat) cat = await prisma.category.create({ data: { name } })
    catMap[name] = cat.id
  }

  const products = [
    {
      name: 'Hamburguesa Sencilla',
      description: 'Carne de res, vegetales frescos y salsas de la casa.',
      price: 12000,
      cost: 6000,
      stock: 50,
      active: true,
      categoryId: catMap['Hamburguesas'],
    },
    {
      name: 'Hamburguesa Clásica',
      description: 'Carne, papa cabello de ángel, queso doble crema y jamón ahumado.',
      price: 16000,
      cost: 8000,
      stock: 50,
      active: true,
      categoryId: catMap['Hamburguesas'],
    },
    {
      name: 'Hamburguesa Hawaiana',
      description: 'Carne, piña asada, jamón, queso doble crema y tocineta.',
      price: 18000,
      cost: 9000,
      stock: 50,
      active: true,
      categoryId: catMap['Hamburguesas'],
    },
    {
      name: 'Arepa con Pollo y Queso',
      description: 'Arepa con pollo desmechado y queso costeño.',
      price: 8000,
      cost: 4000,
      stock: 50,
      active: true,
      categoryId: catMap['Arepas'],
    },
    {
      name: 'Coca-Cola 500ml',
      description: 'Bebida refrescante.',
      price: 3000,
      cost: 1500,
      stock: 100,
      active: true,
      categoryId: catMap['Bebidas'],
    },
    {
      name: 'Postobón 400ml',
      description: 'Bebida refrescante.',
      price: 2500,
      cost: 1200,
      stock: 100,
      active: true,
      categoryId: catMap['Bebidas'],
    },
  ]

  for (const p of products) {
    const exists = await prisma.product.findFirst({ where: { name: p.name } })
    if (!exists) await prisma.product.create({ data: p })
  }

  console.log('✅ Seed completado!')
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
