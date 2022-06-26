import { IAccountsRepository } from "@modules/accounts/repositories/IAccountsRepository";
import { IPasswordRecoveryRepository } from "@modules/accounts/repositories/IPasswordRecoveryRepository";
import { ITokensRepository } from "@modules/accounts/repositories/ITokensRepository";
import { AccountsRepository } from "@modules/accounts/repositories/typeorm/AccountsRepository";
import { PasswordRecoveryRepository } from "@modules/accounts/repositories/typeorm/PasswordRecoveryRepository";
import { TokensRepository } from "@modules/accounts/repositories/typeorm/TokensRepository";
import { container } from "tsyringe";

container.registerSingleton<IAccountsRepository>(
  "AccountsRepository",
  AccountsRepository
);

container.registerSingleton<ITokensRepository>(
  "TokensRepository",
  TokensRepository
);

container.registerSingleton<IPasswordRecoveryRepository>(
  "PasswordRecoveryRepository",
  PasswordRecoveryRepository
);
