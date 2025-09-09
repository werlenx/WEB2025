import { Router } from "express";
import {
  create,
  list,
  update,
  remove,
  toggleComplete,
} from "../controllers/taskController.js";

const router = Router();
router.post("/tasks", create);
router.get("/tasks", list);
router.put("/tasks/:id", update);
router.delete("/tasks/:id", remove);
router.patch("/tasks/:id/complete", toggleComplete);
export default router;
