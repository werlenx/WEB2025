import fastfy from "fastify";
import { knex } from "./database/knex";

const app = fastfy();

app.get("/turmas", async () => {
  const turmas = await knex("turmas").select().orderBy("nome");
  return { turmas };
});

app.post("/turmas", async () => {
  const users = await knex("users").select("*");
  return { users };
});

app.listen({ port: 3000 }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server running at ${address}`);
});
