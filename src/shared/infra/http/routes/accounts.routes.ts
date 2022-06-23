import { CreateAccountController } from "@modules/accounts/useCases/createAccount/CreateAccountController";
import { LoginController } from "@modules/accounts/useCases/login/LoginController";
import { RefreshTokenController } from "@modules/accounts/useCases/refreshToken/RefreshTokenController";
import { Router } from "express";

const accountRoutes = Router();

const createAccountController = new CreateAccountController();
const loginController = new LoginController();
const refreshTokenController = new RefreshTokenController();

accountRoutes.post("/", createAccountController.handle);
accountRoutes.post("/login", loginController.handle);
accountRoutes.post("/refresh", refreshTokenController.handle);

export { accountRoutes };
