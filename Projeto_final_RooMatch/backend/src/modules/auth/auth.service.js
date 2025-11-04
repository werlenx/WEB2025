import bcrypt from "bcryptjs";
import crypto from "crypto";

export class AuthService {
  constructor(prisma) {
    this.prisma = prisma;
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

  async registerUser(name, email, password) {
    const commonProfile = await this.prisma.profile.findUnique({
      where: { name: "COMMON" },
    });

    if (!commonProfile) {
      throw new Error("Profile 'COMMON' not found. Run DB Seed.");
    }

    const password_hash = await bcrypt.hash(password, 10);

    const newUser = await this.prisma.user.create({
      data: {
        name,
        email,
        password_hash,
        profile_id: commonProfile.id,
        house_status: "PENDING",
        score: 0,
        star_avg: 3.0,
      },
    });

    const { password_hash: _, ...userWithoutHash } = newUser;
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
