import { AppError } from "@shared/errors/AppError";
import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";

interface IPayload {
  sub: string;
}

export function authenticate(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const token = request.cookies["jwt-access-token"];

  if (!token) {
    throw new AppError("Token not received.", 401);
  }

  try {
    const { sub: account_id } = verify(
      token,
      process.env.ACCESS_TOKEN_SECRET
    ) as IPayload;
    request.account = { account_id };
    next();
  } catch (err) {
    if (err.message === "jwt expired") {
      throw new AppError("Expired token.", 401);
    }
    throw new AppError("Invalid token.", 401);
  }
}
