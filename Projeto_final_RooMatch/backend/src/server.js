import Fastify from "fastify";
import cors from "@fastify/cors";
import fastifyJwt from "@fastify/jwt";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import "dotenv/config";

import { authRoutes } from "./modules/auth/auth.route.js";
import { houseRoutes } from "./modules/house/house.route.js";
import { taskRoutes } from "./modules/task/task.route.js";
import { accountRoutes } from "./modules/accounts/account.route.js";
import { userRoutes } from "./modules/users/user.route.js";
import { punishmentRoutes } from "./modules/punishment/punishment.route.js";
import { historyRoutes } from "./modules/history/history.route.js";

import prismaPlugin from "../plugins/prisma.js";

async function startServer() {
  const fastify = Fastify({
    logger: true,
  });

  await fastify.register(cors, {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  });

  await fastify.register(prismaPlugin);

  await fastify.register(fastifyJwt, {
    secret: process.env.JWT_SECRET,
  });

  fastify.decorate("authenticate", async function (request, reply) {
    try {
      await request.jwtVerify();
    } catch (err) {
      // console.error("JWT Verification Error:", err.message); // Uncomment for debug
      reply.code(401).send({ message: "Unauthorized", error: err.message });
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

  await fastify.register(authRoutes, { prefix: "/auth" });
  await fastify.register(houseRoutes, { prefix: "/house" });
  await fastify.register(taskRoutes, { prefix: "/tasks" });
  await fastify.register(accountRoutes, { prefix: "/accounts" });
  await fastify.register(userRoutes, { prefix: "/users" });
  await fastify.register(punishmentRoutes, { prefix: "/punishments" });
  await fastify.register(historyRoutes, { prefix: "/history" });

  fastify.get("/", async (request, reply) => {
    return { status: "ok", message: "RooMatchApp API!" };
  });

  const port = process.env.PORT || 3333;

  try {
    await fastify.listen({ port });
    console.log(`\nServidor rodando em: http://localhost:${port}`);
    console.log(`Documentação em: http://localhost:${port}/docs`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

startServer();
