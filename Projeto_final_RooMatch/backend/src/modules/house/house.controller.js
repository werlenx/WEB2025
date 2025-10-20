import bcrypt from "bcryptjs";
import { AuthService } from "./auth.service.js";

export class AuthController {
  constructor(fastify) {
    this.fastify = fastify;
    this.authService = new AuthService(fastify.prisma);
  }

  // POST /auth/register
  async registerHandler(request, reply) {
    const { name, email, password } = request.body;

    // 1. Validação de existência
    const existingUser = await this.authService.findUserByEmail(email);
    if (existingUser) {
      reply.code(409).send({ message: "User already exists with this email." });
      return;
    }

    // 2. Criação do Usuário (Service lida com hashing)
    try {
      const newUser = await this.authService.registerUser(
        name,
        email,
        password
      );

      // 3. Resposta de Sucesso
      reply.code(201).send({
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        message: "Registration successful. Awaiting house approval.",
      });
    } catch (error) {
      this.fastify.log.error(error);
      reply
        .code(500)
        .send({ message: "Internal server error during registration." });
    }
  }

  // POST /auth/login
  async loginHandler(request, reply) {
    const { email, password } = request.body;

    // 1. Busca o Usuário (o Service inclui o hash e o profile)
    const user = await this.authService.findUserByEmail(email);

    if (!user) {
      reply
        .code(401)
        .send({ message: "Invalid credentials or user not found." });
      return;
    }

    // 2. Compara a senha (usando bcrypt)
    const passwordMatch = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatch) {
      reply
        .code(401)
        .send({ message: "Invalid credentials or user not found." });
      return;
    }

    // 3. Cria o payload do JWT (dados a serem armazenados no token)
    const tokenPayload = {
      id: user.id,
      email: user.email,
      role: user.profile.name,
      houseId: user.house_id,
    };

    // 4. Gera o token
    const token = this.fastify.jwt.sign(tokenPayload);

    // 5. Resposta de Sucesso (inclui dados do usuário e token)
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
}
