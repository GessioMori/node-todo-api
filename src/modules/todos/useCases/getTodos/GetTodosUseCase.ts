import { ITodo } from "@modules/todos/entities/ITodo";
import { ITodosRepository } from "@modules/todos/repositories/ITodosRepository";
import { inject, injectable } from "tsyringe";

@injectable()
export class GetTodosUseCase {
  constructor(
    @inject("TodosRepository") private todosRespository: ITodosRepository
  ) {}

  async execute(account_id: string): Promise<ITodo[]> {
    const todos = await this.todosRespository.findByAccountId(account_id);
    return todos;
  }
}
