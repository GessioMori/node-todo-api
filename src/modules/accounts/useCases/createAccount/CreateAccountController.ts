import { Request, Response } from "express";
import { container } from "tsyringe";
import { CreateAccountUseCase } from "./CreateAccountUseCase";

export class CreateAccountController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { email, password, name } = request.body;

    const createAccountUseCase = container.resolve(CreateAccountUseCase);

    const newAccount = await createAccountUseCase.execute({
      email,
      name,
      password,
    });

    return response.status(201).json(newAccount);
  }
}
