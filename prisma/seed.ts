import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Categories
  const cats = [
    'Hamburguesas', 'Arepas', 'Perros Calientes', 'Salchipapas', 'Bebidas', 'Adicionales'
  ];

  const catMap: Record<string, number> = {};
  for (const name of cats) {
    const c = await prisma.category.upsert({
      where: { name },
      update: {},
      create: { name }
    });
    catMap[name] = c.id;
  }

  // Modifiers (Adicionales globales)
  const mods = [
    { name: 'Queso extra (doble crema)', priceDelta: 2000, costDelta: 800 },
    { name: 'Tocineta', priceDelta: 3000, costDelta: 1200 },
    { name: 'Huevo', priceDelta: 1500, costDelta: 700 },
    { name: 'Salsa tártara', priceDelta: 1000, costDelta: 300 },
    { name: 'Guacamole', priceDelta: 2500, costDelta: 1000 },
  ];

  const modIds: number[] = [];
  for (const m of mods) {
    const mm = await prisma.modifier.upsert({
      where: { name: m.name },
      update: { priceDelta: m.priceDelta, costDelta: m.costDelta, active: true },
      create: { ...m, stock: 999999, active: true }
    });
    modIds.push(mm.id);
  }

  // Products
  const products = [
    // Hamburguesas
    { name: 'Hamburguesa Clásica', description: 'Carne 120g, queso, lechuga, tomate, salsas', price: 15000, cost: 7000, category: 'Hamburguesas' },
    { name: 'Hamburguesa Doble', description: 'Doble carne, doble queso, lechuga, tomate', price: 22000, cost: 11000, category: 'Hamburguesas' },
    // Arepas
    { name: 'Arepa Sencilla', description: 'Arepa de maíz, queso, mantequilla', price: 8000, cost: 3000, category: 'Arepas' },
    { name: 'Arepa Rellena Pollo', description: 'Arepa con pollo desmechado y queso', price: 14000, cost: 6000, category: 'Arepas' },
    // Perros
    { name: 'Perro Tradicional', description: 'Salchicha, queso rallado, salsas', price: 12000, cost: 5000, category: 'Perros Calientes' },
    // Salchipapas
    { name: 'Salchipapas Clásica', description: 'Papas a la francesa con salchicha y salsas', price: 14000, cost: 6000, category: 'Salchipapas' },
    // Bebidas
    { name: 'Gaseosa 400ml', description: 'Sabor a elegir', price: 5000, cost: 2500, category: 'Bebidas' },
  ];

  for (const p of products) {
    const prod = await prisma.product.upsert({
      where: { name: p.name },
      update: { price: p.price, cost: p.cost, active: true },
      create: {
        name: p.name,
        description: p.description,
        price: p.price,
        cost: p.cost,
        imageUrl: '/logo.png',
        categoryId: catMap[p.category],
        active: true
      }
    });

    // attach all global modifiers to each food (not beverages)
    if (p.category !== 'Bebidas') {
      for (const mid of modIds) {
        await prisma.productModifier.upsert({
          where: { productId_modifierId: { productId: prod.id, modifierId: mid } },
          update: {},
          create: { productId: prod.id, modifierId: mid }
        });
      }
    }
  }

  console.log('Seed real de Arepas Burguer cargado ✅');
}

main().catch(e => {
  console.error(e);
  process.exit(1);
}).finally(async () => {
  await prisma.$disconnect();
});
