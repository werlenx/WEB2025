import { AccountService } from "./account.service.js";

export class AccountController {
  constructor(fastify) {
    this.fastify = fastify;
    this.accountService = new AccountService(fastify.prisma);
  }

  async createAccountHandler(request, reply) {
    const { name, type, amount, dueDate } = request.body;

    const paidById = request.user && request.user.id;
    const houseId = request.user && request.user.houseId;

    if (!houseId) {
      return reply.code(400).send({
        message: "O usuário deve pertencer a uma casa para criar uma conta.",
      });
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
        message: "Conta criada e divisões de pagamento calculadas.",
      });
    } catch (error) {
      this.fastify.log.error(error);
      if (error.message.includes("Não há menbros aprovados na casa")) {
        return reply.code(400).send({ message: error.message });
      }
      reply.code(500).send({ message: "Não foi possivel criar conta." });
    }
  }

  async getAccountsHandler(request, reply) {
    const houseId = request.user && request.user.houseId;

    if (!houseId) {
      return reply
        .code(400)
        .send({ message: "O usuário deve pertencer a uma casa." });
    }

    try {
      const accounts = await this.accountService.getAccounts(houseId);
      const formattedAccounts = accounts.map((account) => ({
        id: account.id,
        name: account.name,
        type: account.type,
        amount: account.amount.toString(),
        dueDate: account.due_date,
        paidBy: account.paid_by,
        paymentShares: account.payment_shares.map((share) => ({
          userId: share.user_id,
          shareAmount: share.share_amount.toString(),
          isPaid: share.is_paid,
          user: share.user,
        })),
      }));

      reply.code(200).send(formattedAccounts);
    } catch (error) {
      this.fastify.log.error(error);
      reply.code(500).send({ message: "Não foi possível buscar as contas." });
    }
  }

  async markShareAsPaidHandler(request, reply) {
    const { accountId } = request.params;
    const userId = request.user && request.user.id;
    const houseId = request.user && request.user.houseId;

    if (!houseId) {
      return reply
        .code(400)
        .send({ message: "Usuário deve pertencer a uma casa." });
    }

    try {
      const accountIdNum = parseInt(accountId);

      const account = await this.fastify.prisma.account.findUnique({
        where: { id: accountIdNum },
      });

      if (!account || account.house_id !== houseId) {
        return reply
          .code(404)
          .send({ message: "Conta não encontrada para esta casa." });
      }

      const updatedShare = await this.accountService.markShareAsPaid(
        accountIdNum,
        userId
      );

      reply.code(200).send({
        accountId: updatedShare.account_id,
        shareAmount: updatedShare.share_amount.toString(),
        isPaid: updatedShare.is_paid,
        message: `Sua conta de  ${updatedShare.account.name} foi paga.`,
      });
    } catch (error) {
      this.fastify.log.error(error);
      if (error.message.includes("Pagamento não encontrado")) {
        return reply
          .code(400)
          .send({
            message: "não foi encontrada para este utilizador ou já foi paga..",
          });
      }
      reply
        .code(500)
        .send({ message: "Não foi possível registrar o pagamento." });
    }
  }
}
