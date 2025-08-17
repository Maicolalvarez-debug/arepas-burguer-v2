
/* eslint-disable no-console */
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  console.log('🌱 Cargando seed real de Arepas Burguer…');
  const WHATSAPP = '3118651391';
  const BASE_URL = process.env.BASE_URL || null;
  await prisma.config.upsert({ where: { id: 1 }, update: { whatsapp: WHATSAPP, baseUrl: BASE_URL }, create: { id: 1, whatsapp: WHATSAPP, baseUrl: BASE_URL } });
  const categoryNames = ['Arepas','Hamburguesas','Perros','Salchipapas','Bebidas'];
  const categories: Record<string, number> = {};
  for (const name of categoryNames) { const up = await prisma.category.upsert({ where: { name }, update: {}, create: { name } }); categories[name] = up.id; }
  const mods = ['Queso doble crema','Tocineta','Salsa de ajo','Maíz tierno','Carne extra','Pollo desmechado','Papa ripio','Huevo','Queso amarillo'];
  const prices = [2000,2500,0,1500,4500,3500,1000,1500,2000];
  for (let i=0;i<mods.length;i++){ await prisma.modifier.upsert({ where:{ name: mods[i] }, update:{ priceDelta: prices[i], stock:100, active:true }, create:{ name: mods[i], priceDelta: prices[i], stock:100, active:true } }); }
  const ensure = async (name:string,category:string,price:number,cost:number,desc:string) => {
    const categoryId = categories[category];
    const exist = await prisma.product.findFirst({ where: { name, categoryId }, select:{id:true} });
    if (exist) { await prisma.product.update({ where: { id: exist.id }, data:{ price, cost, description:desc, stock:100, active:true } }); }
    else { await prisma.product.create({ data:{ name, price, cost, description:desc, stock:100, active:true, categoryId } }); }
  };
  await ensure('Arepa Campeona','Arepas',16000,9000,'Arepa con carne, pollo, queso y salsas');
  await ensure('Arepa Reina Pepiada','Arepas',15000,8500,'Clásica con pollo y aguacate');
  await ensure('Arepa Sencilla','Arepas',10000,5500,'Arepa a la plancha con queso');
  await ensure('Burguer Clásica','Hamburguesas',18000,10500,'Carne 120g, queso, vegetales');
  await ensure('Burguer Doble','Hamburguesas',24000,15000,'Doble carne y queso');
  await ensure('Burguer Pollo Crispy','Hamburguesas',22000,13000,'Pechuga crispy y salsas');
  await ensure('Perro Clásico','Perros',12000,6500,'Salchicha, papa ripio, salsas y queso');
  await ensure('Perro Americano','Perros',14000,8000,'Con tocineta y maíz');
  await ensure('Salchipapas Clásicas','Salchipapas',16000,9000,'Papas con salchicha y salsas');
  await ensure('Salchipapas Mixtas','Salchipapas',20000,12000,'Con pollo y res');
  await ensure('Gaseosa 400ml','Bebidas',5000,2500,'Sabor a elección');
  await ensure('Limonada','Bebidas',7000,3000,'Refrescante');
  console.log('✅ Seed real cargado con éxito');
}
main().catch(e=>{console.error('❌ Error en seed:',e);process.exit(1)}).finally(async()=>{await prisma.$disconnect()});
