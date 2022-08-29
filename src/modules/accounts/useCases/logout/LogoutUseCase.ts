import { ITokensRepository } from "@modules/accounts/repositories/ITokensRepository";
import { AppError } from "@shared/errors/AppError";
import { inject, injectable } from "tsyringe";
import { validate } from "uuid";

@injectable()
export class LogoutUseCase {
  constructor(
    @inject("TokensRepository") private tokensRepository: ITokensRepository
  ) {}

  async execute(refreshTokenId: string): Promise<void> {
    if (!refreshTokenId || !validate(refreshTokenId)) {
      throw new AppError(
        "Refresh token not found, please authenticate again.",
        401
      );
    }

    const refreshToken = await this.tokensRepository.findById(refreshTokenId);

    if (!refreshToken) {
      throw new AppError(
        "Refresh token not found, please authenticate again.",
        401
      );
    }

    await this.tokensRepository.deleteById(refreshToken.id);
  }
}
