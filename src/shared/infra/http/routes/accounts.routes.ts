import { CreateAccountController } from "@modules/accounts/useCases/createAccount/CreateAccountController";
import { Router } from "express";

const accountRoutes = Router();

const createAccountController = new CreateAccountController();

accountRoutes.post("/", createAccountController.handle);

export { accountRoutes };
