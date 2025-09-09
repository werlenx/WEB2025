import Database from "better-sqlite3";

const db = new Database("./tasks.db");
db.pragma("journal_mode = WAL");

db.prepare(
  `
CREATE TABLE IF NOT EXISTS tasks (
id TEXT PRIMARY KEY,
title TEXT NOT NULL,
description TEXT NOT NULL,
completed_at TEXT NULL,
created_at TEXT NOT NULL,
updated_at TEXT NOT NULL
)
`
).run();

export default db;
