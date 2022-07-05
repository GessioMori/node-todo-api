import { ICreateTodoDTO } from "@modules/todos/dtos/ICreateTodoDTO";
import { ITodo } from "@modules/todos/entities/ITodo";
import { Todo } from "@modules/todos/entities/typeorm/Todo";
import { AppDataSource } from "@shared/infra/typeorm";
import { Repository } from "typeorm";
import { ITodosRepository } from "../ITodosRepository";

export class TodosRepository implements ITodosRepository {
  private repository: Repository<Todo>;

  constructor() {
    this.repository = AppDataSource.getRepository(Todo);
  }

  async createTodo(
    { account_id, content, is_completed, due_to }: ICreateTodoDTO,
    id?: string
  ): Promise<ITodo> {
    const newTodo = this.repository.create({
      account_id,
      content,
      is_completed,
      due_to,
      id,
    });

    await this.repository.save(newTodo);

    return newTodo;
  }

  async findByAccountId(account_id: string): Promise<ITodo[]> {
    const todos = await this.repository.findBy({
      account_id,
    });

    return todos;
  }

  async findById(id: string): Promise<ITodo> {
    const todo = await this.repository.findOne({ where: { id } });
    return todo;
  }

  async deleteById(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
