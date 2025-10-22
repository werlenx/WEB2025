import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

export class HouseService {
  constructor(prisma) {
    this.prisma = prisma;
  }

  generateHouseCode() {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  }

  async createHouse(houseName, adminId) {
    const code = this.generateHouseCode();

    try {
      const newHouse = await this.prisma.house.create({
        data: {
          name: houseName,
          code: code,
          admin_id: adminId,
        },
      });

      const adminProfile = await this.prisma.profile.findUnique({
        where: { name: "ADMIN" },
      });

      await this.prisma.user.update({
        where: { id: adminId },
        data: {
          house_id: newHouse.id,
          house_status: "APPROVED",
          profile_id: adminProfile.id,
        },
      });

      return newHouse;
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        throw new Error("House code collision, please try again.");
      }
      throw error;
    }
  }

  async findHouseByCode(code) {
    return this.prisma.house.findUnique({
      where: { code },
    });
  }

  async joinHouse(houseId, userId, status = "PENDING") {
    const commonProfile = await this.prisma.profile.findUnique({
      where: { name: "COMMON" },
    });

    return this.prisma.user.update({
      where: { id: userId },
      data: {
        house_id: houseId,
        house_status: status,
        profile_id: commonProfile.id,
      },
      select: {
        id: true,
        name: true,
        house_status: true,
        house_id: true,
        house: { select: { name: true, code: true } },
      },
    });
  }

  async getHouseDetails(houseId) {
    // CORREÇÃO 1: Removemos a tentativa de usar 'pending_members' no 'include'.
    return this.prisma.house.findUnique({
      where: { id: houseId },
      include: {
        members: {
          // Esta inclusão trará APENAS os APPROVED
          where: { house_status: "APPROVED" },
          select: {
            id: true,
            name: true,
            email: true,
            score: true,
            star_avg: true,
            avatar_color: true,
            profile: { select: { name: true } },
          },
        },
        // O restante das inclusões da House (admin, tasks, etc.) não precisa de alteração
      },
    });
  }

  async getHouseDetails(houseId) {
    return this.prisma.house.findUnique({
      where: { id: houseId },
      include: {
        members: {
          where: { house_status: "APPROVED" },
          select: {
            id: true,
            name: true,
            email: true,
            score: true,
            star_avg: true,
            avatar_color: true,
            profile: { select: { name: true } },
          },
        },
        pending_members: {
          where: { house_status: "PENDING" },
          select: { id: true, name: true, email: true },
        },
      },
    });
  }
}
