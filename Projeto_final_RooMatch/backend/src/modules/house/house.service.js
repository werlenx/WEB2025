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
    console.log(`Fetching ALL pending members (Global Visibility)`);
    // User requested: Any pending member should appear for any house.
    const members = await this.prisma.user.findMany({
      where: {
        house_status: "PENDING",
      },
      select: {
        id: true,
        name: true,
        email: true,
        house_id: true, // metrics
      },
    });
    console.log(`Found ${members.length} pending members globally`);
    return members;
  }

  async updateMemberStatus(userId, houseId, newStatus) {
    const validStatuses = ["APPROVED", "REJECTED", "PENDING"];

    if (!validStatuses.includes(newStatus)) {
      throw new Error("Invalid status provided.");
    }

    try {
      // Allow updating ANY user (even if not in house or orphaned)
      // If Approving, we ADOPT the user into this house (houseId)
      const updateData = {
          house_status: newStatus,
      };

      if (newStatus === "APPROVED") {
          updateData.house_id = houseId;
          
          // Also update profile to COMMON if needed? 
          // (Usually they are COMMON/PENDING already, but good to ensure)
      } else if (newStatus === "REJECTED") {
          // If rejected, uncouple them? Or just leave them rejected?
          // Usually rejection implies kicking out or denying entry.
          // Let's keep existing house_id or set to null?
          // User didn't specify, but safer to keeping current logic or null.
          // Existing logic just updated status.
          // For Orphans, house_id is null.
      }

      return this.prisma.user.update({
        where: {
          id: userId,
          // Removed house_id check to allow adopting orphans
        },
        data: updateData,
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
        throw new Error("User not found.");
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
