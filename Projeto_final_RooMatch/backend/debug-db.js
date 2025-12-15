
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log("--- HOUSES ---");
  const houses = await prisma.house.findMany({
    select: {
        id: true,
        name: true,
        code: true, 
        _count: {
            select: { members: true }
        }
    }
  });
  console.log(JSON.stringify(houses, null, 2));

  console.log("\n--- USERS (All) ---");
  const profiles = await prisma.profile.findMany();
  console.log("\n--- PROFILES ---");
  console.log(JSON.stringify(profiles, null, 2));

  const users = await prisma.user.findMany({
      select: {
          id: true,
          name: true,
          email: true,
          house_id: true,
          house_status: true,
          profile: { select: { name: true } }
      }
  });
  console.log(JSON.stringify(users, null, 2));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
