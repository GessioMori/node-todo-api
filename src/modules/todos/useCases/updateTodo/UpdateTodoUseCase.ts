import { IUpdateTodoDTO } from "@modules/todos/dtos/IUpdateTodoDTO";
import { ITodo } from "@modules/todos/entities/ITodo";
import { ITodosRepository } from "@modules/todos/repositories/ITodosRepository";
import { AppError } from "@shared/errors/AppError";
import { inject, injectable } from "tsyringe";
import { validate } from "uuid";

@injectable()
export class UpdateTodoUseCase {
  constructor(
    @inject("TodosRepository") private todosRepository: ITodosRepository
  ) {}

  async execute(
    { id, content, due_to, is_completed }: IUpdateTodoDTO,
    account_id: string
  ): Promise<ITodo> {
    if (!validate(id) || !validate(account_id)) {
      throw new AppError("Invalid uuid.");
    }

    const todo = await this.todosRepository.findById(id);

    if (!todo) {
      throw new AppError("Todo not found.");
    }

    if (todo.account_id !== account_id) {
      throw new AppError("Not allowed");
    }

    if (content) {
      todo.content = content;
    }
    if (due_to) {
      todo.due_to = due_to;
    }
    if (is_completed !== undefined) {
      todo.is_completed = is_completed;
    }

    const newTodo = await this.todosRepository.createTodo(todo, todo.id);

    return newTodo;
  }
}
