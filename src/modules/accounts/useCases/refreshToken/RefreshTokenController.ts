import { Request, Response } from "express";
import { container } from "tsyringe";
import { RefreshTokenUseCase } from "./RefreshTokenUseCase";

export class RefreshTokenController {
  async handle(request: Request, response: Response): Promise<Response> {
    const refreshToken = request.cookies["jwt-refresh-token"];
    const refreshTokenUseCase = container.resolve(RefreshTokenUseCase);
    const newTokens = await refreshTokenUseCase.execute(refreshToken);
    return response
      .cookie("jwt-access-token", newTokens.accessToken, {
        expires: new Date(Date.now() + 20 * 60 * 1000),
        path: "/",
        domain: "localhost",
        httpOnly: true,
        secure: true,
        sameSite: "strict",
      })
      .cookie("jwt-refresh-token", newTokens.refreshToken, {
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        path: "/account/refresh",
        domain: "localhost",
        httpOnly: true,
        secure: true,
        sameSite: "strict",
      })
      .json({ message: "Tokens were refreshed" });
  }
}
