import { Request, Response } from "express";
import { container } from "tsyringe";
import { CreateTodoUseCase } from "./CreateTodoUseCase";

export class CreateTodoController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { content, is_completed, due_to } = request.body;
    const account_id = request.account.account_id;

    const createTodoUseCase = container.resolve(CreateTodoUseCase);

    const newTodo = await createTodoUseCase.execute({
      account_id,
      content,
      is_completed,
      due_to,
    });

    return response.json(newTodo).status(201);
  }
}
