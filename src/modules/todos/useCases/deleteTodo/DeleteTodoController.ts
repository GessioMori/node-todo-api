import { Request, Response } from "express";
import { container } from "tsyringe";
import { DeleteTodoUseCase } from "./DeleteTodoUseCase";

export class DeleteTodoController {
  async handle(request: Request, response: Response): Promise<Response> {
    const todo_id = request.params.id;
    const account_id = request.account.account_id;

    const deleteTodoUseCase = container.resolve(DeleteTodoUseCase);

    await deleteTodoUseCase.execute(todo_id, account_id);

    return response.status(204).send();
  }
}
