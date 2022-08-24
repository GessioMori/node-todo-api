import { Request, Response } from "express";
import { container } from "tsyringe";
import { LoginUseCase } from "./LoginUseCase";

export class LoginController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { email, password } = request.body;

    const loginUseCase = container.resolve(LoginUseCase);

    const account = await loginUseCase.execute({ email, password });

    return response
      .cookie("jwt-access-token", account.accessToken, {
        expires: new Date(Date.now() + 20 * 60 * 1000),
        path: "/",
        domain:
          process.env.NODE_ENV === "production" ? process.env.PROD_DOMAIN : process.env.DEV_DOMAIN,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      })
      .cookie("jwt-refresh-token", account.refreshToken, {
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        path: "/account/refresh",
        domain:
          process.env.NODE_ENV === "production" ? process.env.PROD_DOMAIN : process.env.DEV_DOMAIN,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      })
      .json({ message: "Login succeded" });
  }
}
