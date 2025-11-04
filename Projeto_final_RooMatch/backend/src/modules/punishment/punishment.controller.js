import { PunishmentService } from "./punishment.service.js";

export class PunishmentController {
  constructor(fastify) {
    this.fastify = fastify;
    this.punishmentService = new PunishmentService(fastify.prisma);
  }

  _validateContext(request, reply, requiresAdmin = false) {
    const houseId = request.user?.houseId;
    const userRole = request.user?.role;

    if (!houseId) {
      reply.code(400).send({ message: "User must belong to a house." });
      return false;
    }

    if (requiresAdmin && userRole !== "ADMIN") {
      reply.code(403).send({
        message: "Only the house administrator can manage punishments.",
      });
      return false;
    }

    return { houseId, userRole };
  }

  async getPunishmentsHandler(request, reply) {
    const context = this._validateContext(request, reply);
    if (!context) return;
    const { houseId } = context;

    try {
      const punishments = await this.punishmentService.getPunishments(houseId);
      reply.code(200).send(punishments);
    } catch (error) {
      this.fastify.log.error(error);
      reply.code(500).send({ message: "Could not fetch punishments." });
    }
  }

  async applyPunishmentHandler(request, reply) {
    const context = this._validateContext(request, reply, true);
    if (!context) return;
    const { houseId } = context;

    const { punishmentId, targetUserId } = request.body;

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

  async createPunishmentHandler(request, reply) {
    const context = this._validateContext(request, reply, true);
    if (!context) return;
    const { houseId } = context;

    const { description, penaltyPoints } = request.body;

    try {
      const newPunishment = await this.punishmentService.createPunishment(
        houseId,
        description,
        penaltyPoints
      );

      reply.code(201).send({
        id: newPunishment.id,
        description: newPunishment.description,
        message: "Punishment added to the catalog.",
      });
    } catch (error) {
      this.fastify.log.error(error);
      reply.code(500).send({ message: "Could not create punishment." });
    }
  }

  async updatePunishmentHandler(request, reply) {
    const context = this._validateContext(request, reply, true);
    if (!context) return;
    const { houseId } = context;

    const { punishmentId } = request.params;
    const { description, penaltyPoints, isActive } = request.body;

    try {
      const updatedPunishment = await this.punishmentService.updatePunishment(
        punishmentId,
        houseId,
        description,
        penaltyPoints,
        isActive
      );

      reply.code(200).send({
        id: updatedPunishment.id,
        description: updatedPunishment.description,
        message: "Punishment updated successfully.",
      });
    } catch (error) {
      this.fastify.log.error(error);
      if (error.message.includes("Punishment not found")) {
        return reply.code(404).send({ message: error.message });
      }
      reply.code(500).send({ message: "Could not update punishment." });
    }
  }

  async deletePunishmentHandler(request, reply) {
    const context = this._validateContext(request, reply, true);
    if (!context) return;
    const { houseId } = context;

    const { punishmentId } = request.params;

    try {
      const deletedPunishment = await this.punishmentService.deletePunishment(
        punishmentId,
        houseId
      );

      reply.code(200).send({
        id: deletedPunishment.id,
        description: deletedPunishment.description,
        message: "Punishment successfully deleted from the catalog.",
      });
    } catch (error) {
      this.fastify.log.error(error);
      if (error.message.includes("Punishment not found")) {
        return reply.code(404).send({ message: error.message });
      }
      reply.code(500).send({ message: "Could not delete punishment." });
    }
  }
}
