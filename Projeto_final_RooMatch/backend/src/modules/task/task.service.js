import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

export class TaskService {
  constructor(prisma) {
    this.prisma = prisma;
  }

  /**
   * Cria uma nova tarefa.
   */
  async createTask(
    houseId,
    title,
    description,
    frequency,
    points,
    responsibleId,
    dueDate,
    canBuyOut
  ) {
    try {
      const newTask = await this.prisma.task.create({
        data: {
          house_id: houseId,
          title: title,
          description: description,
          frequency: frequency,
          points: points,
          responsible_id: responsibleId || null,
          due_date: dueDate,
          can_buy_out: canBuyOut,
        },
      });
      return newTask;
    } catch (error) {
      // P2003: Foreign key constraint failed (e.g., responsibleId or houseId not found)
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === "P2003"
      ) {
        throw new Error("Invalid responsible user ID or house ID.");
      }
      throw error;
    }
  }

  /**
   * Lista todas as tarefas ativas de uma casa, incluindo dados do responsável.
   */
  async getTasks(houseId) {
    return this.prisma.task.findMany({
      where: { house_id: houseId },
      include: {
        responsible: {
          select: { id: true, name: true, avatar_color: true },
        },
      },
      orderBy: { due_date: "asc" },
    });
  }
}
