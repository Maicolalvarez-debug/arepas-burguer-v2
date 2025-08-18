import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function upsertCategory(name: string) {
  const found = await prisma.category.findFirst({ where: { name } });
  if (found) return found;
  return prisma.category.create({ data: { name } });
}
async function upsertModifier(data: { name: string; priceDelta: number; costDelta: number; stock: number; active?: boolean }) {
  const found = await prisma.modifier.findFirst({ where: { name: data.name } });
  if (found) return prisma.modifier.update({ where: { id: found.id }, data });
  return prisma.modifier.create({ data });
}
async function upsertProduct(data: any) {
  const found = await prisma.product.findFirst({ where: { name: data.name } });
  if (found) return prisma.product.update({ where: { id: found.id }, data });
  return prisma.product.create({ data });
}
async function linkProductModifiers(productId: number, modifierIds: number[]) {
  for (const mid of modifierIds) {
    await prisma.productModifier.upsert({
      where: { productId_modifierId: { productId, modifierId: mid } },
      create: { productId, modifierId: mid },
      update: {},
    });
  }
}

async function main() {
  const catArepas = await upsertCategory("Arepas");
  const catBurgers = await upsertCategory("Hamburguesas");
  const catPerros = await upsertCategory("Perros Calientes");
  const catSalchi = await upsertCategory("Salchipapas");
  const catDrinks = await upsertCategory("Bebidas");

  const modsRaw = [
    { name: "Queso doble crema", priceDelta: 2000, costDelta: 800, stock: 200, active: true },
    { name: "Tocineta", priceDelta: 2500, costDelta: 1200, stock: 200, active: true },
    { name: "Huevo", priceDelta: 1500, costDelta: 600, stock: 120, active: true },
    { name: "Maíz tierno", priceDelta: 1000, costDelta: 400, stock: 120, active: true },
    { name: "Salsa BBQ", priceDelta: 500, costDelta: 150, stock: 300, active: true },
    { name: "Salsa de ajo", priceDelta: 0, costDelta: 0, stock: 999, active: true },
    { name: "Doble carne", priceDelta: 6000, costDelta: 3500, stock: 80, active: true },
    { name: "Papas cabello de ángel", priceDelta: 1000, costDelta: 400, stock: 200, active: true }
  ];
  const mods = [];
  for (const m of modsRaw) mods.push(await upsertModifier(m));
  const M = (name: string) => mods.find(x => x.name == name)!.id;

  const arepas = [
    { name: "Arepa Sencilla", price: 10000, cost: 6000, stock: 50, description: "Arepa con carne desmechada y vegetales.", categoryId: catArepas.id, imageUrl: "", mods: [M("Queso doble crema"), M("Maíz tierno"), M("Salsa de ajo")]},
    { name: "Arepa Mixta", price: 14000, cost: 8500, stock: 40, description: "Carne + Pollo, queso.", categoryId: catArepas.id, imageUrl: "", mods: [M("Queso doble crema"), M("Maíz tierno"), M("Salsa BBQ")]},
    { name: "Arepa Rellena Pollo", price: 12000, cost: 7200, stock: 40, description: "Pollo mechado, queso.", categoryId: catArepas.id, imageUrl: "", mods: [M("Queso doble crema"), M("Maíz tierno")]},
  ];
  const burgers = [
    { name: "Hamburguesa Clásica", price: 14000, cost: 8500, stock: 40, description: "Queso, papa cabello de ángel, jamón, vegetales.", categoryId: catBurgers.id, imageUrl: "", mods: [M("Queso doble crema"), M("Tocineta"), M("Papas cabello de ángel"), M("Salsa BBQ")]},
    { name: "Hamburguesa Doble", price: 18000, cost: 11000, stock: 25, description: "Doble carne, doble queso.", categoryId: catBurgers.id, imageUrl: "", mods: [M("Queso doble crema"), M("Doble carne"), M("Tocineta")]},
    { name: "Hamburguesa BBQ", price: 16000, cost: 9500, stock: 25, description: "Salsa BBQ, tocineta, queso.", categoryId: catBurgers.id, imageUrl: "", mods: [M("Queso doble crema"), M("Tocineta"), M("Salsa BBQ")]},
  ];
  const perros = [
    { name: "Perro Sencillo", price: 10000, cost: 6000, stock: 30, description: "Pan, salchicha, salsas.", categoryId: catPerros.id, imageUrl: "", mods: [M("Queso doble crema"), M("Papas cabello de ángel"), M("Salsa de ajo")]},
    { name: "Perro Especial", price: 14000, cost: 8000, stock: 25, description: "Queso, tocineta, papas cabello de ángel.", categoryId: catPerros.id, imageUrl: "", mods: [M("Queso doble crema"), M("Tocineta"), M("Papas cabello de ángel")]},
  ];
  const salchi = [
    { name: "Salchipapa Sencilla", price: 12000, cost: 7000, stock: 20, description: "Papas + salchicha + salsas.", categoryId: catSalchi.id, imageUrl: "", mods: [M("Queso doble crema"), M("Salsa de ajo"), M("Salsa BBQ")]},
    { name: "Salchipapa Mixta", price: 16000, cost: 9500, stock: 20, description: "Papas + salchicha + carne + queso.", categoryId: catSalchi.id, imageUrl: "", mods: [M("Queso doble crema"), M("Salsa de ajo"), M("Tocineta")]},
  ];
  const drinks = [
    { name: "Gaseosa 400ml", price: 4000, cost: 2200, stock: 60, description: "Sabor a elección.", categoryId: catDrinks.id, imageUrl: "" , mods: []},
    { name: "Gaseosa 1.5L", price: 8000, cost: 5200, stock: 30, description: "Para compartir.", categoryId: catDrinks.id, imageUrl: "" , mods: []},
    { name: "Agua 600ml", price: 3000, cost: 1500, stock: 80, description: "Sin gas.", categoryId: catDrinks.id, imageUrl: "" , mods: []},
  ];

  const all = [...arepas, ...burgers, ...perros, ...salchi, ...drinks];
  for (const p of all) {
    const { mods: mIds, ...base } = p;
    const saved = await upsertProduct(base);
    await linkProductModifiers(saved.id, mIds);
  }

  console.log("Seed real de Arepas Burguer cargado ✅");
}

main().then(async()=>{await prisma.$disconnect()}).catch(async(e)=>{console.error(e);await prisma.$disconnect();process.exit(1)});
