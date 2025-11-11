import sqlite3 from "sqlite3";
import { open } from "sqlite";

export async function abrirDB() {
  return open({
    filename: "./database.db",
    driver: sqlite3.Database,
  });
}

export async function inicializarDB() {
  const db = await abrirDB();
  await db.exec(`
    CREATE TABLE IF NOT EXISTS palavras (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      palavra TEXT NOT NULL,
      dica TEXT NOT NULL
    );
  `);
  console.log("Banco de dados inicializado com sucesso!");
}
