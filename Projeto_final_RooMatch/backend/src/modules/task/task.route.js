import { TaskController } from "./task.controller.js";

// Definição da estrutura de resposta para uma Tarefa (para Swagger)
const taskResponseSchema = {
  type: "object",
  properties: {
    id: { type: "number" },
    title: { type: "string" },
    description: { type: "string", nullable: true },
    frequency: {
      type: "string",
      description: "DAILY, WEEKLY, or MONTHLY",
    },
    points: { type: "number" },
    responsible_id: { type: "number", nullable: true },
    due_date: { type: "string", format: "date-time" },
    status: {
      type: "string",
      description:
        "PENDING, AWAITING_REVIEW, COMPLETED, FAILED, REDO, BOUGHT_OUT",
    },
    can_buy_out: { type: "boolean" },
    star_average: { type: "string", nullable: true },
    responsible: {
      type: "object",
      nullable: true,
      properties: {
        id: { type: "number" },
        name: { type: "string" },
        avatar_color: { type: "string", nullable: true },
      },
    },
  },
};

export async function taskRoutes(fastify) {
  const taskController = new TaskController(fastify);

  // Hook para autenticação: todas as rotas de Task requerem JWT.
  fastify.addHook("onRequest", fastify.authenticate);

  // POST /tasks/ - Cria uma nova tarefa na casa.
  fastify.post(
    "/",
    {
      schema: {
        tags: ["Tasks"],
        summary: "Cria uma nova tarefa para a casa.",
        security: [{ apiKey: [] }],
        body: {
          type: "object",
          required: ["title", "frequency", "points", "dueDate"],
          properties: {
            title: { type: "string" },
            description: { type: "string", nullable: true },
            frequency: {
              type: "string",
              enum: ["DAILY", "WEEKLY", "MONTHLY"],
              description: "Frequência da tarefa (DAILY, WEEKLY, MONTHLY)",
            },
            points: { type: "number" },
            responsibleId: {
              type: "number",
              nullable: true,
              description: "ID do membro responsável (opcional)",
            },
            dueDate: {
              type: "string",
              format: "date-time",
              description: "Data de vencimento da tarefa.",
            },
            canBuyOut: {
              type: "boolean",
              default: true,
              description: "Permite que a tarefa seja comprada/pulada.",
            },
          },
        },
        response: {
          201: {
            type: "object",
            properties: {
              id: { type: "number" },
              title: { type: "string" },
              responsibleId: { type: "number", nullable: true },
              dueDate: { type: "string" },
              message: { type: "string" },
            },
          },
          400: { type: "object", properties: { message: { type: "string" } } },
          404: { type: "object", properties: { message: { type: "string" } } },
        },
      },
    },
    taskController.createTaskHandler.bind(taskController)
  );

  // GET /tasks/ - Lista todas as tarefas ativas da casa.
  fastify.get(
    "/",
    {
      schema: {
        tags: ["Tasks"],
        summary: "Lista todas as tarefas da casa do usuário.",
        security: [{ apiKey: [] }],
        response: {
          200: {
            type: "array",
            items: taskResponseSchema,
          },
          404: { type: "object", properties: { message: { type: "string" } } },
        },
      },
    },
    taskController.getTasksHandler.bind(taskController)
  );

  fastify.patch(
    "/:taskId/status",
    {
      schema: {
        tags: ["Tasks"],
        summary:
          "Atualiza o status de uma tarefa. (Ex: PENDING -> AWAITING_REVIEW)",
        security: [{ apiKey: [] }],
        params: {
          type: "object",
          properties: {
            taskId: {
              type: "number",
              description: "ID da tarefa a ser atualizada.",
            },
          },
        },
        body: {
          type: "object",
          required: ["status"],
          properties: {
            status: {
              type: "string",
              enum: [
                "PENDING",
                "AWAITING_REVIEW",
                "COMPLETED",
                "FAILED",
                "REDO",
                "BOUGHT_OUT",
              ],
            },
          },
        },
        response: {
          200: {
            type: "object",
            properties: {
              id: { type: "number" },
              title: { type: "string" },
              status: { type: "string" },
              message: { type: "string" },
            },
          },
          400: { type: "object", properties: { message: { type: "string" } } },
          403: { type: "object", properties: { message: { type: "string" } } },
          404: { type: "object", properties: { message: { type: "string" } } },
        },
      },
    },
    taskController.updateTaskStatusHandler.bind(taskController)
  );

  fastify.post(
    "/:taskId/review",
    {
      schema: {
        tags: ["Tasks"],
        summary:
          "Avalia a tarefa (1 a 5 estrelas), calcula a média e pontua o responsável.",
        security: [{ apiKey: [] }],
        params: {
          type: "object",
          properties: {
            taskId: {
              type: "number",
              description: "ID da tarefa a ser avaliada.",
            },
          },
        },
        body: {
          type: "object",
          required: ["stars"],
          properties: {
            stars: {
              type: "number",
              minimum: 1,
              maximum: 5,
              description: "Avaliação em estrelas (1 a 5).",
            },
          },
        },
        response: {
          200: {
            type: "object",
            properties: {
              id: { type: "number" },
              title: { type: "string" },
              status: { type: "string" },
              starAverage: { type: "string", nullable: true },
              message: { type: "string" },
            },
          },
          400: { type: "object", properties: { message: { type: "string" } } },
          403: { type: "object", properties: { message: { type: "string" } } },
          404: { type: "object", properties: { message: { type: "string" } } },
        },
      },
    },
    taskController.reviewTaskHandler.bind(taskController)
  );
}
