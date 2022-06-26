import { IAccountResponseDTO } from "@modules/accounts/dtos/IAccountResponseDTO";
import { IAccountsRepository } from "@modules/accounts/repositories/IAccountsRepository";
import { AppError } from "@shared/errors/AppError";
import { hash } from "bcrypt";
import { inject, injectable } from "tsyringe";

interface IRequest {
  email: string;
  name: string;
  password: string;
}

@injectable()
export class CreateAccountUseCase {
  constructor(
    @inject("AccountsRepository")
    private accountsRepository: IAccountsRepository
  ) {}

  async execute({
    email,
    name,
    password,
  }: IRequest): Promise<IAccountResponseDTO> {
    if (!email || !name || !password) {
      throw new AppError("You must provide required information.");
    }

    const emailAlreadyExists = await this.accountsRepository.findByEmail(email);

    if (emailAlreadyExists) {
      throw new AppError("Email already registered.");
    }

    const hashedPassword = await hash(password, 8);

    const account = await this.accountsRepository.createAccount({
      email,
      name,
      password: hashedPassword,
    });

    return { email: account.email, name: account.name };
  }
}
