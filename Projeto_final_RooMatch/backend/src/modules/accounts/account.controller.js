import { AccountService } from "./account.service.js";

export class AccountController {
  constructor(fastify) {
    this.fastify = fastify;
    this.accountService = new AccountService(fastify.prisma);
  }

  // POST /accounts/
  async createAccountHandler(request, reply) {
    const { name, type, amount, dueDate } = request.body;

    // O usuário logado é o pagador inicial
    const paidById = request.user && request.user.id;
    const houseId = request.user && request.user.houseId;

    if (!houseId) {
      return reply
        .code(400)
        .send({ message: "User must belong to a house to create an account." });
    }

    try {
      const newAccount = await this.accountService.createAccount(
        houseId,
        name,
        type,
        amount,
        dueDate,
        paidById
      );

      reply.code(201).send({
        id: newAccount.id,
        name: newAccount.name,
        amount: newAccount.amount.toString(),
        dueDate: newAccount.due_date,
        message: "Account created and shares calculated.",
      });
    } catch (error) {
      this.fastify.log.error(error);
      if (error.message.includes("No approved members")) {
        return reply.code(400).send({ message: error.message });
      }
      reply.code(500).send({ message: "Could not create account." });
    }
  }
}
