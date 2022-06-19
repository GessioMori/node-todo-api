import "@shared/containers/";
import { ErrorHandler } from "@shared/infra/http/errors/ErrorHandler";
import { accountRoutes } from "@shared/infra/http/routes/accounts.routes";
import express from "express";
import "express-async-errors";
import "reflect-metadata";

const app = express();

app.use(express.json());

app.use("/account", accountRoutes);

app.use(ErrorHandler);

export { app };
