import { IAccountsRepository } from "@modules/accounts/repositories/IAccountsRepository";
import { AccountsRepository } from "@modules/accounts/repositories/typeorm/AccountsRepository";
import { container } from "tsyringe";

container.registerSingleton<IAccountsRepository>(
  "AccountsRepository",
  AccountsRepository
);
