import { IAccountsRepository } from "@modules/accounts/repositories/IAccountsRepository";
import { IPasswordRecoveryRepository } from "@modules/accounts/repositories/IPasswordRecoveryRepository";
import { AppError } from "@shared/errors/AppError";
import { IDateProvider } from "@shared/providers/dateProvider/IDateProvider";
import { IEmailProvider } from "@shared/providers/emailProvider/IEmailProvider";
import { recoverPasswordEmailModel } from "@utils/emailProvider/recoverPasswordEmailModel";
import { inject, injectable } from "tsyringe";
import validator from "validator";

@injectable()
export class RecoverPasswordUseCase {
  constructor(
    @inject("PasswordRecoveryRepository")
    private passwordRecoveryRepository: IPasswordRecoveryRepository,
    @inject("AccountsRepository")
    private accountsRepository: IAccountsRepository,
    @inject("DateProvider")
    private dateProvider: IDateProvider,
    @inject("EmailProvider")
    private emailProvider: IEmailProvider
  ) {}

  async execute(email: string): Promise<string> {
    const isEmailValid = validator.isEmail(email);

    const hoursToExpire = 2;

    if (!isEmailValid) {
      throw new AppError("Email not found.");
    }

    const account = await this.accountsRepository.findByEmail(email);

    if (!account) {
      throw new AppError("Email not found.");
    }

    await this.passwordRecoveryRepository.deleteByAccountId(account.id);

    const passwordRecoveryToken =
      await this.passwordRecoveryRepository.createPasswordRecovery({
        account_id: account.id,
        expires_at: this.dateProvider.addHoursFromNow(hoursToExpire),
      });

    await this.emailProvider.sendMail(
      account.email,
      "Dotos! Password recovery",
      recoverPasswordEmailModel(account.name, passwordRecoveryToken.id)
    );

    return passwordRecoveryToken.id;
  }
}
