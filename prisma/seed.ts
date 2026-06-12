import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const project = await prisma.project.create({
    data: {
      name: "Demo: 200 Collins Street",
      propertyAddress: "200 Collins Street, Melbourne VIC 3000",
      propertyType: "office",
      state: "VIC",
      purchasePrice: 45_000_000,
      status: "draft",
    },
  });

  console.log(`Created demo project: ${project.id}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
