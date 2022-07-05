import { CreateTodoController } from "@modules/todos/useCases/createTodo/CreateTodoController";
import { GetTodoController } from "@modules/todos/useCases/getTodo/GetTodoController";
import { GetTodosController } from "@modules/todos/useCases/getTodos/GetTodosController";
import { Router } from "express";
import { authenticate } from "../middlewares/authentication";

const todosRoutes = Router();

const createTodoController = new CreateTodoController();
const getTodosController = new GetTodosController();
const getTodoController = new GetTodoController();

todosRoutes.post("/", authenticate, createTodoController.handle);
todosRoutes.get("/", authenticate, getTodosController.handle);
todosRoutes.get("/:id", authenticate, getTodoController.handle);

export { todosRoutes };
