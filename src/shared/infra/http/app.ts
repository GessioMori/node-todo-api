import "express-async-errors";
import "reflect-metadata";

import dotenv from "dotenv";
import express from "express";
import swagger from "swagger-ui-express";
import swaggerFile from "../../../swagger.json";

import "@shared/containers/";

import { ErrorHandler } from "@shared/infra/http/errors/ErrorHandler";
import {
  createRateLimiter,
  rateLimiter
} from "@shared/infra/http/middlewares/rateLimiter";
import { accountRoutes } from "@shared/infra/http/routes/accounts.routes";
import { todosRoutes } from "@shared/infra/http/routes/todos.routes";
import cookieParser from "cookie-parser";
import cors from "cors";

dotenv.config();

const app = express();

if (process.env.NODE_ENV !== "test") {
  createRateLimiter();
  app.use(rateLimiter);
}

if (process.env.NODE_ENV === "dev") {
  app.use((req, res, next) => setTimeout(next, 100));
}

const corsOptions = {
  origin: process.env.NODE_ENV !== "prod" ? `http://${process.env.DEV_DOMAIN}:${process.env.DEV_PORT}` : process.env.PROD_DOMAIN,
  credentials: true
}
app.use(cors(corsOptions));

app.use(cookieParser());

app.use(express.json());

app.use("/api-docs", swagger.serve, swagger.setup(swaggerFile));

app.use("/account", accountRoutes);
app.use("/todos", todosRoutes);

app.use(ErrorHandler);

export { app };
