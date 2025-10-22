import { TaskService } from "./task.service.js";

export class TaskController {
  constructor(fastify) {
    this.fastify = fastify;
    this.taskService = new TaskService(fastify.prisma);
  }

  // POST /tasks/
  async createTaskHandler(request, reply) {
    const {
      title,
      description,
      frequency,
      points,
      responsibleId,
      dueDate,
      canBuyOut,
    } = request.body;

    // Obtém o houseId do payload do JWT
    const houseId = request.user && request.user.houseId;

    if (!houseId) {
      return reply
        .code(400)
        .send({ message: "User must belong to a house to create a task." });
    }

    try {
      const newTask = await this.taskService.createTask(
        houseId,
        title,
        description,
        frequency,
        points,
        responsibleId,
        new Date(dueDate),
        canBuyOut
      );

      reply.code(201).send({
        id: newTask.id,
        title: newTask.title,
        responsibleId: newTask.responsible_id,
        dueDate: newTask.due_date,
        message: "Task created successfully.",
      });
    } catch (error) {
      this.fastify.log.error(error);
      if (error.message.includes("Invalid responsible user ID")) {
        return reply
          .code(404)
          .send({ message: "Responsible user ID is invalid." });
      }
      reply.code(500).send({ message: "Could not create task." });
    }
  }

  // GET /tasks/
  async getTasksHandler(request, reply) {
    const houseId = request.user && request.user.houseId;

    if (!houseId) {
      return reply.code(404).send({ message: "User has no house" });
    }

    try {
      const tasks = await this.taskService.getTasks(houseId);

      // Normaliza dados para o formato de resposta
      const normalizedTasks = tasks.map((t) => ({
        ...t,
        star_average: t.star_average ? t.star_average.toString() : null,
        responsible: t.responsible
          ? {
              id: t.responsible.id,
              name: t.responsible.name,
              avatar_color: t.responsible.avatar_color,
            }
          : null,
      }));

      reply.code(200).send(normalizedTasks);
    } catch (error) {
      this.fastify.log.error(error);
      reply.code(500).send({ message: "Could not retrieve tasks." });
    }
  }

  // PATCH /tasks/:taskId/status
  async updateTaskStatusHandler(request, reply) {
    const { taskId } = request.params || {};
    const { status } = request.body || {};
    const houseId = request.user && request.user.houseId;
    const userId = request.user && request.user.id;

    if (!houseId) {
      return reply.code(400).send({ message: "User must belong to a house." });
    }

    if (!taskId || !status) {
      return reply
        .code(400)
        .send({ message: "taskId and status are required." });
    }

    try {
      const task = await this.fastify.prisma.task.findUnique({
        where: { id: parseInt(taskId, 10) },
      });

      if (!task) return reply.code(404).send({ message: "Task not found." });

      // Only the responsible user may set AWAITING_REVIEW or FAILED
      if (
        (status === "AWAITING_REVIEW" || status === "FAILED") &&
        task.responsible_id !== userId
      ) {
        return reply.code(403).send({
          message: "Only the responsible user can update this status.",
        });
      }

      const updatedTask = await this.taskService.updateTaskStatus(
        parseInt(taskId, 10),
        status,
        houseId
      );

      reply.code(200).send({
        id: updatedTask.id,
        title: updatedTask.title,
        status: updatedTask.status,
        message: `Task status updated to ${updatedTask.status}.`,
      });
    } catch (error) {
      this.fastify.log.error(error);
      if (error.message.includes("Task not found"))
        return reply.code(404).send({ message: error.message });
      if (error.message.includes("Invalid status"))
        return reply.code(400).send({ message: error.message });
      reply.code(500).send({ message: "Could not update task status." });
    }
  }

  // POST /tasks/:taskId/review
  async reviewTaskHandler(request, reply) {
    const { taskId } = request.params;
    const { stars } = request.body;
    const houseId = request.user && request.user.houseId;
    const reviewerId = request.user && request.user.id;

    if (!houseId) {
      return reply.code(400).send({ message: "User must belong to a house." });
    }

    // 1. Validação inicial da tarefa e revisor
    const task = await this.fastify.prisma.task.findUnique({
      where: { id: parseInt(taskId) },
    });

    if (!task || task.house_id !== houseId) {
      return reply.code(404).send({ message: "Task not found in your house." });
    }

    // 2. Regra de Negócio: O responsável não pode se auto-avaliar
    if (task.responsible_id === reviewerId) {
      return reply
        .code(403)
        .send({ message: "Responsible user cannot review their own task." });
    }

    // 3. Regra de Negócio: Só pode avaliar se o status for AWAITING_REVIEW
    if (task.status !== "AWAITING_REVIEW") {
      return reply
        .code(400)
        .send({
          message: `Task status is '${task.status}'. Must be AWAITING_REVIEW to be reviewed.`,
        });
    }

    try {
      const updatedTask = await this.taskService.reviewTask(
        parseInt(taskId),
        reviewerId,
        stars
      );

      reply.code(200).send({
        id: updatedTask.id,
        title: updatedTask.title,
        status: updatedTask.status,
        starAverage: updatedTask.star_average
          ? updatedTask.star_average.toString()
          : null,
        message: "Task reviewed successfully. Responsible score updated.",
      });
    } catch (error) {
      this.fastify.log.error(error);
      if (error.message.includes("Stars must be between")) {
        return reply.code(400).send({ message: error.message });
      }
      reply.code(500).send({ message: "Could not process task review." });
    }
  }
}
