import { HistoryService } from "./history.service.js";

export class HistoryController {
  constructor(fastify) {
    this.fastify = fastify;
    this.historyService = new HistoryService(fastify.prisma);
  }

  // GET /history/
  async getHistoryHandler(request, reply) {
    const houseId = request.user && request.user.houseId;

    if (!houseId) {
      return reply.code(400).send({ message: "User must belong to a house." });
    }

    try {
      const history = await this.historyService.getHistory(houseId);

      // Formatação simples para garantir que todos os campos necessários estejam presentes
      const formattedHistory = history.map((item) => ({
        id: item.id,
        eventType: item.event_type,
        description: item.description,
        createdAt: item.created_at,
        user: item.user
          ? {
              id: item.user.id,
              name: item.user.name,
              avatarColor: item.user.avatar_color,
            }
          : null,
      }));

      reply.code(200).send(formattedHistory);
    } catch (error) {
      this.fastify.log.error(error);
      reply.code(500).send({ message: "Could not fetch house history." });
    }
  }
}
