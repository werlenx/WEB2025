import Fastify from "fastify";
import cors from "@fastify/cors";
import fastifyJwt from "@fastify/jwt";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import "dotenv/config";

// --- NOVAS IMPORTAÇÕES DE MÓDULOS DE ROTAS ---
import { authRoutes } from "./modules/auth/auth.route.js";
import { houseRoutes } from "./modules/house/house.route.js";

import prismaPlugin from "../plugins/prisma.js";

async function startServer() {
  const fastify = Fastify({
    logger: true, // logger útil para desenvolvimento
  });

  // --- 1. REGISTRO DE PLUGINS DE INFRAESTRUTURA ---

  await fastify.register(cors, {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  });

  await fastify.register(prismaPlugin);

  await fastify.register(fastifyJwt, {
    secret: process.env.JWT_SECRET || "fallback_secret_in_development_only",
  });

  // NOVO: Adiciona um hook de autenticação globalmente (para rotas protegidas)
  fastify.decorate("authenticate", async function (request, reply) {
    try {
      await request.jwtVerify();
      // O payload do JWT é injetado em request.user (útil para extrair id e houseId)
    } catch (err) {
      reply.send(err);
    }
  });

  await fastify.register(swagger, {
    swagger: {
      info: {
        title: "RooMatch API",
        description:
          "Documentação da API REST do RooMatch (Tasks, Users, Accounts)",
        version: "1.0.0",
      },
      securityDefinitions: {
        apiKey: {
          type: "apiKey",
          name: "Authorization",
          in: "header",
        },
      },
    },
  });

  await fastify.register(swaggerUi, {
    routePrefix: "/docs",
  });

  // --- 2. REGISTRO DE ROTAS (MVC) ---

  // Rotas de Autenticação (Públicas: /auth/login, /auth/register)
  await fastify.register(authRoutes, { prefix: "/auth" });

  // Rotas de Casa (Protegidas: /house, /house/join)
  await fastify.register(houseRoutes, { prefix: "/house" });

  // Rota de teste simples (MANTIDA)
  fastify.get("/", async (request, reply) => {
    return { status: "ok", message: "RooMatch API is running!" };
  });

  const port = process.env.PORT || 3333;

  try {
    await fastify.listen({ port });
    console.log(`\nServidor rodando em: http://localhost:${port}`);
    console.log(`Documentação (Swagger UI): http://localhost:${port}/docs`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

startServer();
