import { ICreateTodoDTO } from "@modules/todos/dtos/ICreateTodoDTO";
import { ITodosRepository } from "@modules/todos/repositories/ITodosRepository";
import { AppError } from "@shared/errors/AppError";
import { mappedTodo, todoMapper } from "@utils/mappers/todoMapper";
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
  }: ICreateTodoDTO): Promise<mappedTodo> {
    if (!content) {
      throw new AppError("Todo content is required.");
    }

    const newTodo = await this.todosRepository.createTodo({
      account_id,
      content,
      is_completed,
      due_to,
    });

    return todoMapper(newTodo);
  }
}
