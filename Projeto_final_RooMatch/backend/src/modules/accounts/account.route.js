import { AccountController } from "./account.controller.js";

export async function accountRoutes(fastify) {
  const accountController = new AccountController(fastify);

  // Hook para autenticação
  fastify.addHook("onRequest", fastify.authenticate);

  // POST /accounts/ - Cria uma nova conta/despesa.
  fastify.post(
    "/",
    {
      schema: {
        tags: ["Accounts"],
        summary:
          "Cria uma nova conta (despesa) e divide o valor igualmente entre os membros aprovados.",
        security: [{ apiKey: [] }],
        body: {
          type: "object",
          required: ["name", "type", "amount", "dueDate"],
          properties: {
            name: { type: "string" },
            type: {
              type: "string",
              enum: ["FIXED", "FLOATING"],
              description:
                "Tipo da conta: FIXA (ex: aluguel) ou VARIÁVEL (ex: compras).",
            },
            amount: { type: "number", description: "Valor total da despesa." },
            dueDate: {
              type: "string",
              format: "date",
              description: "Data de vencimento (YYYY-MM-DD).",
            },
          },
        },
        response: {
          201: {
            type: "object",
            properties: {
              id: { type: "number" },
              name: { type: "string" },
              amount: { type: "string" },
              dueDate: { type: "string" },
              message: { type: "string" },
            },
          },
          400: { type: "object", properties: { message: { type: "string" } } },
        },
      },
    },
    accountController.createAccountHandler.bind(accountController)
  );
}
