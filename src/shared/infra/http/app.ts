import "@shared/containers/main";
import express from "express";
import "express-async-errors";
import "reflect-metadata";
import { ErrorHandler } from "./errors/ErrorHandler";
import { accountRoutes } from "./routes/accounts.routes";

const app = express();

app.use(express.json());

app.use("/account", accountRoutes);

app.use(ErrorHandler);

export { app };
