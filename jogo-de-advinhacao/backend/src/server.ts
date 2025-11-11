import express from "express";
import cors from "cors";
import palavrasRoutes from "./routes/palavras.js";
import { inicializarDB } from "./db.js";

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

(async () => {
  await inicializarDB();
  app.use("/api/palavras", palavrasRoutes);

  app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
  });
})();
