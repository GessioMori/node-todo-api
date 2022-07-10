import { AppError } from "@shared/errors/AppError";
import { NextFunction, Request, Response } from "express";
import { RateLimiterRedis } from "rate-limiter-flexible";
import * as redis from "redis";

let limiter: RateLimiterRedis;

export function createRateLimiter() {
  const redisClient = redis.createClient({
    legacyMode: true,
  });

  redisClient.connect();

  redisClient.on("error", (err) => console.log("Redis Client Error", err));

  limiter = new RateLimiterRedis({
    storeClient: redisClient,
    keyPrefix: "rateLimiter",
    points: 5,
    duration: 5,
  });
}

export async function rateLimiter(
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void> {
  try {
    await limiter.consume(request.ip);
    return next();
  } catch (err) {
    throw new AppError("Too many requests.", 429);
  }
}
