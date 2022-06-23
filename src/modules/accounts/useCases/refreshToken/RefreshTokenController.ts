import { Request, Response } from "express";
import { container } from "tsyringe";
import { RefreshTokenUseCase } from "./RefreshTokenUseCase";

export class RefreshTokenController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { refreshToken } = request.body;
    const refreshTokenUseCase = container.resolve(RefreshTokenUseCase);
    const newTokens = await refreshTokenUseCase.execute(refreshToken);
    return response.json(newTokens);
  }
}
