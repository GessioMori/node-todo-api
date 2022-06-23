import { IAccountsRepository } from "@modules/accounts/repositories/IAccountsRepository";
import { ITokensRepository } from "@modules/accounts/repositories/ITokensRepository";
import { AccountsRepository } from "@modules/accounts/repositories/typeorm/AccountsRepository";
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
