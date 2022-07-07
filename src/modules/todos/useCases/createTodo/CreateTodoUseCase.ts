import { ICreateTodoDTO } from "@modules/todos/dtos/ICreateTodoDTO";
import { ITodo } from "@modules/todos/entities/ITodo";
import { ITodosRepository } from "@modules/todos/repositories/ITodosRepository";
import { AppError } from "@shared/errors/AppError";
import { inject, injectable } from "tsyringe";

@injectable()
export class CreateTodoUseCase {
  constructor(
    @inject("TodosRepository") private todosRepository: ITodosRepository
  ) {}

  async execute({
    account_id,
    content,
    is_completed,
    due_to,
  }: ICreateTodoDTO): Promise<ITodo> {
    if (!content) {
      throw new AppError("Todo content is required.");
    }

    const newTodo = await this.todosRepository.createTodo({
      account_id,
      content,
      is_completed,
      due_to,
    });

    delete newTodo.account_id;

    return newTodo;
  }
}
