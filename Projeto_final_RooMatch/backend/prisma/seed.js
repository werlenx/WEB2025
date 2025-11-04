import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const ADMIN_EMAIL = "werlen@example.com";
  const COMMON_PASSWORD = "123";

  const passwordHash = await bcrypt.hash(COMMON_PASSWORD, 10);

  const adminProfile = await prisma.profile.upsert({
    where: { name: "ADMIN" },
    update: {},
    create: { name: "ADMIN" },
  });

  const commonProfile = await prisma.profile.upsert({
    where: { name: "COMMON" },
    update: {},
    create: { name: "COMMON" },
  });

  const userWerlen = await prisma.user.upsert({
    where: { email: ADMIN_EMAIL },
    update: { password_hash: passwordHash, profile_id: adminProfile.id },
    create: {
      name: "Werlen (Admin)",
      email: ADMIN_EMAIL,
      password_hash: passwordHash,
      profile_id: adminProfile.id,
      house_status: "PENDING",
      score: 150,
      star_avg: 3.0,
      avatar_color: "bg-indigo-400",
    },
  });

  const houseAlpha = await prisma.house.upsert({
    where: { code: "ALPHA7" },
    update: { admin_id: userWerlen.id },
    create: {
      name: "República Alpha",
      code: "ALPHA7",
      admin_id: userWerlen.id,
    },
  });

  await prisma.user.update({
    where: { id: userWerlen.id },
    data: {
      house_id: houseAlpha.id,
      house_status: "APPROVED",
    },
  });

  /* usuarios comuns */

  const userMarcela = await prisma.user.upsert({
    where: { email: "marcela@example.com" },
    update: {
      password_hash: passwordHash,
      profile_id: commonProfile.id,
      house_id: houseAlpha.id,
    },
    create: {
      name: "Marcela",
      email: "marcela@example.com",
      password_hash: passwordHash,
      profile_id: commonProfile.id,
      house_id: houseAlpha.id,
      house_status: "APPROVED",
      score: 100,
      star_avg: 2.5,
      avatar_color: "bg-pink-400",
    },
  });

  const userDavid = await prisma.user.upsert({
    where: { email: "david@example.com" },
    update: {
      password_hash: passwordHash,
      profile_id: commonProfile.id,
      house_id: houseAlpha.id,
    },
    create: {
      name: "David",
      email: "david@example.com",
      password_hash: passwordHash,
      profile_id: commonProfile.id,
      house_id: houseAlpha.id,
      house_status: "APPROVED",
      score: 75,
      star_avg: 1.8,
      avatar_color: "bg-blue-400",
    },
  });

  await prisma.punishment.upsert({
    where: { id: 1 },
    update: { house_id: houseAlpha.id },
    create: {
      id: 1,
      house_id: houseAlpha.id,
      description: "Lavar o chão da cozinha hoje e amanhã. (-20pts)",
      penalty_points: 20,
      is_active: true,
    },
  });

  await prisma.punishment.upsert({
    where: { id: 2 },
    update: { house_id: houseAlpha.id },
    create: {
      id: 2,
      house_id: houseAlpha.id,
      description: "Comprar os itens de limpeza que faltam. (-10pts)",
      penalty_points: 10,
      is_active: true,
    },
  });

  const getDayISO = (offset = 0) => {
    const d = new Date();
    d.setDate(d.getDate() + offset);
    d.setHours(18, 0, 0, 0);
    return d;
  };

  await prisma.task.upsert({
    where: { id: 101 },
    update: { house_id: houseAlpha.id },
    create: {
      id: 101,
      house_id: houseAlpha.id,
      title: "Limpeza do Banheiro",
      description: "Completo, incluindo box.",
      frequency: "WEEKLY",
      points: 20,
      responsible_id: userMarcela.id,
      due_date: getDayISO(-0.5),
      status: "AWAITING_REVIEW",
      can_buy_out: true,
    },
  });

  await prisma.task.upsert({
    where: { id: 103 },
    update: { house_id: houseAlpha.id },
    create: {
      id: 103,
      house_id: houseAlpha.id,
      title: "Lavar a Louça",
      description: "Louça da noite.",
      frequency: "DAILY",
      points: 10,
      responsible_id: userDavid.id,
      due_date: getDayISO(0.5),
      status: "PENDING",
      can_buy_out: true,
    },
  });
}

main()
  .catch((e) => {
    console.error("Erro no script de seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
