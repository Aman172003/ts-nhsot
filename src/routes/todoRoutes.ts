import { Router } from "express";
import {
  getTodos,
  insertTodo,
  updateTodo,
  deleteTodo,
} from "../controllers/todoController";

const router = Router();

router.get("/", getTodos);
router.post("/", insertTodo);
router.put("/:id", updateTodo);
router.delete("/:id", deleteTodo);

export default router;
