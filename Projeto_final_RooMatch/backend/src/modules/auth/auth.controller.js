import bcrypt from "bcryptjs";
import { AuthService } from "./auth.service.js";

export class AuthController {
  constructor(fastify) {
    this.fastify = fastify;
    this.authService = new AuthService(fastify.prisma);
  }

  async registerHandler(request, reply) {
    const { name, email, password, houseCode, houseName, newHouseCode } = request.body;

    const existingUser = await this.authService.findUserByEmail(email);
    if (existingUser) {
      reply.code(409).send({ message: "Email ja cadastrado" });
      return;
    }

    try {
      const houseCreationParams = (houseName && newHouseCode) ? { name: houseName, code: newHouseCode } : null;

      const newUser = await this.authService.registerUser(
        name,
        email,
        password,
        houseCode,
        houseCreationParams
      );

      reply.code(201).send({
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        message: "Registrado!",
      });
    } catch (error) {
      this.fastify.log.error(error);
      if (error.message.includes("House with code") && error.message.includes("not found")) {
          return reply.code(400).send({ message: error.message });
      }
      reply.code(500).send({ message: error.message || "erro interno durante o registro" });
    }
  }

  async loginHandler(request, reply) {
    const { email, password } = request.body;

    const user = await this.authService.findUserByEmail(email);

    if (!user) {
      reply
        .code(401)
        .send({ message: "Invalid credentials or user not found." });
      return;
    }

    const passwordMatch = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatch) {
      reply
        .code(401)
        .send({ message: "Invalid credentials or user not found." });
      return;
    }

    const tokenPayload = {
      id: user.id,
      email: user.email,
      role: user.profile.name,
      houseId: user.house_id,
    };

    const token = this.fastify.jwt.sign(tokenPayload);

    reply.code(200).send({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.profile.name,
        houseId: user.house_id,
        houseStatus: user.house_status,
        score: user.score,
        starAvg: user.star_avg ? user.star_avg.toString() : "0.0",
      },
    });
  }

  async forgotPasswordHandler(request, reply) {
    const { email } = request.body;

    if (!email) {
      return reply.code(400).send({ message: "Email is required." });
    }

    try {
      const result = await this.authService.createPasswordResetToken(email);

      reply.code(200).send({
        message:
          "If the email is registered, a password reset token has been generated.",
        resetToken: result.resetToken,
      });
    } catch (error) {
      this.fastify.log.error(error);
      reply
        .code(500)
        .send({ message: "Could not process password reset request." });
    }
  }

  async resetPasswordHandler(request, reply) {
    const { token, newPassword } = request.body;

    if (!token || !newPassword) {
      return reply
        .code(400)
        .send({ message: "Token and newPassword are required." });
    }

    if (newPassword.length < 3) {
      return reply
        .code(400)
        .send({ message: "Password must be at least 3 characters long." });
    }

    try {
      const updatedUser = await this.authService.resetPassword(
        token,
        newPassword
      );

      reply.code(200).send({
        id: updatedUser.id,
        email: updatedUser.email,
        message: "Password has been successfully updated.",
      });
    } catch (error) {
      this.fastify.log.error(error);
      if (error.message.includes("Token is invalid or has expired")) {
        return reply.code(400).send({ message: error.message });
      }
      reply.code(500).send({ message: "Could not reset password." });
    }
  }
}
