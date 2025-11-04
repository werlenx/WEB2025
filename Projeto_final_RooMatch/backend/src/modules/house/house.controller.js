import { HouseService } from "./house.service.js";
import { AuthService } from "../auth/auth.service.js";

export class HouseController {
  constructor(fastify) {
    this.fastify = fastify;
    this.houseService = new HouseService(fastify.prisma);
    this.authService = new AuthService(fastify.prisma);
  }

  async createHouseHandler(request, reply) {
    const { houseName } = request.body || {};
    const userId = request.user && (request.user.id || request.user.sub);

    if (!userId) {
      return reply.code(401).send({ message: "Unauthorized" });
    }

    const user = await this.fastify.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) return reply.code(404).send({ message: "User not found" });
    if (user.house_id)
      return reply
        .code(400)
        .send({ message: "User already belongs to a house" });

    try {
      const newHouse = await this.houseService.createHouse(houseName, userId);
      reply.code(201).send({
        id: newHouse.id,
        name: newHouse.name,
        code: newHouse.code,
        message: "House created",
      });
    } catch (error) {
      this.fastify.log.error(error);
      reply.code(500).send({ message: "Could not create house" });
    }
  }

  async joinHouseHandler(request, reply) {
    const { houseCode, automaticApproval = false } = request.body || {};
    const userId = request.user && (request.user.id || request.user.sub);

    if (!userId) return reply.code(401).send({ message: "Unauthorized" });

    try {
      const house = await this.houseService.findHouseByCode(houseCode);
      if (!house) return reply.code(404).send({ message: "House not found" });

      const status = automaticApproval ? "APPROVED" : "PENDING";
      const updatedUser = await this.houseService.joinHouse(
        house.id,
        userId,
        status
      );

      reply.code(200).send({
        house: { name: updatedUser.house.name, code: updatedUser.house.code },
        houseStatus: updatedUser.house_status,
        message: status === "APPROVED" ? "Joined house" : "Join request sent",
      });
    } catch (error) {
      this.fastify.log.error(error);
      reply.code(500).send({ message: "Could not join house" });
    }
  }

  async getHouseHandler(request, reply) {
    const houseId =
      request.user &&
      (request.user.houseId || request.user.house_id || request.user.houseId);
    if (!houseId) return reply.code(404).send({ message: "User has no house" });

    try {
      const details = await this.houseService.getHouseDetails(houseId);
      if (!details) return reply.code(404).send({ message: "House not found" });

      const pendingMembers = await this.houseService.getPendingMembers(houseId);

      if (details.members) {
        details.members = details.members.map((m) => ({
          ...m,
          star_avg: m.star_avg ? m.star_avg.toString() : "0.0",
          role: m.profile ? m.profile.name : undefined,
        }));
      }

      reply.code(200).send({
        id: details.id,
        name: details.name,
        code: details.code,
        adminId: details.admin_id,
        members: details.members || [],
        pendingMembers: pendingMembers || [],
      });
    } catch (error) {
      this.fastify.log.error(error);
      reply.code(500).send({ message: "Could not retrieve house details" });
    }
  }

  async updateMemberStatusHandler(request, reply) {
    const { userId } = request.params;
    const { status } = request.body;

    const adminId = request.user && request.user.id;
    const houseId = request.user && request.user.houseId;
    const userRole = request.user && request.user.role;

    if (!houseId) {
      return reply.code(400).send({ message: "User must belong to a house." });
    }

    if (userRole !== "ADMIN") {
      return reply
        .code(403)
        .send({ message: "Only the house administrator can manage members." });
    }

    if (parseInt(userId) === adminId) {
      return reply
        .code(400)
        .send({ message: "You cannot change your own house status." });
    }

    try {
      const updatedMember = await this.houseService.updateMemberStatus(
        parseInt(userId),
        houseId,
        status
      );

      reply.code(200).send({
        id: updatedMember.id,
        name: updatedMember.name,
        email: updatedMember.email,
        houseStatus: updatedMember.house_status,
        message: `Member status updated to ${updatedMember.house_status}.`,
      });
    } catch (error) {
      this.fastify.log.error(error);
      if (error.message.includes("User not found")) {
        return reply.code(404).send({ message: error.message });
      }
      if (error.message.includes("Invalid status")) {
        return reply.code(400).send({ message: error.message });
      }
      reply.code(500).send({ message: "Could not update member status." });
    }
  }

  async removeMemberHandler(request, reply) {
    const { userId } = request.params;

    const adminId = request.user && request.user.id;
    const houseId = request.user && request.user.houseId;
    const userRole = request.user && request.user.role;

    if (!houseId) {
      return reply.code(400).send({ message: "User must belong to a house." });
    }

    if (userRole !== "ADMIN") {
      return reply
        .code(403)
        .send({ message: "Only the house administrator can remove members." });
    }

    if (parseInt(userId) === adminId) {
      return reply
        .code(400)
        .send({ message: "You cannot remove yourself from the house." });
    }

    try {
      const removedMember = await this.houseService.removeMember(
        parseInt(userId),
        houseId
      );

      reply.code(200).send({
        id: removedMember.id,
        name: removedMember.name,
        message: `User ${removedMember.name} successfully removed from the house.`,
      });
    } catch (error) {
      this.fastify.log.error(error);
      if (error.message.includes("User not found in this house")) {
        return reply.code(404).send({ message: error.message });
      }
      reply.code(500).send({ message: "Could not remove member." });
    }
  }
}
