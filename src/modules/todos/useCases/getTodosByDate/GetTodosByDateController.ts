import { Request, Response } from "express";
import { container } from "tsyringe";
import { GetTodosByDateUseCase } from "./GetTodosByDateUseCase";

export class GetTodosByDateController {
  async handle(request: Request, response: Response): Promise<Response> {
    const account_id = request.account.account_id;
    const { begin, end } = request.body;

    const getTodosByDateUseCase = container.resolve(GetTodosByDateUseCase);

    const todos = await getTodosByDateUseCase.execute({
      account_id,
      begin,
      end,
    });

    return response.json(todos);
  }
}
