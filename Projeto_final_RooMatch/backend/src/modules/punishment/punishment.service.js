import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

export class PunishmentService {
  constructor(prisma) {
    this.prisma = prisma;
  }

  /**
   * Lista todas as punições ativas de uma casa.
   */
  async getPunishments(houseId) {
    return this.prisma.punishment.findMany({
      where: {
        house_id: houseId,
        is_active: true, // Mostra apenas punições que podem ser aplicadas
      },
      orderBy: { penalty_points: "desc" },
    });
  }

  /**
   * Aplica uma punição a um usuário, decrementa o score e registra no histórico.
   */
  async applyPunishment(punishmentId, targetUserId, houseId) {
    return this.prisma.$transaction(async (tx) => {
      // 1. Busca a punição e o usuário alvo, garantindo que ambos pertencem à casa
      const punishment = await tx.punishment.findUnique({
        where: { id: punishmentId, house_id: houseId, is_active: true },
      });

      const targetUser = await tx.user.findUnique({
        where: {
          id: targetUserId,
          house_id: houseId,
          house_status: "APPROVED",
        },
      });

      if (!punishment || !targetUser) {
        throw new Error("Punishment or target user not found or inactive.");
      }

      const penalty = punishment.penalty_points;

      // 2. Decrementa o score do usuário
      const updatedUser = await tx.user.update({
        where: { id: targetUserId },
        data: {
          score: { decrement: penalty },
        },
        select: { id: true, name: true, score: true },
      });

      // 3. Registra o evento no histórico
      await tx.history.create({
        data: {
          house_id: houseId,
          user_id: targetUserId,
          event_type: "PUNISHMENT_APPLIED",
          description: `Punishment: '${punishment.description}' applied by Admin. Score reduced by ${penalty}.`,
        },
      });

      return { updatedUser, punishment };
    });
  }
}
