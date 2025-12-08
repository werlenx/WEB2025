import fastify from "fastify";
import sqlite3 = require("sqlite3");
import { open } from "sqlite";
import { Database } from "sqlite";
import bcrypt from "bcrypt";
import cors from "@fastify/cors";

let db: Database;
const port = 3000;

async function conectDb() {
  try {
    db = await open({
      filename: "/home/mrx/Documentos/webII_2025/atv_04/api/database.sqlite",
      driver: sqlite3.Database,
    });
    console.log("Conectado.");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}

async function startServer() {
  await conectDb();

  const app = fastify({ logger: true });

  await app.register(cors, {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"],
  });

  // Rotas
  app.get("/", async (request, reply) => {
    return { message: "Servidor rodando!" };
  });

  //register
  app.post("/register", async (request, reply) => {
    const { name, email, password } = request.body as any;

    if (!name || !email || !password) {
      return reply
        .status(400)
        .send({ error: "Nome, email e senha são obrigatórios." });
    }

    try {
      const user = await db.get("SELECT * FROM user WHERE email = ?", [email]);

      if (user) {
        return reply.status(409).send({ error: "Usuário já existe." });
      }
      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await db.run(
        "INSERT INTO user (name, email, password, role) VALUES (?, ?, ?, ?)",
        [name, email, hashedPassword, "user"]
      );

      return reply.status(201).send({
        message: "Usuário registrado com sucesso.",
        userId: newUser.lastID,
      });
    } catch (error) {
      console.log(error);
      return reply.status(500).send({ error: "Erro ao registrar usuário." });
    }
  });

  //login
  app.post("/login", async (request, reply) => {
    const { email, password } = request.body as any;

    if (!email || !password) {
      return reply.code(400).send({ error: "Email e senha são obrigatórios." });
    }

    try {
      const user = await db.get(
        "SELECT id, name, email, password, role FROM user WHERE email = ?",
        [email]
      );

      if (!user) {
        return reply.code(401).send({ error: "Credenciais inválidas." });
      }

      const match = await bcrypt.compare(password, user.password);

      if (!match) {
        return reply.code(401).send({ error: "Credenciais inválidas." });
      }

      const { password: _, ...userData } = user;

      return reply.code(200).send({
        message: "Login bem-sucedido.",
        user: userData,
      });
    } catch (error) {
      app.log.error(error);
      return reply.code(500).send({ error: "Erro interno do servidor." });
    }
  });

  //list
  app.get("/users", async (request, reply) => {
    const { role } = request.query as any;

    if (role !== "admin") {
      return reply.code(403).send({ error: "Acesso negado." });
    }

    try {
      const users = await db.all("SELECT id, name, email, role FROM user");
      return reply.code(200).send({ users });
    } catch (error) {
      console.log(error);
      return reply.code(500).send({ error: "Erro ao buscar usuários." });
    }
  });

  //delete
  app.delete("/users/:id", async (request, reply) => {
    const { id } = request.params as any;
    const { role } = request.query as any;

    if (role !== "admin") {
      return reply.code(403).send({ error: "Acesso negado." });
    }

    try {
      const result = await db.run("DELETE FROM user WHERE id = ?", [id]);

      if (result.changes === 0) {
        return reply.code(404).send({ error: "Usuário não encontrado." });
      }

      return reply.code(200).send({
        message: `Usuário com ID ${id} deletado com sucesso.`,
      });
    } catch (error) {
      request.log.error(error);
      return reply
        .code(500)
        .send({ error: "Erro interno do servidor ao deletar." });
    }
  });

  //start server
  try {
    await app.listen({ port: port });
    console.log(`Rodando na porta ${port}`);
  } catch (error) {
    console.log(error);
  }
}

startServer();
