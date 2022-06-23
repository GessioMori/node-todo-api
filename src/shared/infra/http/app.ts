import "@shared/containers/";
import "express-async-errors";
import "reflect-metadata";

import dotenv from "dotenv";
import express from "express";

import { ErrorHandler } from "@shared/infra/http/errors/ErrorHandler";
import { accountRoutes } from "@shared/infra/http/routes/accounts.routes";
import { todosRoutes } from "./routes/todos.routes";

dotenv.config();

const app = express();

app.use(express.json());

app.use("/account", accountRoutes);
app.use("/todos", todosRoutes);

app.use(ErrorHandler);

export { app };
