import { IAccountsRepository } from "@modules/accounts/repositories/IAccountsRepository";
import { ITokensRepository } from "@modules/accounts/repositories/ITokensRepository";
import { IDateProvider } from "@shared/providers/dateProvider/IDateProvider";
import { IEmailProvider } from "@shared/providers/emailProvider/IEmailProvider";
import { inject } from "tsyringe";

export class RecoverPasswordUseCase {
  constructor(
    @inject("TokensRepository")
    private tokensRepository: ITokensRepository,
    @inject("AccountsRepository")
    private accountsRepository: IAccountsRepository,
    @inject("DateProvider")
    private dateProvider: IDateProvider,
    @inject("EmailProvider")
    private emailProvider: IEmailProvider
  ) {}
}
