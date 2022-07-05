import { Request, Response } from "express";
import { container } from "tsyringe";
import { GetTodoUseCase } from "./GetTodoUseCase";

export class GetTodoController {
  async handle(request: Request, response: Response): Promise<Response> {
    const account_id = request.account.account_id;
    const todo_id = request.params.id;

    const getTodoUseCase = container.resolve(GetTodoUseCase);

    const todo = await getTodoUseCase.execute(todo_id, account_id);

    return response.json(todo);
  }
}
