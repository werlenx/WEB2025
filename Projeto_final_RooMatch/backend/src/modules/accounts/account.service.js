import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import Decimal from "decimal.js";

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

      const newAccount = await tx.account.create({
        data: {
          house_id: houseId,
          name: name,
          type: type,
          amount: new Decimal(amount),
          due_date: new Date(dueDate),
          paid_by_id: paidById,
        },
      });

      const totalMembers = members.length;
      const amountDecimal = new Decimal(amount);
      const shareAmount = amountDecimal.div(totalMembers).toFixed(2);

      const paymentSharesData = members.map((member) => ({
        account_id: newAccount.id,
        user_id: member.id,
        share_amount: new Decimal(shareAmount),
        is_paid: member.id === paidById ? true : false,
      }));

      await tx.paymentShare.createMany({
        data: paymentSharesData,
      });

      return newAccount;
    });
  }

  async getAccounts(houseId) {
    return this.prisma.account.findMany({
      where: { house_id: houseId },
      include: {
        paid_by: {
          select: { id: true, name: true, avatar_color: true },
        },
        payment_shares: {
          include: {
            user: {
              select: { id: true, name: true, avatar_color: true },
            },
          },
          orderBy: { user_id: "asc" },
        },
      },
      orderBy: { due_date: "desc" },
    });
  }

  /**
   * @param {number} shareId
   * @param {number} payingUserId
   * @returns {Promise<object>}
   */
  async markShareAsPaid(accountId, payingUserId) {
    try {
      const updatedShare = await this.prisma.paymentShare.update({
        where: {
          account_id_user_id: {
            account_id: accountId,
            user_id: payingUserId,
          },
        },
        data: {
          is_paid: true,
        },
        select: {
          account_id: true,
          user_id: true,
          is_paid: true,
          share_amount: true,
          account: {
            select: { name: true, paid_by_id: true },
          },
        },
      });

      return updatedShare;
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === "P2025"
      ) {
        throw new Error("Payment share not found or already paid.");
      }
      throw error;
    }
  }
}
