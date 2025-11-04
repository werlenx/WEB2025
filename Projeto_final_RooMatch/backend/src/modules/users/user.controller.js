import { UserService } from "./user.service.js";

export class UserController {
  constructor(fastify) {
    this.fastify = fastify;
    this.userService = new UserService(fastify.prisma);
  }

  async updateProfileHandler(request, reply) {
    const userId = request.user && request.user.id;
    const { name, email, avatarColor } = request.body || {};

    if (!userId) {
      return reply.code(401).send({ message: "Unauthorized" });
    }

    const updateData = { name, email, avatarColor };

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
