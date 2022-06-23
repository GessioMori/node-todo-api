import { Request, Response } from "express";
import { container } from "tsyringe";
import { LoginUseCase } from "./LoginUseCase";

export class LoginController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { email, password } = request.body;

    const loginUseCase = container.resolve(LoginUseCase);

    const account = await loginUseCase.execute({ email, password });

    return response.json(account);
  }
}
