import { ICreateTodoDTO } from "@modules/todos/dtos/ICreateTodoDTO";
import { ITodo } from "@modules/todos/entities/ITodo";
import { Todo } from "@modules/todos/entities/typeorm/Todo";
import { ITodosRepository } from "@modules/todos/repositories/ITodosRepository";

export class TodosRepositoryInMemory implements ITodosRepository {
  private items: Todo[] = [];

  async createTodo({
    account_id,
    content,
    is_completed,
    due_to,
  }: ICreateTodoDTO): Promise<ITodo> {
    const newTodo: Todo = new Todo({
      account_id,
      content,
      due_to,
      is_completed,
    });

    this.items.push(newTodo);

    return newTodo;
  }
}
