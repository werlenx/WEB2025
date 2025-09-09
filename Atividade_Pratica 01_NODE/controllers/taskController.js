import { randomUUID } from "crypto";
import { nowISO } from "../utils/date.js";
import {
  createTask,
  listTasks,
  getTaskById,
  updateTask,
  deleteTask,
  toggleCompleteTask,
} from "../models/taskModel.js";

export const create = (req, res) => {
  const { title, description } = req.body || {};

  if (!title || !title.trim())
    return res.status(400).json({ error: "title é obrigatório." });

  if (!description || !description.trim())
    return res.status(400).json({ error: "description é obrigatório." });

  const id = randomUUID();
  const created_at = nowISO();
  const updated_at = created_at;
  const task = createTask({
    id,
    title: title.trim(),
    description: description.trim(),
    created_at,
    updated_at,
  });
  res.status(201).json(task);
};

export const list = (req, res) => {
  const { title, description } = req.query;
  const tasks = listTasks({ title, description });
  res.json(tasks);
};

export const update = (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body || {};
  const task = getTaskById(id);
  if (!task) return res.status(404).json({ error: "Task não encontrada." });

  if (!title && !description)
    return res.status(400).json({ error: "Envie title ou description." });

  const updated = updateTask(id, {
    title: title?.trim(),
    description: description?.trim(),
    updated_at: nowISO(),
  });
  res.json(updated);
};

export const remove = (req, res) => {
  const { id } = req.params;
  const task = getTaskById(id);
  if (!task) return res.status(404).json({ error: "Task não encontrada." });
  deleteTask(id);
  res.status(204).send();
};

export const toggleComplete = (req, res) => {
  const { id } = req.params;
  const task = getTaskById(id);
  if (!task) return res.status(404).json({ error: "Task não encontrada." });

  const completed_at = task.completed_at ? null : nowISO();
  const updated = toggleCompleteTask(id, {
    completed_at,
    updated_at: nowISO(),
  });
  res.json(updated);
};
