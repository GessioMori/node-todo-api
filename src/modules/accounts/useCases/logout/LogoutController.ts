import {
  refreshTokenConfigs
} from "@utils/cookies/configs";
import { Request, Response } from "express";
import { container } from "tsyringe";
import { LogoutUseCase } from "./LogoutUseCase";

export class LogoutController {
  async handle(request: Request, response: Response): Promise<Response> {
    const refreshToken = request.cookies["jwt-refresh-token"];
    const logoutUseCase = container.resolve(LogoutUseCase);
    await logoutUseCase.execute(refreshToken);

    return response
      .clearCookie("jwt-refresh-token", refreshTokenConfigs)
      .json({ message: "Logged out." });
  }
}
