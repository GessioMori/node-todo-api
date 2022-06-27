import dotenv from "dotenv";
import "reflect-metadata";

import { IAccountsRepository } from "@modules/accounts/repositories/IAccountsRepository";
import { ITokensRepository } from "@modules/accounts/repositories/ITokensRepository";
import { ChangePasswordUseCase } from "@modules/accounts/useCases/changePassword/ChangePasswordUseCase";
import { CreateAccountUseCase } from "@modules/accounts/useCases/createAccount/CreateAccountUseCase";
import { LoginUseCase } from "@modules/accounts/useCases/login/LoginUseCase";
import { RecoverPasswordUseCase } from "@modules/accounts/useCases/recoverPassword/RecoverPasswordUseCase";
import { AppError } from "@shared/errors/AppError";
import { IDateProvider } from "@shared/providers/dateProvider/IDateProvider";
import { DayJsDateProvider } from "@shared/providers/dateProvider/implementations/DayJsDateProvider";
import { IEmailProvider } from "@shared/providers/emailProvider/IEmailProvider";
import { EmailProviderInMemory } from "@test/inMemoryProviders/EmailProviderInMemory";
import { AccountsRepositoryInMemory } from "@test/inMemoryRepositories/AccountsRepositoryInMemory";
import { PasswordRecoveryRepositoryInMemory } from "@test/inMemoryRepositories/PasswordRecoveryRepositoryInMemory";
import { TokensRepositoryInMemory } from "@test/inMemoryRepositories/TokensRepositoryInMemory";

dotenv.config();

describe("Change password use case", () => {
  let passwordRecoveryRepository: PasswordRecoveryRepositoryInMemory;
  let accountsRepository: IAccountsRepository;
  let tokensRepository: ITokensRepository;

  let dateProvider: IDateProvider;
  let emailProvider: IEmailProvider;

  let createAccountUseCase: CreateAccountUseCase;
  let recoverPasswordUseCase: RecoverPasswordUseCase;
  let loginUseCase: LoginUseCase;
  let changePasswordUseCase: ChangePasswordUseCase;

  let accountData;
  let recoverToken: string;

  beforeAll(async () => {
    passwordRecoveryRepository = new PasswordRecoveryRepositoryInMemory();
    accountsRepository = new AccountsRepositoryInMemory();
    tokensRepository = new TokensRepositoryInMemory();

    dateProvider = new DayJsDateProvider();
    emailProvider = new EmailProviderInMemory();

    createAccountUseCase = new CreateAccountUseCase(accountsRepository);
    recoverPasswordUseCase = new RecoverPasswordUseCase(
      passwordRecoveryRepository,
      accountsRepository,
      dateProvider,
      emailProvider
    );
    loginUseCase = new LoginUseCase(
      tokensRepository,
      accountsRepository,
      dateProvider
    );
    changePasswordUseCase = new ChangePasswordUseCase(
      accountsRepository,
      passwordRecoveryRepository,
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
    recoverToken = await recoverPasswordUseCase.execute(accountData.email);
  });

  it("Should be able to change password and login after that.", async () => {
    await changePasswordUseCase.execute(recoverToken, "testpassword2");
    const newLogin = await loginUseCase.execute({
      email: accountData.email,
      password: "testpassword2",
    });
    expect(newLogin).toHaveProperty("accessToken");
  });

  it("Should not be able to change password without a recover token or an invalid one.", () => {
    expect(async () => {
      await changePasswordUseCase.execute(
        recoverToken + "wrong",
        "testpassword2"
      );
    }).rejects.toEqual(new AppError("Invalid token.", 403));
  });

  it("Should not be able to change password with a unregistered token.", () => {
    expect(async () => {
      await changePasswordUseCase.execute(
        "197c630a-708e-42b0-8bfb-8c664f520802",
        "testpassword2"
      );
    }).rejects.toEqual(new AppError("Invalid token.", 403));
  });

  it("Should not be able to change password if token is expired", () => {
    expect(async () => {
      await passwordRecoveryRepository.makeTokenExpired(recoverToken);
      await changePasswordUseCase.execute(recoverToken, "testpassword2");
    }).rejects.toEqual(new AppError("Token expired.", 401));
  });
});
