import { CreateAccountController } from "@modules/accounts/useCases/createAccount/CreateAccountController";
import { LoginController } from "@modules/accounts/useCases/login/LoginController";
import { RecoverPasswordController } from "@modules/accounts/useCases/recoverPassword/RecoverPasswordController";
import { RefreshTokenController } from "@modules/accounts/useCases/refreshToken/RefreshTokenController";
import { Router } from "express";

const accountRoutes = Router();

const createAccountController = new CreateAccountController();
const loginController = new LoginController();
const refreshTokenController = new RefreshTokenController();
const recoverPasswordController = new RecoverPasswordController();

accountRoutes.post("/", createAccountController.handle);
accountRoutes.post("/login", loginController.handle);
accountRoutes.post("/refresh", refreshTokenController.handle);
accountRoutes.post("/recover-password", recoverPasswordController.handle);

export { accountRoutes };
