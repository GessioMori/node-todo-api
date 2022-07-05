import { ICreateTodoDTO } from "@modules/todos/dtos/ICreateTodoDTO";
import { ITodo } from "@modules/todos/entities/ITodo";
import { Todo } from "@modules/todos/entities/typeorm/Todo";
import { ITodosRepository } from "@modules/todos/repositories/ITodosRepository";

export class TodosRepositoryInMemory implements ITodosRepository {
  private items: Todo[] = [];

  async createTodo(
    { account_id, content, is_completed, due_to }: ICreateTodoDTO,
    id?: string
  ): Promise<ITodo> {
    const newTodo: Todo = new Todo(
      {
        account_id,
        content,
        due_to,
        is_completed,
      },
      id
    );

    if (id) {
      const index = this.items.findIndex((todo) => todo.id === id);
      this.items[index] = newTodo;
    } else {
      this.items.push(newTodo);
    }

    return newTodo;
  }

  async findByAccountId(account_id: string): Promise<ITodo[]> {
    const todos = this.items.filter((todo) => todo.account_id === account_id);
    return todos;
  }

  async findById(id: string): Promise<ITodo> {
    const todo = this.items.find((todo) => todo.id === id);
    return todo;
  }

  async deleteById(id: string): Promise<void> {
    this.items = this.items.filter((todo) => todo.id !== id);
  }
}
