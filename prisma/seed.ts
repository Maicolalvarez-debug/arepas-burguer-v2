import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const catBurger = await prisma.category.upsert({ where: { id: 1 }, update: { name: "Hamburguesas" }, create: { name: "Hamburguesas" } });
  const catArepas = await prisma.category.upsert({ where: { id: 2 }, update: { name: "Arepas" }, create: { name: "Arepas" } });
  const catDrinks = await prisma.category.upsert({ where: { id: 3 }, update: { name: "Bebidas" }, create: { name: "Bebidas" } });

  const products = [
    { name: "Sencilla", price: 10000, cost: 6000, stock: 30, description: "Carne, vegetales. Sin queso.", categoryId: catBurger.id, imageUrl: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&q=80" },
    { name: "Clásica", price: 14000, cost: 8500, stock: 30, description: "Queso doble crema, papa cabello de ángel, jamón, vegetales.", categoryId: catBurger.id, imageUrl: "https://images.unsplash.com/photo-1550317138-10000687a72b?w=800&q=80" },
    { name: "Doble", price: 18000, cost: 11000, stock: 20, description: "Doble carne, queso.", categoryId: catBurger.id, imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80" },
    { name: "BBQ", price: 16000, cost: 9500, stock: 20, description: "Salsa BBQ, tocineta, queso.", categoryId: catBurger.id, imageUrl: "https://images.unsplash.com/photo-1499028344343-cd173ffc68a9?w=800&q=80" },
    { name: "Arepa Rellena Pollo", price: 12000, cost: 7000, stock: 25, description: "Pollo mechado, queso.", categoryId: catArepas.id, imageUrl: "https://images.unsplash.com/photo-1625944529459-5d43c244bfe3?w=800&q=80" },
    { name: "Arepa Mixta", price: 14000, cost: 8500, stock: 25, description: "Carne + Pollo, queso.", categoryId: catArepas.id, imageUrl: "https://images.unsplash.com/photo-1572552635156-69f3db2aa3b6?w=800&q=80" },
    { name: "Gaseosa 400ml", price: 4000, cost: 2200, stock: 50, description: "Sabor a elección.", categoryId: catDrinks.id, imageUrl: "https://images.unsplash.com/photo-1513558161293-c167135b8f59?w=800&q=80" },
    { name: "Gaseosa 1.5L", price: 8000, cost: 5200, stock: 20, description: "Para compartir.", categoryId: catDrinks.id, imageUrl: "https://images.unsplash.com/photo-1627662057410-2b2906b22351?w=800&q=80" },
    { name: "Jugo Natural", price: 6000, cost: 3000, stock: 20, description: "Lulo, maracuyá o mora.", categoryId: catDrinks.id, imageUrl: "https://images.unsplash.com/photo-1542444459-db63c12e9d1c?w=800&q=80" },
    { name: "Agua 600ml", price: 3000, cost: 1500, stock: 40, description: "Sin gas.", categoryId: catDrinks.id, imageUrl: "https://images.unsplash.com/photo-1561043433-aaf687c4cf4e?w=800&q=80" },
  ];

  for (const p of products) {
    await prisma.product.upsert({
      where: { sku: p.name },
      update: { ...p },
      create: { ...p, sku: p.name },
    });
  }

  const modifiers = [
    { name: "Queso extra (doble crema)", priceDelta: 2000, costDelta: 800, stock: 100 },
    { name: "Tocineta extra", priceDelta: 2500, costDelta: 1200, stock: 100 },
    { name: "Huevo", priceDelta: 1500, costDelta: 600, stock: 60 },
    { name: "Maíz tierno", priceDelta: 1000, costDelta: 400, stock: 60 },
    { name: "Salsa BBQ", priceDelta: 500, costDelta: 200, stock: 80 },
    { name: "Doble carne", priceDelta: 6000, costDelta: 3500, stock: 30 },
  ];

  for (const m of modifiers) {
    await prisma.modifier.upsert({ where: { name: m.name }, update: m, create: m });
  }

  // Por defecto, enlazar todos los modifiers a todos los productos (luego puedes quitar/poner por producto en el admin)
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
