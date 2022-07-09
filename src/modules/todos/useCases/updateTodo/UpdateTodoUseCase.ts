import { IUpdateTodoDTO } from "@modules/todos/dtos/IUpdateTodoDTO";
import { ITodosRepository } from "@modules/todos/repositories/ITodosRepository";
import { AppError } from "@shared/errors/AppError";
import { mappedTodo, todoMapper } from "@utils/mappers/todoMapper";
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
  ): Promise<mappedTodo> {
    if (!validate(id) || !validate(account_id)) {
      throw new AppError("Invalid uuid.");
    }

    const todo = await this.todosRepository.findById(id);

    if (!todo) {
      throw new AppError("Todo not found.", 404);
    }

    if (todo.account_id !== account_id) {
      throw new AppError("Not allowed.", 403);
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

    return todoMapper(newTodo);
  }
}
