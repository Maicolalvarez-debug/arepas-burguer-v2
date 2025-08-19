// prisma/seed.ts
import { PrismaClient, Role } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = "admin@arepas.com";
  const password = await hash("CambiarEstaClave123!", 10);

  await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      name: "Admin",
      password,
      role: Role.ADMIN,
    },
  });

  console.log("Admin creado:", email);
}

main().finally(() => prisma.$disconnect());
