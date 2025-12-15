import bcrypt from "bcryptjs";
import crypto from "crypto";

import { HouseService } from "../house/house.service.js";

export class AuthService {
  constructor(prisma) {
    this.prisma = prisma;
    this.houseService = new HouseService(prisma);
  }

  async findUserByEmail(email) {
    return this.prisma.user.findUnique({
      where: { email },
      include: {
        profile: true,
        house: true,
      },
    });
  }

  // houseCreationParams: { name: string, code: string }
  async registerUser(name, email, password, houseCode = null, houseCreationParams = null) {
    console.log(`[AuthService] registerUser called with houseCode: '${houseCode}'`);
    const commonProfile = await this.prisma.profile.findUnique({
      where: { name: "COMMON" },
    });

    if (!commonProfile) {
      throw new Error("Profile 'COMMON' not found. Run DB Seed.");
    }

    let houseId = null;
    let houseStatus = "PENDING";
    let profileId = commonProfile.id;

    // 1. Join Existing House
    if (houseCode) {
        const house = await this.prisma.house.findUnique({
            where: { code: houseCode.toUpperCase() }
        });
        if (!house) {
            console.warn(`[AuthService] House with code ${houseCode} not found.`);
            throw new Error(`House with code ${houseCode} not found.`);
        }
        console.log(`[AuthService] Joining existing house: ${house.name} (ID: ${house.id})`);
        houseId = house.id;
    }

    const password_hash = await bcrypt.hash(password, 10);

    // Create User first (temporarily PENDING/COMMON if creating house, updated later)
    const newUser = await this.prisma.user.create({
      data: {
        name,
        email,
        password_hash,
        profile_id: profileId,
        house_status: houseStatus,
        house_id: houseId,
        score: 0,
        star_avg: 3.0,
      },
    });

    // 2. Create New House (Atomic-ish)
    if (houseCreationParams && houseCreationParams.name && houseCreationParams.code) {
        try {
            // Create house with user as admin
            const newHouse = await this.houseService.createHouse(
                houseCreationParams.name, 
                newUser.id, 
                houseCreationParams.code
            );
            
            // user is already updated to ADMIN/APPROVED inside createHouse service method!
            // But we need to return the fresh user state
        } catch(error) {
            // If house creation fails (e.g. code collision), we should probably rollback user creation?
            // For now, let's delete the user to simulate rollback
            await this.prisma.user.delete({ where: { id: newUser.id } });
            throw error;
        }
    }

    // Refetch user to get updated fields (if house created)
    const finalUser = await this.prisma.user.findUnique({
        where: { id: newUser.id },
        include: { profile: true, house: true } 
    });

    const { password_hash: _, ...userWithoutHash } = finalUser;
    return userWithoutHash;
  }

  async createPasswordResetToken(email) {
    const user = await this.findUserByEmail(email);

    if (!user) {
      return {
        message:
          "If a user with that email exists, a password reset token has been generated.",
      };
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetExpires = new Date(Date.now() + 60 * 60 * 1000);

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        reset_password_token: resetToken,
        reset_password_expires: resetExpires,
      },
    });

    return {
      message: "Password reset token generated and saved.",
      resetToken,
    };
  }

  async resetPassword(token, newPassword) {
    const user = await this.prisma.user.findFirst({
      where: {
        reset_password_token: token,
        reset_password_expires: {
          gt: new Date(),
        },
      },
    });

    if (!user) {
      throw new Error("Token is invalid or has expired.");
    }

    const password_hash = await bcrypt.hash(newPassword, 10);

    const updatedUser = await this.prisma.user.update({
      where: { id: user.id },
      data: {
        password_hash,
        reset_password_token: null,
        reset_password_expires: null,
      },
      select: { id: true, email: true },
    });

    return updatedUser;
  }
}
