import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import Decimal from "decimal.js"; // Usado para garantir precisão monetária

export class AccountService {
  constructor(prisma) {
    this.prisma = prisma;
  }

  /**
   * Cria uma nova conta, calcula a divisão igualitária entre todos os membros APROVADOS,
   * e registra as PaymentShares.
   */
  async createAccount(houseId, name, type, amount, dueDate, paidById) {
    return this.prisma.$transaction(async (tx) => {
      // 1. Encontra todos os membros APROVADOS na casa (usuários que irão compartilhar a despesa)
      const members = await tx.user.findMany({
        where: {
          house_id: houseId,
          house_status: "APPROVED",
        },
        select: { id: true },
      });

      if (members.length === 0) {
        throw new Error(
          "Cannot create account: No approved members in the house to share the expense."
        );
      }

      // 2. Cria a conta principal
      const newAccount = await tx.account.create({
        data: {
          house_id: houseId,
          name: name,
          type: type,
          amount: new Decimal(amount), // Converte para Decimal para precisão
          due_date: new Date(dueDate),
          paid_by_id: paidById,
        },
      });

      // 3. Calcula a divisão (share)
      const totalMembers = members.length;
      const amountDecimal = new Decimal(amount);
      // Divisão igual, arredondada para duas casas decimais
      const shareAmount = amountDecimal.div(totalMembers).toFixed(2);

      // 4. Cria os registros de PaymentShare para cada membro
      const paymentSharesData = members.map((member) => ({
        account_id: newAccount.id,
        user_id: member.id,
        share_amount: new Decimal(shareAmount),
        is_paid: member.id === paidById ? true : false, // O pagador inicial já pagou sua parte para si mesmo
      }));

      await tx.paymentShare.createMany({
        data: paymentSharesData,
      });

      return newAccount;
    });
  }
}
