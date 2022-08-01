import { IGetByDateIntervalDTO } from "@modules/todos/dtos/IGetByDateIntervalDTO";
import { ITodosRepository } from "@modules/todos/repositories/ITodosRepository";
import { mappedTodo, todoMapper } from "@utils/mappers/todoMapper";
import { inject, injectable } from "tsyringe";

@injectable()
export class GetTodosByDateUseCase {
  constructor(
    @inject("TodosRepository") private todosRespository: ITodosRepository
  ) {}

  async execute({
    account_id,
    begin,
    end,
  }: IGetByDateIntervalDTO): Promise<mappedTodo[]> {
    const todos = await this.todosRespository.findByDateInterval({
      account_id,
      begin,
      end,
    });

    return todos.map((todo) => todoMapper(todo));
  }
}
