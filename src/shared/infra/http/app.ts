import "@shared/containers/main";
import express from "express";
import "reflect-metadata";
import { accountRoutes } from "./routes/accounts.routes";

const app = express();

app.use(express.json());

app.use("/account", accountRoutes);

export { app };
