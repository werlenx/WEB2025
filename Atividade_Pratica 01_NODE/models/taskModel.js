import db from "../db.js";

// Função para mapear os dados do banco
const mapRow = (row) => ({ ...row });

export const createTask = ({
  id,
  title,
  description,
  created_at,
  updated_at,
}) => {
  const stmt = db.prepare(`
INSERT INTO tasks (id, title, description, completed_at, created_at, updated_at)
VALUES (@id, @title, @description, NULL, @created_at, @updated_at)
`);
  stmt.run({ id, title, description, created_at, updated_at });
  return getTaskById(id);
};

export const getTaskById = (id) => {
  const row = db.prepare("SELECT * FROM tasks WHERE id = ?").get(id);
  return row ? mapRow(row) : null;
};

export const listTasks = ({ title, description }) => {
  let sql = "SELECT * FROM tasks";
  const where = [];
  const params = [];

  if (title) {
    where.push("title LIKE ?");
    params.push(`%${title}%`);
  }
  if (description) {
    where.push("description LIKE ?");
    params.push(`%${description}%`);
  }
  if (where.length) sql += " WHERE " + where.join(" AND ");
  sql += " ORDER BY created_at DESC";

  return db
    .prepare(sql)
    .all(...params)
    .map(mapRow);
};

export const updateTask = (id, { title, description, updated_at }) => {
  const setParts = [];
  const params = [];

  if (title !== undefined) {
    setParts.push("title = ?");
    params.push(title);
  }

  if (description !== undefined) {
    setParts.push("description = ?");
    params.push(description);
  }

  setParts.push("updated_at = ?");
  params.push(updated_at);
  params.push(id);

  db.prepare(`UPDATE tasks SET ${setParts.join(", ")} WHERE id = ?`).run(
    ...params
  );
  return getTaskById(id);
};

export const deleteTask = (id) => {
  db.prepare("DELETE FROM tasks WHERE id = ?").run(id);
};

export const toggleCompleteTask = (id, { completed_at, updated_at }) => {
  db.prepare(
    "UPDATE tasks SET completed_at = ?, updated_at = ? WHERE id = ?"
  ).run(completed_at, updated_at, id);
  return getTaskById(id);
};
