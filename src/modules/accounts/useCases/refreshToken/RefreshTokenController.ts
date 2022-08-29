import {
  accessTokenConfigs,
  refreshTokenConfigs,
} from "@utils/cookies/configs";
import { Request, Response } from "express";
import { container } from "tsyringe";
import { RefreshTokenUseCase } from "./RefreshTokenUseCase";

export class RefreshTokenController {
  async handle(request: Request, response: Response): Promise<Response> {
    const refreshToken = request.cookies["jwt-refresh-token"];
    const refreshTokenUseCase = container.resolve(RefreshTokenUseCase);
    const newTokens = await refreshTokenUseCase.execute(refreshToken);
    return response
      .cookie("jwt-access-token", newTokens.accessToken, accessTokenConfigs)
      .cookie("jwt-refresh-token", newTokens.refreshToken, refreshTokenConfigs)
      .json({ message: "Tokens were refreshed" });
  }
}
