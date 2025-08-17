import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function upsertByNameCategory(name: string) {
  const found = await prisma.category.findFirst({ where: { name } });
  if (found) return await prisma.category.update({ where: { id: found.id }, data: { name } });
  return await prisma.category.create({ data: { name } });
}

async function upsertByNameModifier(data: { name: string; priceDelta: number; costDelta: number; stock: number; active?: boolean }) {
  const found = await prisma.modifier.findFirst({ where: { name: data.name } });
  if (found) {
    return await prisma.modifier.update({ where: { id: found.id }, data });
  }
  return await prisma.modifier.create({ data });
}

async function upsertByNameProduct(data: any) {
  const found = await prisma.product.findFirst({ where: { name: data.name } });
  if (found) {
    return await prisma.product.update({ where: { id: found.id }, data });
  }
  return await prisma.product.create({ data });
}

async function main() {
  const catBurger = await upsertByNameCategory("Hamburguesas");
  const catArepas = await upsertByNameCategory("Arepas");
  const catDrinks = await upsertByNameCategory("Bebidas");

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
    await upsertByNameProduct(p);
  }

  const modifiersData = [
    { name: "Queso extra (doble crema)", priceDelta: 2000, costDelta: 800, stock: 100, active: true },
    { name: "Tocineta extra", priceDelta: 2500, costDelta: 1200, stock: 100, active: true },
    { name: "Huevo", priceDelta: 1500, costDelta: 600, stock: 60, active: true },
    { name: "Maíz tierno", priceDelta: 1000, costDelta: 400, stock: 60, active: true },
    { name: "Salsa BBQ", priceDelta: 500, costDelta: 200, stock: 80, active: true },
    { name: "Doble carne", priceDelta: 6000, costDelta: 3500, stock: 30, active: true },
  ];

  for (const m of modifiersData) {
    await upsertByNameModifier(m);
  }

  // Enlazar todos los modifiers a todos los productos (luego los ajustas en el admin)
  const allProducts = await prisma.product.findMany();
  const allMods = await prisma.modifier.findMany();
  for (const p of allProducts) {
    for (const m of allMods) {
      await prisma.productModifier.upsert({
        where: { productId_modifierId: { productId: p.id, modifierId: m.id } },
        create: { productId: p.id, modifierId: m.id },
        update: {},
      });
    }
  }

  console.log("Seed de Arepas Burguer cargado ✅");
}

main().then(async()=>{await prisma.$disconnect()}).catch(async(e)=>{console.error(e);await prisma.$disconnect();process.exit(1)});
