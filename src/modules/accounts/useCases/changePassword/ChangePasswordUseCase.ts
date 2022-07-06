import { IAccountsRepository } from "@modules/accounts/repositories/IAccountsRepository";
import { IPasswordRecoveryRepository } from "@modules/accounts/repositories/IPasswordRecoveryRepository";
import { AppError } from "@shared/errors/AppError";
import { IDateProvider } from "@shared/providers/dateProvider/IDateProvider";
import { hash } from "bcrypt";
import { inject, injectable } from "tsyringe";
import { validate } from "uuid";

@injectable()
export class ChangePasswordUseCase {
  constructor(
    @inject("AccountsRepository")
    private accountsRepository: IAccountsRepository,
    @inject("PasswordRecoveryRepository")
    private passwordRecoveryRepository: IPasswordRecoveryRepository,
    @inject("DateProvider") private dateProvider: IDateProvider
  ) {}

  async execute(
    passwordRecoveryToken: string,
    newPassword: string
  ): Promise<void> {
    if (!passwordRecoveryToken || !validate(passwordRecoveryToken)) {
      throw new AppError("Invalid token.", 401);
    }

    const token = await this.passwordRecoveryRepository.findById(
      passwordRecoveryToken
    );

    if (!token) {
      throw new AppError("Invalid token.", 401);
    }

    const isTokenExpired = this.dateProvider.checkIfPast(token.expires_at);

    if (isTokenExpired) {
      throw new AppError("Token expired.", 403);
    }

    const account = await this.accountsRepository.findById(token.account_id);

    account.password = await hash(newPassword, 8);

    await this.accountsRepository.createAccount(account, account.id);

    await this.passwordRecoveryRepository.deleteByAccountId(account.id);
  }
}
