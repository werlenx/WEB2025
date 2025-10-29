import { AccountController } from "./account.controller.js";

export async function accountRoutes(fastify) {
  const accountController = new AccountController(fastify);

  // Hook para autenticação
  fastify.addHook("onRequest", fastify.authenticate);

  const paymentShareSchema = {
    type: "object",
    properties: {
      userId: { type: "number" },
      shareAmount: {
        type: "string",
        description: "Valor da parte (em string para precisão).",
      },
      isPaid: { type: "boolean" },
      user: {
        type: "object",
        properties: {
          id: { type: "number" },
          name: { type: "string" },
          avatar_color: { type: "string", nullable: true },
        },
      },
    },
  };

  const accountSchema = {
    type: "object",
    properties: {
      id: { type: "number" },
      name: { type: "string" },
      type: { type: "string" },
      amount: {
        type: "string",
        description: "Valor total (em string para precisão).",
      },
      dueDate: { type: "string", format: "date-time" },
      paidBy: {
        type: "object",
        properties: {
          id: { type: "number" },
          name: { type: "string" },
          avatar_color: { type: "string", nullable: true },
        },
      },
      paymentShares: { type: "array", items: paymentShareSchema },
    },
  };

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

  fastify.get(
    "/",
    {
      schema: {
        tags: ["Accounts"],
        summary:
          "Lista todas as contas (despesas) da casa, incluindo as partes individuais (PaymentShares).",
        security: [{ apiKey: [] }],
        response: {
          200: {
            type: "array",
            items: accountSchema,
          },
          400: { type: "object", properties: { message: { type: "string" } } },
        },
      },
    },
    accountController.getAccountsHandler.bind(accountController)
  );

  // PATCH /accounts/:accountId/pay - Marca a parte do usuário logado como paga.
  fastify.patch(
    "/:accountId/pay",
    {
      schema: {
        tags: ["Accounts"],
        summary:
          "Marca a parte da despesa (PaymentShare) do usuário logado como paga.",
        security: [{ apiKey: [] }],
        params: {
          type: "object",
          required: ["accountId"],
          properties: {
            accountId: { type: "number", description: "ID da conta/despesa." },
          },
        },
        response: {
          200: {
            type: "object",
            properties: {
              accountId: { type: "number" },
              shareAmount: { type: "string" },
              isPaid: { type: "boolean" },
              message: { type: "string" },
            },
          },
          400: { type: "object", properties: { message: { type: "string" } } },
          404: { type: "object", properties: { message: { type: "string" } } },
        },
      },
    },
    accountController.markShareAsPaidHandler.bind(accountController)
  );
}
