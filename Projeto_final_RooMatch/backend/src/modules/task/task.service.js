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

  /**
   * Atualiza o status de uma tarefa.
   * @param {number} taskId - ID da tarefa.
   * @param {string} newStatus - Novo status (e.g., AWAITING_REVIEW, FAILED).
   * @param {number} houseId - ID da casa (para garantir que a tarefa pertence à casa).
   * @returns {Promise<object>} Tarefa atualizada.
   */

  async updateTaskStatus(taskId, newStatus, houseId) {
    const validStatuses = [
      "PENDING",
      "AWAITING_REVIEW",
      "COMPLETED",
      "FAILED",
      "REDO",
      "BOUGHT_OUT",
    ];

    if (!validStatuses.includes(newStatus)) {
      throw new Error("Invalid status provided.");
    }

    try {
      const updatedTask = await this.prisma.task.update({
        where: {
          id: taskId,
          house_id: houseId, // Garante que a tarefa pertence à casa do usuário
        },
        data: {
          status: newStatus,
        },
      });
      return updatedTask;
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === "P2025"
      ) {
        throw new Error("Task not found or does not belong to your house.");
      }
      throw error;
    }
  }

  /**
   * Registra uma avaliação para a tarefa e atualiza a pontuação.
   */
  async reviewTask(taskId, reviewerId, stars) {
    if (stars < 1 || stars > 5) {
      throw new Error("Stars must be between 1 and 5.");
    }

    return this.prisma.$transaction(async (tx) => {
      // 1. Cria o registro de avaliação
      await tx.taskReview.create({
        data: {
          task_id: taskId,
          reviewer_id: reviewerId,
          stars: stars,
        },
      });

      // 2. Recalcula a média e a contagem de avaliações
      const reviewStats = await tx.taskReview.aggregate({
        where: { task_id: taskId },
        _avg: { stars: true },
        _count: { stars: true },
      });

      const newStarAvg = reviewStats._avg.stars
        ? parseFloat(reviewStats._avg.stars).toFixed(1)
        : null;

      // 3. Busca a tarefa, incluindo o responsável (para pontuação)
      const task = await tx.task.findUnique({
        where: { id: taskId },
        include: {
          responsible: {
            select: { id: true, score: true },
          },
        },
      });

      if (!task || !task.responsible) {
        throw new Error("Task or responsible user not found.");
      }

      const isFirstReview = reviewStats._count.stars === 1;
      const isCompleted = task.status === "COMPLETED";

      // 4. Atualiza a Tarefa (Star Avg e Status, se for a primeira avaliação)
      const updatedTask = await tx.task.update({
        where: { id: taskId },
        data: {
          star_average: newStarAvg,
          // Se for a primeira avaliação, a tarefa passa para COMPLETED
          status: isFirstReview ? "COMPLETED" : task.status,
        },
      });

      // 5. Atualiza o Score do Responsável (Apenas na primeira vez)
      if (task.responsible.id && isFirstReview && !isCompleted) {
        let scoreAdjustment = task.points;

        // Se a média estiver baixa, podemos ajustar (Regra de Negócio: Exemplo simples)
        if (newStarAvg < 2.0) {
          scoreAdjustment = Math.floor(task.points * 0.5); // 50% dos pontos
        } else if (newStarAvg >= 4.5) {
          scoreAdjustment = Math.floor(task.points * 1.2); // 20% de bônus
        }

        await tx.user.update({
          where: { id: task.responsible.id },
          data: {
            score: { increment: scoreAdjustment },
          },
        });

        // 6. Registra no Histórico (Opcional, mas boa prática)
        await tx.history.create({
          data: {
            house_id: task.house_id,
            user_id: task.responsible.id,
            event_type: "TASK_COMPLETED",
            description: `Completed task '${task.title}' with ${newStarAvg} stars (+${scoreAdjustment} points).`,
          },
        });
      }

      return updatedTask;
    });
  }
}
