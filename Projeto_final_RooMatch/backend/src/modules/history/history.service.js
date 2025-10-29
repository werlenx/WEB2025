import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

export class HistoryService {
  constructor(prisma) {
    this.prisma = prisma;
  }

  /**
   * Lista todos os eventos do histórico de uma casa.
   */
  async getHistory(houseId) {
    return this.prisma.history.findMany({
      where: { house_id: houseId },
      include: {
        user: {
          // Inclui detalhes básicos do usuário envolvido (se houver)
          select: { id: true, name: true, avatar_color: true },
        },
      },
      orderBy: { created_at: "desc" }, // Mostra os eventos mais recentes primeiro
      take: 50, // Limita o histórico para não sobrecarregar
    });
  }
}
