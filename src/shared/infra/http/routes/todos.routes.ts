import { CreateTodoController } from "@modules/todos/useCases/createTodo/CreateTodoController";
import { GetTodoController } from "@modules/todos/useCases/getTodo/GetTodoController";
import { GetTodosController } from "@modules/todos/useCases/getTodos/GetTodosController";
import { UpdateTodoController } from "@modules/todos/useCases/updateTodo/UpdateTodoController";
import { Router } from "express";
import { authenticate } from "../middlewares/authentication";

const todosRoutes = Router();

const createTodoController = new CreateTodoController();
const getTodosController = new GetTodosController();
const getTodoController = new GetTodoController();
const updateTodoController = new UpdateTodoController();

todosRoutes.post("/", authenticate, createTodoController.handle);
todosRoutes.get("/", authenticate, getTodosController.handle);
todosRoutes.get("/:id", authenticate, getTodoController.handle);
todosRoutes.post("/:id", authenticate, updateTodoController.handle);

export { todosRoutes };
