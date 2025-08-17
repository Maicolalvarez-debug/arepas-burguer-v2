/* eslint-disable no-console */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Cargando seed real de Arepas Burguer…');

  // --- CONFIG BÁSICA ---
  // Usa el mismo WhatsApp que me diste
  const WHATSAPP = '3118651391';
  const BASE_URL = process.env.BASE_URL || null;
  await prisma.config.upsert({
    where: { id: 1 },
    update: { whatsapp: WHATSAPP, baseUrl: BASE_URL },
    create: { id: 1, whatsapp: WHATSAPP, baseUrl: BASE_URL },
  });

  // --- CATEGORÍAS ---
  const categoryNames = [
    'Arepas',
    'Hamburguesas',
    'Perros',
    'Salchipapas',
    'Bebidas',
  ];

  const categories: Record<string, number> = {};
  for (const name of categoryNames) {
    const up = await prisma.category.upsert({
      where: { name },
      update: {},
      create: { name },
    });
    categories[name] = up.id;
  }

  // --- ADICIONALES (MODIFIERS) ---
  // Nota: en tu schema, Modifier.name es único → usamos upsert por name.
  const modifiersData = [
    { name: 'Queso doble crema', priceDelta: 2000, costDelta: 800, stock: 100, imageUrl: null },
    { name: 'Tocineta',          priceDelta: 2500, costDelta: 900, stock: 100, imageUrl: null },
    { name: 'Salsa de ajo',      priceDelta: 0,    costDelta: 200, stock: 200, imageUrl: null },
    { name: 'Maíz tierno',       priceDelta: 1500, costDelta: 700, stock: 100, imageUrl: null },
    { name: 'Carne extra',       priceDelta: 4500, costDelta: 2500,stock: 100, imageUrl: null },
    { name: 'Pollo desmechado',  priceDelta: 3500, costDelta: 1800,stock: 100, imageUrl: null },
    { name: 'Papa ripio',        priceDelta: 1000, costDelta: 300, stock: 100, imageUrl: null },
    { name: 'Huevo',             priceDelta: 1500, costDelta: 700, stock: 100, imageUrl: null },
    { name: 'Queso amarillo',    priceDelta: 2000, costDelta: 800, stock: 100, imageUrl: null },
  ];

  const modifiers: Record<string, number> = {};
  for (const m of modifiersData) {
    const up = await prisma.modifier.upsert({
      where: { name: m.name },
      update: {
        priceDelta: m.priceDelta,
        costDelta: m.costDelta,
        stock: m.stock,
        active: true,
        imageUrl: m.imageUrl || null,
      },
      create: {
        name: m.name,
        priceDelta: m.priceDelta,
        costDelta: m.costDelta,
        stock: m.stock,
        active: true,
        imageUrl: m.imageUrl || null,
      },
    });
    modifiers[m.name] = up.id;
  }

  // Helper para crear producto si no existe (por nombre + categoría)
  async function ensureProduct(opts: {
    name: string;
    category: string;
    price: number;   // en pesos
    cost: number;    // en pesos
    stock?: number;
    imageUrl?: string | null;
    description?: string | null;
    order?: number;
    modifierNames?: string[]; // nombres de los adicionales a asociar
  }) {
    const categoryId = categories[opts.category];
    if (!categoryId) throw new Error(`Categoría no encontrada: ${opts.category}`);

    const existing = await prisma.product.findFirst({
      where: { name: opts.name, categoryId },
      select: { id: true },
    });
    let productId: number;

    if (existing) {
      const up = await prisma.product.update({
        where: { id: existing.id },
        data: {
          price: opts.price,
          cost: opts.cost,
          stock: opts.stock ?? 100,
          imageUrl: opts.imageUrl ?? null,
          description: opts.description ?? null,
          order: opts.order ?? 0,
          active: true,
          categoryId,
        },
      });
      productId = up.id;
    } else {
      const created = await prisma.product.create({
        data: {
          name: opts.name,
          price: opts.price,
          cost: opts.cost,
          stock: opts.stock ?? 100,
          imageUrl: opts.imageUrl ?? null,
          description: opts.description ?? null,
          order: opts.order ?? 0,
          active: true,
          categoryId,
        },
      });
      productId = created.id;
    }

    // Enlazar modifiers (evita duplicar enlaces)
    if (opts.modifierNames?.length) {
      for (const mn of opts.modifierNames) {
        const modId = modifiers[mn];
        if (!modId) continue;
        const link = await prisma.productModifier.findFirst({
          where: { productId, modifierId: modId },
          select: { id: true },
        });
        if (!link) {
          await prisma.productModifier.create({
            data: { productId, modifierId: modId },
          });
        }
      }
    }
  }

  // --- PRODUCTOS REALES SUGERIDOS ---
  // Puedes ajustar precios/fotos luego desde Admin.
  // Coloca tus imágenes en /public y usa rutas tipo "/arepa-reina-pepiada.jpg".
  // Si no tienes imagen aún, queda en null.
  const P = (v: number) => v; // azúcar visual para precios

  // AREPAS
  await ensureProduct({
    name: 'Arepa Campeona',
    category: 'Arepas',
    price: P(16000),
    cost:  P(9000),
    imageUrl: null,
    description: 'Arepa con carne, pollo, queso y salsas de la casa.',
    order: 1,
    modifierNames: ['Queso doble crema', 'Tocineta', 'Salsa de ajo', 'Maíz tierno', 'Huevo'],
  });
  await ensureProduct({
    name: 'Arepa Reina Pepiada',
    category: 'Arepas',
    price: P(15000),
    cost:  P(8500),
    imageUrl: null,
    description: 'Clásica reina pepiada con pollo y aguacate.',
    order: 2,
    modifierNames: ['Queso amarillo', 'Queso doble crema', 'Salsa de ajo'],
  });
  await ensureProduct({
    name: 'Arepa Sencilla',
    category: 'Arepas',
    price: P(10000),
    cost:  P(5500),
    imageUrl: null,
    description: 'Arepa a la plancha con queso.',
    order: 3,
    modifierNames: ['Queso doble crema', 'Maíz tierno', 'Salsa de ajo'],
  });

  // HAMBURGUESAS
  await ensureProduct({
    name: 'Burguer Clásica',
    category: 'Hamburguesas',
    price: P(18000),
    cost:  P(10500),
    imageUrl: null,
    description: 'Carne de res 120g, queso, lechuga, tomate y salsas.',
    order: 1,
    modifierNames: ['Tocineta', 'Queso amarillo', 'Carne extra', 'Salsa de ajo'],
  });
  await ensureProduct({
    name: 'Burguer Doble',
    category: 'Hamburguesas',
    price: P(24000),
    cost:  P(15000),
    imageUrl: null,
    description: 'Doble carne, doble queso, + salsas.',
    order: 2,
    modifierNames: ['Tocineta', 'Queso amarillo', 'Carne extra'],
  });
  await ensureProduct({
    name: 'Burguer Pollo Crispy',
    category: 'Hamburguesas',
    price: P(22000),
    cost:  P(13000),
    imageUrl: null,
    description: 'Pechuga crispy, queso, vegetales y salsas.',
    order: 3,
    modifierNames: ['Queso doble crema', 'Salsa de ajo'],
  });

  // PERROS
  await ensureProduct({
    name: 'Perro Clásico',
    category: 'Perros',
    price: P(12000),
    cost:  P(6500),
    imageUrl: null,
    description: 'Salchicha, papa ripio, salsas y queso.',
    order: 1,
    modifierNames: ['Tocineta', 'Queso amarillo', 'Papa ripio', 'Salsa de ajo'],
  });
  await ensureProduct({
    name: 'Perro Americano',
    category: 'Perros',
    price: P(14000),
    cost:  P(8000),
    imageUrl: null,
    description: 'Con tocineta, queso y maíz tierno.',
    order: 2,
    modifierNames: ['Tocineta', 'Queso doble crema', 'Maíz tierno'],
  });

  // SALCHIPAPAS
  await ensureProduct({
    name: 'Salchipapas Clásicas',
    category: 'Salchipapas',
    price: P(16000),
    cost:  P(9000),
    imageUrl: null,
    description: 'Papas a la francesa con salchicha y salsas.',
    order: 1,
    modifierNames: ['Tocineta', 'Queso doble crema', 'Salsa de ajo'],
  });
  await ensureProduct({
    name: 'Salchipapas Mixtas',
    category: 'Salchipapas',
    price: P(20000),
    cost:  P(12000),
    imageUrl: null,
    description: 'Con pollo y res en tiras.',
    order: 2,
    modifierNames: ['Tocineta', 'Pollo desmechado', 'Queso doble crema'],
  });

  // BEBIDAS
  await ensureProduct({
    name: 'Gaseosa 400ml',
    category: 'Bebidas',
    price: P(5000),
    cost:  P(2500),
    imageUrl: null,
    description: 'Sabor a elección.',
    order: 1,
    modifierNames: [],
  });
  await ensureProduct({
    name: 'Limonada',
    category: 'Bebidas',
    price: P(7000),
    cost:  P(3000),
    imageUrl: null,
    description: 'Refrescante.',
    order: 2,
    modifierNames: [],
  });

  console.log('✅ Seed real cargado con éxito');
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
