import "reflect-metadata";

import { IAccountsRepository } from "@modules/accounts/repositories/IAccountsRepository";
import { IPasswordRecoveryRepository } from "@modules/accounts/repositories/IPasswordRecoveryRepository";
import { CreateAccountUseCase } from "@modules/accounts/useCases/createAccount/CreateAccountUseCase";
import { RecoverPasswordUseCase } from "@modules/accounts/useCases/recoverPassword/RecoverPasswordUseCase";
import { AppError } from "@shared/errors/AppError";
import { IDateProvider } from "@shared/providers/dateProvider/IDateProvider";
import { DayJsDateProvider } from "@shared/providers/dateProvider/implementations/DayJsDateProvider";
import { IEmailProvider } from "@shared/providers/emailProvider/IEmailProvider";
import { EmailProviderInMemory } from "@test/inMemoryProviders/EmailProviderInMemory";
import { AccountsRepositoryInMemory } from "@test/inMemoryRepositories/AccountsRepositoryInMemory";
import { PasswordRecoveryRepositoryInMemory } from "@test/inMemoryRepositories/PasswordRecoveryRepositoryInMemory";

describe("Recover password use case", () => {
  let passwordRecoveryRepository: IPasswordRecoveryRepository;
  let accountsRepository: IAccountsRepository;

  let dateProvider: IDateProvider;
  let emailProvider: IEmailProvider;

  let createAccountUseCase: CreateAccountUseCase;
  let recoverPasswordUseCase: RecoverPasswordUseCase;

  let accountData;

  beforeAll(async () => {
    passwordRecoveryRepository = new PasswordRecoveryRepositoryInMemory();
    accountsRepository = new AccountsRepositoryInMemory();

    dateProvider = new DayJsDateProvider();
    emailProvider = new EmailProviderInMemory();

    createAccountUseCase = new CreateAccountUseCase(accountsRepository);
    recoverPasswordUseCase = new RecoverPasswordUseCase(
      passwordRecoveryRepository,
      accountsRepository,
      dateProvider,
      emailProvider
    );

    accountData = {
      email: "test@test.com",
      name: "Tester",
      password: "testpassword",
    };

    await createAccountUseCase.execute(accountData);
  });

  it("Should be able to recover password with a valid email", async () => {
    const sendEmail = jest.spyOn(emailProvider, "sendMail");
    await recoverPasswordUseCase.execute(accountData.email);
    expect(sendEmail).toBeCalled();
  });

  it("Should not be able to receive a message without an email", () => {
    expect(async () => {
      await recoverPasswordUseCase.execute("");
    }).rejects.toEqual(new AppError("Invalid email."));
  });

  it("Should not be able to receive a message with an invalid email", () => {
    expect(async () => {
      await recoverPasswordUseCase.execute("wrong@email.com");
    }).rejects.toEqual(new AppError("Email not found."));
  });
});
