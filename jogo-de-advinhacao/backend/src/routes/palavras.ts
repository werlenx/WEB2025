import { Router } from "express";
import { abrirDB } from "../db.js";

const router = Router();

router.get("/", async (req, res) => {
  const db = await abrirDB();
  const palavras = await db.all("SELECT * FROM palavras");
  res.json(palavras);
});

router.post("/", async (req, res) => {
  const { palavra, dica } = req.body;
  if (!palavra || !dica) {
    return res.status(400).json({ erro: "Campos obrigatórios: palavra e dica" });
  }
  const db = await abrirDB();
  await db.run("INSERT INTO palavras (palavra, dica) VALUES (?, ?)", [palavra, dica]);
  res.json({ mensagem: "Palavra adicionada com sucesso!" });
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const db = await abrirDB();
  await db.run("DELETE FROM palavras WHERE id = ?", [id]);
  res.json({ mensagem: "Palavra removida." });
});


router.put("/:id", async (req, res) => {  
  const { id } = req.params;
  const { palavra, dica } = req.body;
  if (!palavra || !dica) {
    return res.status(400).json({ erro: "Campos obrigatórios: palavra e dica" });
  }

  try {
    const db = await abrirDB();
    const result = await db.run(
      "UPDATE palavras SET palavra = ?, dica = ? WHERE id = ?",
      [palavra, dica, id]
    );
    if (result && typeof result.changes === "number" && result.changes > 0) {
      return res.json({ mensagem: "Palavra atualizada com sucesso!" });
    } else {
      console.warn(`PUT /api/palavras/${id} - nenhuma linha alterada`);
      return res.status(404).json({ erro: "Palavra não encontrada" });
    }
  } catch (err) {
    console.error(`Erro PUT /api/palavras/${id}:`, err);
    return res.status(500).json({ erro: "Erro interno ao atualizar palavra" });
  }
});

export default router;
