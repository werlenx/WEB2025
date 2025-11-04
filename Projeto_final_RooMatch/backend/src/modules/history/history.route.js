import { HistoryController } from "./history.controller.js";

export async function historyRoutes(fastify) {
  const historyController = new HistoryController(fastify);

  fastify.addHook("onRequest", fastify.authenticate);

  const historySchema = {
    type: "object",
    properties: {
      id: { type: "number" },
      eventType: {
        type: "string",
        description:
          "Tipo de evento (TASK_COMPLETED, PUNISHMENT_APPLIED, etc.).",
      },
      description: { type: "string" },
      createdAt: { type: "string", format: "date-time" },
      user: {
        type: "object",
        nullable: true,
        properties: {
          id: { type: "number" },
          name: { type: "string" },
          avatarColor: { type: "string", nullable: true },
        },
      },
    },
  };

  fastify.get(
    "/",
    {
      schema: {
        tags: ["History"],
        summary:
          "Lista os eventos recentes do histórico (feed de atividades) da casa.",
        security: [{ apiKey: [] }],
        response: {
          200: {
            type: "array",
            items: historySchema,
          },
          400: { type: "object", properties: { message: { type: "string" } } },
        },
      },
    },
    historyController.getHistoryHandler.bind(historyController)
  );
}
