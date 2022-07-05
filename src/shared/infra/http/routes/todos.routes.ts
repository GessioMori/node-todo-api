import { CreateTodoController } from "@modules/todos/useCases/createTodo/CreateTodoController";
import { DeleteTodoController } from "@modules/todos/useCases/deleteTodo/DeleteTodoController";
import { GetTodoController } from "@modules/todos/useCases/getTodo/GetTodoController";
import { GetTodosController } from "@modules/todos/useCases/getTodos/GetTodosController";
import { UpdateTodoController } from "@modules/todos/useCases/updateTodo/UpdateTodoController";
import { authenticate } from "@shared/infra/http/middlewares/authentication";
import { Router } from "express";

const todosRoutes = Router();

const createTodoController = new CreateTodoController();
const getTodosController = new GetTodosController();
const getTodoController = new GetTodoController();
const updateTodoController = new UpdateTodoController();
const deleteTodoController = new DeleteTodoController();

todosRoutes.post("/", authenticate, createTodoController.handle);
todosRoutes.get("/", authenticate, getTodosController.handle);
todosRoutes.get("/:id", authenticate, getTodoController.handle);
todosRoutes.post("/:id", authenticate, updateTodoController.handle);
todosRoutes.delete("/:id", authenticate, deleteTodoController.handle);

export { todosRoutes };
