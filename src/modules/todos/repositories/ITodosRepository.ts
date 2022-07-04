import { ICreateTodoDTO } from "@modules/todos/dtos/ICreateTodoDTO";
import { ITodo } from "@modules/todos/entities/ITodo";

export interface ITodosRepository {
  createTodo(data: ICreateTodoDTO, id?: string): Promise<ITodo>;
}
