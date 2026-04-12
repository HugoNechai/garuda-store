const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  await prisma.product.create({
    data: {
      name: "Nine Pro Feather",
      price: 1999,
      description: "High quality goose feather shuttlecock",
      images: {
        create: [
          { imageUrl: "https://via.placeholder.com/300", isMain: true },
          { imageUrl: "https://via.placeholder.com/300" },
        ],
      },
    },
  });

  await prisma.product.create({
    data: {
      name: "Nine Speed 77",
      price: 1499,
      description: "Balanced speed and durability",
      images: {
        create: [
          { imageUrl: "https://via.placeholder.com/300", isMain: true },
        ],
      },
    },
  });

  await prisma.product.create({
    data: {
      name: "Nine Training Pack",
      price: 999,
      description: "Affordable training shuttlecocks",
      images: {
        create: [
          { imageUrl: "https://via.placeholder.com/300", isMain: true },
        ],
      },
    },
  });
}

main()
  .then(() => console.log("Seed done"))
  .catch(console.error)
  .finally(() => prisma.$disconnect());