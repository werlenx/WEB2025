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
        // Seleciona os campos que o frontend precisa
        select: {
          id: true,
          name: true,
          email: true,
          avatar_color: true,
          score: true,
          star_avg: true,
          house_id: true,
          house_status: true,
          profile: { select: { name: true } }, // Para obter a role
        },
      });

      // Retorna o objeto formatado, sem a senha
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
      // P2002: Unique constraint failed (ex: tentar usar email já cadastrado)
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        throw new Error("Email already in use.");
      }
      throw error;
    }
  }
}
