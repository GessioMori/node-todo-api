import { CreateTodoController } from "@modules/todos/useCases/createTodo/CreateTodoController";
import { Router } from "express";
import { authenticate } from "../middlewares/authentication";

const todosRoutes = Router();

const createTodoController = new CreateTodoController();

todosRoutes.get("/", authenticate, (req, res) => {
  return res.json({ message: req.account.account_id });
});

todosRoutes.post("/create", authenticate, createTodoController.handle);

export { todosRoutes };
