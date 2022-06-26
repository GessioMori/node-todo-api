import { Request, Response } from "express";
import { container } from "tsyringe";
import { ChangePasswordUseCase } from "./ChangePasswordUseCase";

export class ChangePasswordController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { newPassword } = request.body;
    const { token } = request.params;

    const changePasswordUseCase = container.resolve(ChangePasswordUseCase);

    await changePasswordUseCase.execute(token, newPassword);

    return response.sendStatus(201);
  }
}
