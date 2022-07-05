import { Request, Response } from "express";
import { container } from "tsyringe";
import { UpdateTodoUseCase } from "./UpdateTodoUseCase";

export class UpdateTodoController {
  async handle(request: Request, response: Response): Promise<Response> {
    const account_id = request.account.account_id;
    const todo_id = request.params.id;
    const { content, is_completed, due_to } = request.body;

    const updateTodoUseCase = container.resolve(UpdateTodoUseCase);

    const todo = await updateTodoUseCase.execute(
      { id: todo_id, content, due_to, is_completed },
      account_id
    );

    return response.json(todo).status(201);
  }
}
