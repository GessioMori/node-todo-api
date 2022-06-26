import dotenv from "dotenv";
import "reflect-metadata";

import { ICreateAccountDTO } from "@modules/accounts/dtos/ICreateAccountDTO";
import { ILoginResponseDTO } from "@modules/accounts/dtos/ILoginResponseDTO";
import { IAccountsRepository } from "@modules/accounts/repositories/IAccountsRepository";
import { CreateAccountUseCase } from "@modules/accounts/useCases/createAccount/CreateAccountUseCase";
import { LoginUseCase } from "@modules/accounts/useCases/login/LoginUseCase";
import { RefreshTokenUseCase } from "@modules/accounts/useCases/refreshToken/RefreshTokenUseCase";
import { AppError } from "@shared/errors/AppError";
import { IDateProvider } from "@shared/providers/dateProvider/IDateProvider";
import { DayJsDateProvider } from "@shared/providers/dateProvider/implementations/DayJsDateProvider";
import { AccountsRepositoryInMemory } from "@test/inMemoryRepositories/AccountsRepositoryInMemory";
import { TokensRepositoryInMemory } from "@test/inMemoryRepositories/TokensRepositoryInMemory";

dotenv.config();

describe("Refresh token use case", () => {
  let accountsRepository: IAccountsRepository;
  let tokensRepository: TokensRepositoryInMemory;
  let dateProvider: IDateProvider;
  let loginUseCase: LoginUseCase;
  let createAccountUseCase: CreateAccountUseCase;
  let refreshTokenUseCase: RefreshTokenUseCase;
  let accountData: ICreateAccountDTO;
  let loginResponse: ILoginResponseDTO;

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
    refreshTokenUseCase = new RefreshTokenUseCase(
      tokensRepository,
      dateProvider
    );

    accountData = {
      email: "test@test.com",
      name: "Tester",
      password: "testpassword",
    };

    await createAccountUseCase.execute(accountData);
  });

  beforeEach(async () => {
    loginResponse = await loginUseCase.execute({
      email: accountData.email,
      password: accountData.password,
    });
  });

  it("Should be able to refresh token with a valid id.", async () => {
    const newRefreshToken = await refreshTokenUseCase.execute(
      loginResponse.refreshToken
    );
    expect(newRefreshToken).toHaveProperty("accessToken");
    expect(newRefreshToken).toHaveProperty("refreshToken");
  });

  it("Should not be able to refresh token without a valid token", () => {
    expect(async () => {
      await refreshTokenUseCase.execute(loginResponse.refreshToken + "wrong");
    }).rejects.toBeInstanceOf(AppError);
  });

  it("Should not be able to refresh token with an expired token", () => {
    expect(async () => {
      await tokensRepository.makeTokenExpired(loginResponse.refreshToken);
      await refreshTokenUseCase.execute(loginResponse.refreshToken);
    }).rejects.toBeInstanceOf(AppError);
  });
});
