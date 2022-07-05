import { ITodosRepository } from "@modules/todos/repositories/ITodosRepository";
import { AppError } from "@shared/errors/AppError";
import { inject, injectable } from "tsyringe";
import { validate } from "uuid";

@injectable()
export class DeleteTodoUseCase {
  constructor(
    @inject("TodosRepository") private todosRepository: ITodosRepository
  ) {}

  async execute(id: string, account_id: string): Promise<void> {
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

    await this.todosRepository.deleteById(id);
  }
}