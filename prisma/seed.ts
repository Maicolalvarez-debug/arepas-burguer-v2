import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
async function main() {
  const cat = await prisma.category.upsert({
    where: { id: 1 },
    update: {},
    create: { name: "Hamburguesas" },
  });
  const burgers = [
    { name: "Sencilla", price: 10000, cost: 6000, stock: 50, description: "Carne, tomate, cebolla, lechuga. Sin queso." },
    { name: "Clásica", price: 14000, cost: 8500, stock: 50, description: "Papa cabello de ángel, queso doble crema, jamón, vegetales." },
  ];
  for (const b of burgers) {
    await prisma.product.upsert({
      where: { sku: b.name },
      update: {},
      create: { ...b, sku: b.name, categoryId: cat.id },
    });
  }
  const mods = [
    { name: "Queso extra (doble crema)", priceDelta: 2000, costDelta: 800, stock: 100 },
    { name: "Tocineta extra", priceDelta: 2500, costDelta: 1200, stock: 100 },
  ];
  for (const m of mods) {
    await prisma.modifier.upsert({
      where: { id: 0 }, // no-unique, just create
      update: {},
      create: m,
    });
  }
  const products = await prisma.product.findMany();
  const modifiers = await prisma.modifier.findMany();
  for (const p of products) {
    for (const m of modifiers) {
      await prisma.productModifier.upsert({
        where: { productId_modifierId: { productId: p.id, modifierId: m.id } },
        update: {},
        create: { productId: p.id, modifierId: m.id },
      });
    }
  }
  console.log("Seed OK");
}
main().then(()=>prisma.$disconnect());
