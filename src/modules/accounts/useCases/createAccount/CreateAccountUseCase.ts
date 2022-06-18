import { Account } from "@modules/accounts/entities/typeorm/Account";
import { IAccountsRepository } from "@modules/accounts/repositories/IAccountsRepository";
import { AppError } from "@shared/errors/AppError";
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

  async execute({ email, name, password }: IRequest): Promise<Account> {
    const emailAlreadyExists = await this.accountsRepository.findByEmail(email);

    if (emailAlreadyExists) {
      throw new AppError("Email already registered.");
    }

    const account = await this.accountsRepository.createAccount({
      email,
      name,
      password,
    });

    return account;
  }
}
