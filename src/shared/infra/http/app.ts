import "@shared/containers/";
import "express-async-errors";
import "reflect-metadata";

import dotenv from "dotenv";
import express from "express";
import swagger from "swagger-ui-express";
import swaggerFile from "../../../swagger.json";

import { ErrorHandler } from "@shared/infra/http/errors/ErrorHandler";
import { rateLimiter } from "@shared/infra/http/middlewares/rateLimiter";
import { accountRoutes } from "@shared/infra/http/routes/accounts.routes";
import { todosRoutes } from "@shared/infra/http/routes/todos.routes";

dotenv.config();

const app = express();

if (process.env.NODE_ENV !== "test") {
  app.use(rateLimiter);
}

app.use(express.json());

app.use("/api-docs", swagger.serve, swagger.setup(swaggerFile));

app.use("/account", accountRoutes);
app.use("/todos", todosRoutes);

app.use(ErrorHandler);

export { app };
