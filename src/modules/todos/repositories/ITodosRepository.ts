import { ICreateTodoDTO } from "@modules/todos/dtos/ICreateTodoDTO";
import { ITodo } from "@modules/todos/entities/ITodo";

export interface ITodosRepository {
  createTodo(data: ICreateTodoDTO, id?: string): Promise<ITodo>;
  findByAccountId(account_id: string): Promise<ITodo[]>;
  findById(id: string): Promise<ITodo>;
  deleteById(id: string): Promise<void>;
}
