import dotenv from "dotenv";
import "reflect-metadata";

import { ICreateAccountDTO } from "@modules/accounts/dtos/ICreateAccountDTO";
import { IAccountsRepository } from "@modules/accounts/repositories/IAccountsRepository";
import { ITokensRepository } from "@modules/accounts/repositories/ITokensRepository";
import { CreateAccountUseCase } from "@modules/accounts/useCases/createAccount/CreateAccountUseCase";
import { LoginUseCase } from "@modules/accounts/useCases/login/LoginUseCase";
import { IDateProvider } from "@shared/providers/dateProvider/IDateProvider";
import { DayJsDateProvider } from "@shared/providers/dateProvider/implementations/DayJsDateProvider";
import { AccountsRepositoryInMemory } from "@test/inMemoryRepositories/AccountsRepositoryInMemory";
import { TokensRepositoryInMemory } from "@test/inMemoryRepositories/TokensRepositoryInMemory";

dotenv.config();

describe("Login use case", () => {
  let accountsRepository: IAccountsRepository;
  let tokensRepository: ITokensRepository;
  let dateProvider: IDateProvider;
  let loginUseCase: LoginUseCase;
  let createAccountUseCase: CreateAccountUseCase;
  let accountData: ICreateAccountDTO;
  beforeAll(async () => {
    accountsRepository = new AccountsRepositoryInMemory();
    tokensRepository = new TokensRepositoryInMemory();
    dateProvider = new DayJsDateProvider();
    createAccountUseCase = new CreateAccountUseCase(accountsRepository);
    loginUseCase = new LoginUseCase(
      tokensRepository,
      accountsRepository,
      dateProvider
    );
    accountData = {
      email: "test@test.com",
      name: "Tester",
      password: "testpassword",
    };

    await createAccountUseCase.execute(accountData);
  });

  it("Should be able to login with right credentials.", async () => {
    const loginResponse = await loginUseCase.execute({
      email: accountData.email,
      password: accountData.password,
    });
    expect(loginResponse).toHaveProperty("accessToken");
    expect(loginResponse).toHaveProperty("refreshToken");
  });

  it("Should not be able to login with wrong password.", () => {
    expect(async () => {
      await loginUseCase.execute({
        email: accountData.email,
        password: accountData.password + "wrong",
      });
    }).rejects.toHaveProperty("statusCode", 400);
  });

  it("Should not be able to login with wrong email.", () => {
    expect(async () => {
      await loginUseCase.execute({
        email: accountData.email + "wrong",
        password: accountData.password,
      });
    }).rejects.toHaveProperty("statusCode", 400);
  });
});
