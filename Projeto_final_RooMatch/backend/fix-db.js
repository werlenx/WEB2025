
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log("Deleting debug users...");
  await prisma.user.deleteMany({
      where: {
          email: {
              in: ["owner@example.com", "create_fail@example.com"]
          }
      }
  });
  console.log("Debug users deleted.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
