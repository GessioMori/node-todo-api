import { IRefreshTokenResponseDTO } from "@modules/accounts/dtos/IRefreshTokenResponseDTO";
import { ITokensRepository } from "@modules/accounts/repositories/ITokensRepository";
import { AppError } from "@shared/errors/AppError";
import { IDateProvider } from "@shared/providers/dateProvider/IDateProvider";
import { sign } from "jsonwebtoken";
import { inject, injectable } from "tsyringe";

@injectable()
export class RefreshTokenUseCase {
  constructor(
    @inject("TokensRepository") private tokensRepository: ITokensRepository,
    @inject("DateProvider") private dateProvider: IDateProvider
  ) {}

  async execute(refreshTokenId: string): Promise<IRefreshTokenResponseDTO> {
    const refreshToken = await this.tokensRepository.findById(refreshTokenId);

    if (!refreshToken) {
      throw new AppError("Refresh token not found, please authenticate again.");
    }

    const isTokenExpired = this.dateProvider.checkIfPast(
      refreshToken.expires_at
    );

    if (isTokenExpired) {
      throw new AppError(
        "Refresh token expired, please authenticate again.",
        403
      );
    }

    await this.tokensRepository.deleteById(refreshToken.id);

    const newRefreshToken = await this.tokensRepository.createRefreshToken({
      account_id: refreshToken.account_id,
      expires_at: this.dateProvider.addDaysFromNow(
        Number(process.env.REFRESH_TOKEN_EXPIRATION_TIME)
      ),
    });

    const newAccessToken = sign({}, process.env.ACCESS_TOKEN_SECRET, {
      subject: refreshToken.account_id,
      expiresIn: process.env.ACCESS_TOKEN_EXPIRATION_TIME,
    });

    return { accessToken: newAccessToken, refreshToken: newRefreshToken.id };
  }
}
