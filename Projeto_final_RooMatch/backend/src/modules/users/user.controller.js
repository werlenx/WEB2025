import { UserService } from "./user.service.js";

export class UserController {
  constructor(fastify) {
    this.fastify = fastify;
    this.userService = new UserService(fastify.prisma);
  }

  // PATCH /users/me
  async updateProfileHandler(request, reply) {
    // 1. EXTRAÇÃO DE DADOS E VALIDAÇÃO DE USUÁRIO
    const userId = request.user && request.user.id;
    // Garante que o body existe e extrai os campos
    const { name, email, avatarColor } = request.body || {};

    if (!userId) {
      return reply.code(401).send({ message: "Unauthorized" });
    }

    // 2. CRIAÇÃO DO OBJETO DE ATUALIZAÇÃO (apenas campos válidos)
    const updateData = { name, email, avatarColor };

    // 3. EXECUÇÃO
    try {
      const updatedUser = await this.userService.updateProfile(
        userId,
        updateData
      );

      reply.code(200).send({
        user: updatedUser,
        message: "Profile updated successfully.",
      });
    } catch (error) {
      this.fastify.log.error(error);

      // TRATAMENTO DE ERROS CONFORME ESPECIFICADO NO SERVICE
      if (
        error?.code === "P2002" ||
        error?.message?.includes("Email already in use")
      ) {
        return reply.code(409).send({ message: "Email already in use" });
      }

      reply.code(500).send({ message: "Could not update profile." });
    }
  }
}
