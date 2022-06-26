import { Request, Response } from "express";
import { container } from "tsyringe";
import { RecoverPasswordUseCase } from "./RecoverPasswordUseCase";

export class RecoverPasswordController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { email } = request.body;

    const recoverPasswordUseCase = container.resolve(RecoverPasswordUseCase);

    await recoverPasswordUseCase.execute(email);

    return response.sendStatus(200);
  }
}
