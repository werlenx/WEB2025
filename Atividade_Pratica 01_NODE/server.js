import express from "express";
import taskRoutes from "./routes/taskRoutes.js";
import { nowISO } from "./utils/date.js";

const app = express();

app.use(express.json());

app.get("/health", (req, res) => res.json({ status: "ok", time: nowISO() }));

app.use(taskRoutes);

app.use((req, res) => {
  res.status(404).send("Rota não encontrada.");
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send("Erro interno do servidor.");
});

const PORT = 5006;

app.listen(PORT, () => console.log(`Rodando em http://localhost:${PORT}`));
