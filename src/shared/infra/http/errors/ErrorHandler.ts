import { AppError } from "@shared/errors/AppError";
import { NextFunction, Request, Response } from "express";

export const ErrorHandler = (
  err: Error,
  request: Request,
  response: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) => {
  if (err instanceof AppError) {
    return response.status(err.statusCode).json({ message: err.message });
  }
  return response.status(500).json({
    status: "error",
    message: `Internal server error: ${err.message}`,
  });
};
