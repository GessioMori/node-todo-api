import { ILoginDTO } from "@modules/accounts/dtos/ILoginDTO";
import { ILoginResponseDTO } from "@modules/accounts/dtos/ILoginResponseDTO";
import { IAccountsRepository } from "@modules/accounts/repositories/IAccountsRepository";
import { ITokensRepository } from "@modules/accounts/repositories/ITokensRepository";
import { AppError } from "@shared/errors/AppError";
import { IDateProvider } from "@shared/providers/dateProvider/IDateProvider";
import { compare } from "bcrypt";
import { sign } from "jsonwebtoken";
import { inject, injectable } from "tsyringe";

@injectable()
export class LoginUseCase {
  constructor(
    @inject("TokensRepository")
    private tokensRepository: ITokensRepository,
    @inject("AccountsRepository")
    private accountsRepository: IAccountsRepository,
    @inject("DateProvider")
    private dataProvider: IDateProvider
  ) {}

  async execute({ email, password }: ILoginDTO): Promise<ILoginResponseDTO> {
    const account = await this.accountsRepository.findByEmail(email);

    if (!account) {
      throw new AppError("Invalid email or password.");
    }

    const isPasswordCorrect = await compare(password, account.password);

    if (!isPasswordCorrect) {
      throw new AppError("Invalid email or password.");
    }

    await this.tokensRepository.deleteByAccountId(account.id);

    const refreshToken = await this.tokensRepository.createRefreshToken({
      expires_at: this.dataProvider.addDaysFromNow(
        Number(process.env.REFRESH_TOKEN_EXPIRATION_TIME)
      ),
      account_id: account.id,
    });

    const accessToken = sign({}, process.env.ACCESS_TOKEN_SECRET, {
      subject: account.id,
      expiresIn: process.env.ACCESS_TOKEN_EXPIRATION_TIME,
    });

    return {
      email: account.email,
      name: account.name,
      accessToken,
      refreshToken: refreshToken.id,
    };
  }
}
