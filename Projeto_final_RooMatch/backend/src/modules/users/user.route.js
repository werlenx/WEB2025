import { UserController } from "./user.controller.js";

export async function userRoutes(fastify) {
  const userController = new UserController(fastify);

  fastify.addHook("onRequest", fastify.authenticate);

  // PATCH /users/me - Atualiza o perfil do usuário logado
  fastify.get(
    "/me",
    {
      schema: {
        tags: ["Users"],
        summary: "Obtém o perfil do usuário logado.",
        security: [{ apiKey: [] }],
        response: {
          200: {
            type: "object",
            properties: {
              user: {
                type: "object",
                properties: {
                  id: { type: "number" },
                  name: { type: "string" },
                  email: { type: "string" },
                  role: { type: "string" },
                  houseId: { type: "number", nullable: true },
                  houseStatus: { type: "string" },
                  score: { type: "number" },
                  starAvg: { type: "string" },
                  avatarColor: { type: "string", nullable: true },
                },
              },
              message: { type: "string" },
            },
          },
          401: { type: "object", properties: { message: { type: "string" } } },
        },
      },
    },
    userController.getMeHandler.bind(userController)
  );

  // PATCH /users/me - Atualiza o perfil do usuário logado
  fastify.patch(
    "/me",
    {
      schema: {
        tags: ["Users"],
        summary:
          "Atualiza o perfil do usuário logado (nome, email, avatarColor).",
        security: [{ apiKey: [] }],
        body: {
          type: "object",
          properties: {
            name: { type: "string", nullable: true },
            email: { type: "string", format: "email", nullable: true },
            avatarColor: { type: "string", nullable: true },
          },
        },
        response: {
          200: {
            type: "object",
            properties: {
              user: {
                type: "object",
                properties: {
                  id: { type: "number" },
                  name: { type: "string" },
                  email: { type: "string" },
                  role: { type: "string" },
                  houseId: { type: "number", nullable: true },
                  houseStatus: { type: "string" },
                  score: { type: "number" },
                  starAvg: { type: "string" },
                  avatarColor: { type: "string", nullable: true },
                },
              },
              message: { type: "string" },
            },
          },
          409: { type: "object", properties: { message: { type: "string" } } },
        },
      },
    },
    userController.updateProfileHandler.bind(userController)
  );
}
