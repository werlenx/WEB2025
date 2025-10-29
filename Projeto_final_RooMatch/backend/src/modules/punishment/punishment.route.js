import { PunishmentController } from "./punishment.controller.js";

export async function punishmentRoutes(fastify) {
  const punishmentController = new PunishmentController(fastify);

  // Hook para autenticação
  fastify.addHook("onRequest", fastify.authenticate);

  const punishmentSchema = {
    type: "object",
    properties: {
      id: { type: "number" },
      house_id: { type: "number" },
      description: { type: "string" },
      penalty_points: { type: "number" },
      is_active: { type: "boolean" },
      created_at: { type: "string", format: "date-time" },
    },
  };

  // GET /punishments/ - Lista todas as punições ativas
  fastify.get(
    "/",
    {
      schema: {
        tags: ["Punishments"],
        summary: "Lista todas as punições ativas disponíveis na casa.",
        security: [{ apiKey: [] }],
        response: {
          200: {
            type: "array",
            items: punishmentSchema,
          },
          400: { type: "object", properties: { message: { type: "string" } } },
        },
      },
    },
    punishmentController.getPunishmentsHandler.bind(punishmentController)
  );

  // POST /punishments/apply - Aplica uma punição a um usuário.
  fastify.post(
    "/apply",
    {
      schema: {
        tags: ["Punishments"],
        summary: "Aplica uma punição a um membro da casa (Requer ADMIN).",
        security: [{ apiKey: [] }],
        body: {
          type: "object",
          required: ["punishmentId", "targetUserId"],
          properties: {
            punishmentId: {
              type: "number",
              description: "ID da punição a ser aplicada.",
            },
            targetUserId: {
              type: "number",
              description: "ID do usuário que receberá a penalidade.",
            },
          },
        },
        response: {
          200: {
            type: "object",
            properties: {
              targetUser: {
                type: "object",
                properties: {
                  id: { type: "number" },
                  name: { type: "string" },
                  newScore: { type: "number" },
                },
              },
              punishment: {
                type: "object",
                properties: {
                  id: { type: "number" },
                  description: { type: "string" },
                  penaltyPoints: { type: "number" },
                },
              },
              message: { type: "string" },
            },
          },
          403: { type: "object", properties: { message: { type: "string" } } },
          404: { type: "object", properties: { message: { type: "string" } } },
        },
      },
    },
    punishmentController.applyPunishmentHandler.bind(punishmentController)
  );
}
