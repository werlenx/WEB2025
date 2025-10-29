import { PunishmentService } from "./punishment.service.js";

export class PunishmentController {
  constructor(fastify) {
    this.fastify = fastify;
    this.punishmentService = new PunishmentService(fastify.prisma);
  }

  // GET /punishments/
  async getPunishmentsHandler(request, reply) {
    const houseId = request.user && request.user.houseId;

    if (!houseId) {
      return reply.code(400).send({ message: "User must belong to a house." });
    }

    try {
      const punishments = await this.punishmentService.getPunishments(houseId);

      reply.code(200).send(punishments);
    } catch (error) {
      this.fastify.log.error(error);
      reply.code(500).send({ message: "Could not fetch punishments." });
    }
  }

  // POST /punishments/apply
  async applyPunishmentHandler(request, reply) {
    const { punishmentId, targetUserId } = request.body;
    const houseId = request.user && request.user.houseId;
    const userRole = request.user && request.user.role;

    if (!houseId) {
      return reply.code(400).send({ message: "User must belong to a house." });
    }

    // 1. Regra de Negócio: Somente o ADMIN pode aplicar punições.
    if (userRole !== "ADMIN") {
      return reply
        .code(403)
        .send({
          message: "Only the house administrator can apply punishments.",
        });
    }

    try {
      const { updatedUser, punishment } =
        await this.punishmentService.applyPunishment(
          punishmentId,
          targetUserId,
          houseId
        );

      reply.code(200).send({
        targetUser: {
          id: updatedUser.id,
          name: updatedUser.name,
          newScore: updatedUser.score,
        },
        punishment: {
          id: punishment.id,
          description: punishment.description,
          penaltyPoints: punishment.penalty_points,
        },
        message: `Punishment applied. ${updatedUser.name}'s score reduced by ${punishment.penalty_points}.`,
      });
    } catch (error) {
      this.fastify.log.error(error);
      if (error.message.includes("Punishment or target user not found")) {
        return reply.code(404).send({ message: error.message });
      }
      reply.code(500).send({ message: "Could not apply punishment." });
    }
  }
}
