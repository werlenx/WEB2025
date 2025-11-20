import fastfy from "fastify";
import sqlite3 = require("sqlite3");
import { open } from "sqlite";
import { Database } from "sqlite";

let db: Database;
const port = 3000;

async function conectDb() {
  try {
    db = await open({
      filename: "../database.sqlite",
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

  const app = fastfy({ logger: true });

  app.get("/", async (request, reply) => {
    return { message: "Servidor rodando!" };
  });

  try {
    await app.listen({ port: port });
    console.log(`Rodando na porta ${port}`);
  } catch (error) {
    console.log(error);
  }
}

startServer();
