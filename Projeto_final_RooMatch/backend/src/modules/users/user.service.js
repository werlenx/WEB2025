import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

export class UserService {
  constructor(prisma) {
    this.prisma = prisma;
  }

  async updateProfile(userId, data) {
    try {
      const user = await this.prisma.user.update({
        where: { id: userId },
        data: {
          name: data.name,
          email: data.email,
          avatar_color: data.avatarColor,
        },

        select: {
          id: true,
          name: true,
          email: true,
          avatar_color: true,
          score: true,
          star_avg: true,
          house_id: true,
          house_status: true,
          profile: { select: { name: true } },
        },
      });

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        avatarColor: user.avatar_color,
        score: user.score,
        starAvg: user.star_avg ? user.star_avg.toString() : "0.0",
        houseId: user.house_id,
        houseStatus: user.house_status,
        role: user.profile.name,
      };
    } catch (error) {
      if (
        error?.name === "PrismaClientKnownRequestError" &&
        error?.code === "P2002"
      ) {
        const target = error?.meta?.target?.[0];
        if (target === "email") {
          const customError = new Error("Email already in use");
          customError.code = "P2002";
          throw customError;
        }
      }
      throw error;
    }
  }
  async getProfile(userId) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        avatar_color: true,
        score: true,
        star_avg: true,
        house_id: true,
        house_status: true,
        profile: { select: { name: true } },
      },
    });

    if (!user) return null;

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      avatarColor: user.avatar_color,
      score: user.score,
      starAvg: user.star_avg ? user.star_avg.toString() : "0.0",
      houseId: user.house_id,
      houseStatus: user.house_status,
      role: user.profile.name,
    };
  }
}
