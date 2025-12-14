import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

export class HouseService {
  constructor(prisma) {
    this.prisma = prisma;
  }

  generateHouseCode() {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  }

  async createHouse(houseName, adminId, customCode = null) {
    const code = customCode ? customCode.toUpperCase() : this.generateHouseCode();

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
      },
    });
  }

  async getPendingMembers(houseId) {
    console.log(`Fetching pending members for house ${houseId}`);
    const members = await this.prisma.user.findMany({
      where: {
        house_id: houseId,
        house_status: "PENDING",
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });
    console.log(`Found ${members.length} pending members`);
    return members;
  }

  async updateMemberStatus(userId, houseId, newStatus) {
    const validStatuses = ["APPROVED", "REJECTED", "PENDING"];

    if (!validStatuses.includes(newStatus)) {
      throw new Error("Invalid status provided.");
    }

    try {
      return this.prisma.user.update({
        where: {
          id: userId,
          house_id: houseId,
        },
        data: {
          house_status: newStatus,
        },
        select: {
          id: true,
          name: true,
          email: true,
          house_status: true,
        },
      });
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === "P2025"
      ) {
        throw new Error("User not found or not a member of your house.");
      }
      throw error;
    }
  }

  async removeMember(userId, houseId) {
    try {
      const userToRemove = await this.prisma.user.findUnique({
        where: { id: userId, house_id: houseId },
      });

      if (!userToRemove) {
        throw new Error("User not found in this house.");
      }

      const updatedUser = await this.prisma.user.update({
        where: { id: userId },
        data: {
          house_id: null,
          house_status: "REJECTED",
        },
        select: { id: true, name: true, email: true, house_status: true },
      });

      return updatedUser;
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === "P2025"
      ) {
        throw new Error("User not found.");
      }
      throw error;
    }
  }
}
