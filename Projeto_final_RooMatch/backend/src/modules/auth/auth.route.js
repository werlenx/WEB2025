import { AuthController } from "./auth.controller.js";

export async function authRoutes(fastify) {
  // Instancia o Controller
  const authController = new AuthController(fastify);

  // Rota de Registro (Cadastro de novo Usuário)
  fastify.post(
    "/register",
    {
      schema: {
        tags: ["Auth"],
        summary: "Cadastra um novo usuário (Common) com status PENDING.",
        body: {
          type: "object",
          required: ["name", "email", "password"],
          properties: {
            name: { type: "string" },
            email: { type: "string", format: "email" },
            password: { type: "string", minLength: 3 },
          },
        },
        response: {
          201: {
            type: "object",
            properties: {
              id: { type: "number" },
              name: { type: "string" },
              email: { type: "string" },
              message: { type: "string" },
            },
          },
          409: { type: "object", properties: { message: { type: "string" } } },
        },
      },
    },
    authController.registerHandler.bind(authController)
  );

  // Rota de Login (Geração de JWT)
  fastify.post(
    "/login",
    {
      schema: {
        tags: ["Auth"],
        summary: "Autentica o usuário e retorna um JWT para rotas protegidas.",
        body: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: { type: "string", format: "email" },
            password: { type: "string" },
          },
        },
        response: {
          200: {
            type: "object",
            properties: {
              token: { type: "string" },
              user: {
                type: "object",
                properties: {
                  id: { type: "number" },
                  name: { type: "string" },
                  email: { type: "string" },
                  role: { type: "string", description: "ADMIN ou COMMON" },
                  houseId: { type: "number", nullable: true },
                  houseStatus: { type: "string" },
                  score: { type: "number" },
                  starAvg: { type: "string" },
                },
              },
            },
          },
          401: { type: "object", properties: { message: { type: "string" } } },
        },
      },
    },
    authController.loginHandler.bind(authController)
  );
}
