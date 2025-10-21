import { HouseController } from "./house.controller.js";

export async function houseRoutes(fastify) {
  const houseController = new HouseController(fastify);

  fastify.addHook("onRequest", fastify.authenticate);

  const memberSchema = {
    type: "object",
    properties: {
      id: { type: "number" },
      name: { type: "string" },
      email: { type: "string" },
      score: { type: "number" },
      star_avg: { type: "string" },
      avatar_color: { type: "string" },
      role: { type: "string" },
    },
  };

  fastify.post(
    "/",
    {
      schema: {
        tags: ["House"],
        summary:
          "Cria uma nova casa e define o usuário como Admin. Requer que o usuário NÃO tenha casa.",
        security: [{ apiKey: [] }],
        body: {
          type: "object",
          required: ["houseName"],
          properties: {
            houseName: { type: "string" },
          },
        },
        response: {
          201: {
            type: "object",
            properties: {
              id: { type: "number" },
              name: { type: "string" },
              code: { type: "string" },
              message: { type: "string" },
            },
          },
        },
      },
    },
    houseController.createHouseHandler.bind(houseController)
  );

  fastify.post(
    "/join",
    {
      schema: {
        tags: ["House"],
        summary: "Solicita entrada em uma casa via código de convite.",
        security: [{ apiKey: [] }],
        body: {
          type: "object",
          required: ["houseCode"],
          properties: {
            houseCode: { type: "string" },
            automaticApproval: {
              type: "boolean",
              default: false,
              description:
                "Se true, forçará a aprovação se a regra de negócio permitir.",
            },
          },
        },
        response: {
          200: {
            type: "object",
            properties: {
              house: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  code: { type: "string" },
                },
              },
              houseStatus: { type: "string" },
              message: { type: "string" },
            },
          },
        },
      },
    },
    houseController.joinHouseHandler.bind(houseController)
  );

  fastify.get(
    "/",
    {
      schema: {
        tags: ["House"],
        summary:
          "Obtém os detalhes da casa atual (membros aprovados e pendentes).",
        security: [{ apiKey: [] }],
        response: {
          200: {
            type: "object",
            properties: {
              id: { type: "number" },
              name: { type: "string" },
              code: { type: "string" },
              adminId: { type: "number" },
              members: { type: "array", items: memberSchema },
              pendingMembers: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    id: { type: "number" },
                    name: { type: "string" },
                    email: { type: "string" },
                  },
                },
              },
            },
          },
        },
      },
    },
    houseController.getHouseHandler.bind(houseController)
  );
}
