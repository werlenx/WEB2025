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
}
