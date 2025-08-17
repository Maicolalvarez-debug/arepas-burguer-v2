import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // Categorías
  const catBurger = await prisma.category.upsert({
    where: { id: 1 },
    update: { name: "Hamburguesas" },
    create: { name: "Hamburguesas" },
  });
  const catArepas = await prisma.category.upsert({
    where: { id: 2 },
    update: { name: "Arepas" },
    create: { name: "Arepas" },
  });
  const catDrinks = await prisma.category.upsert({
    where: { id: 3 },
    update: { name: "Bebidas" },
    create: { name: "Bebidas" },
  });

  // Productos (puedes editarlos luego en /admin)
  const products = [
    { name: "Sencilla", price: 10000, cost: 6000, stock: 30, description: "Carne, vegetales. Sin queso.", categoryId: catBurger.id },
    { name: "Clásica", price: 14000, cost: 8500, stock: 30, description: "Queso doble crema, papa cabello de ángel, jamón, vegetales.", categoryId: catBurger.id },
    { name: "Doble", price: 18000, cost: 11000, stock: 20, description: "Doble carne, queso.", categoryId: catBurger.id },
    { name: "BBQ", price: 16000, cost: 9500, stock: 20, description: "Salsa BBQ, tocineta, queso.", categoryId: catBurger.id },
    { name: "Arepa Rellena Pollo", price: 12000, cost: 7000, stock: 25, description: "Pollo mechado, queso.", categoryId: catArepas.id },
    { name: "Arepa Mixta", price: 14000, cost: 8500, stock: 25, description: "Carne + Pollo, queso.", categoryId: catArepas.id },
    { name: "Gaseosa 400ml", price: 4000, cost: 2200, stock: 50, description: "Sabor a elección.", categoryId: catDrinks.id },
    { name: "Gaseosa 1.5L", price: 8000, cost: 5200, stock: 20, description: "Para compartir.", categoryId: catDrinks.id },
    { name: "Jugo Natural", price: 6000, cost: 3000, stock: 20, description: "Lulo, maracuyá o mora.", categoryId: catDrinks.id },
    { name: "Agua 600ml", price: 3000, cost: 1500, stock: 40, description: "Sin gas.", categoryId: catDrinks.id },
  ];

  for (const p of products) {
    await prisma.product.upsert({
      where: { sku: p.name },
      update: { ...p },
      create: { ...p, sku: p.name },
    });
  }

  // Adicionales
  const modifiers = [
    { name: "Queso extra (doble crema)", priceDelta: 2000, costDelta: 800, stock: 100 },
    { name: "Tocineta extra", priceDelta: 2500, costDelta: 1200, stock: 100 },
    { name: "Huevo", priceDelta: 1500, costDelta: 600, stock: 60 },
    { name: "Maíz tierno", priceDelta: 1000, costDelta: 400, stock: 60 },
    { name: "Salsa BBQ", priceDelta: 500, costDelta: 200, stock: 80 },
    { name: "Doble carne", priceDelta: 6000, costDelta: 3500, stock: 30 },
  ];

  for (const m of modifiers) {
    await prisma.modifier.upsert({
      where: { id: 0 },
      update: {},
      create: m,
    });
  }

  // Enlazar todos los adicionales a todos los productos
  const allProducts = await prisma.product.findMany();
  const allMods = await prisma.modifier.findMany();
  for (const p of allProducts) {
    for (const m of allMods) {
      await prisma.productModifier.upsert({
        where: { productId_modifierId: { productId: p.id, modifierId: m.id } },
        update: {},
        create: { productId: p.id, modifierId: m.id },
      });
    }
  }

  console.log("Seed de Arepas Burguer cargado ✅");
}

main()
  .then(async () => { await prisma.$disconnect(); })
  .catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1); });
