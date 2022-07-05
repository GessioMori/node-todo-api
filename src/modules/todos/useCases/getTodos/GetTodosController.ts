import { GetTodosUseCase } from "@modules/todos/useCases/getTodos/GetTodosUseCase";
import { Request, Response } from "express";
import { container } from "tsyringe";

export class GetTodosController {
  async handle(request: Request, response: Response): Promise<Response> {
    const account_id = request.account.account_id;

    const getTodosUseCase = container.resolve(GetTodosUseCase);

    const todos = await getTodosUseCase.execute(account_id);

    return response.json(todos);
  }
}
