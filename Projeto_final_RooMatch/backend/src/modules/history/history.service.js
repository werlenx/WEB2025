import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

export class HistoryService {
  constructor(prisma) {
    this.prisma = prisma;
  }

  async getHistory(houseId) {
    return this.prisma.history.findMany({
      where: { house_id: houseId },
      include: {
        user: {
          select: { id: true, name: true, avatar_color: true },
        },
      },
      orderBy: { created_at: "desc" },
      take: 50,
    });
  }
}
