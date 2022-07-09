import { ITodosRepository } from "@modules/todos/repositories/ITodosRepository";
import { mappedTodo, todoMapper } from "@utils/mappers/todoMapper";
import { inject, injectable } from "tsyringe";

@injectable()
export class GetTodosUseCase {
  constructor(
    @inject("TodosRepository") private todosRespository: ITodosRepository
  ) {}

  async execute(account_id: string): Promise<mappedTodo[]> {
    const todos = await this.todosRespository.findByAccountId(account_id);

    return todos.map((todo) => todoMapper(todo));
  }
}
