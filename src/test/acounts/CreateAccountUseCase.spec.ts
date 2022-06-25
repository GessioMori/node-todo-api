import "reflect-metadata";

import { IAccountResponseDTO } from "@modules/accounts/dtos/IAccountResponseDTO";
import { ICreateAccountDTO } from "@modules/accounts/dtos/ICreateAccountDTO";
import { IAccountsRepository } from "@modules/accounts/repositories/IAccountsRepository";
import { CreateAccountUseCase } from "@modules/accounts/useCases/createAccount/CreateAccountUseCase";
import { AppError } from "@shared/errors/AppError";
import { AccountsRepositoryInMemory } from "@test/inMemoryRepositories/AccountsRepositoryInMemory";

describe("Create account use case", () => {
  let accountsRepository: IAccountsRepository;
  let createAccountUseCase: CreateAccountUseCase;
  beforeAll(() => {
    accountsRepository = new AccountsRepositoryInMemory();
    createAccountUseCase = new CreateAccountUseCase(accountsRepository);
  });

  it("Should be able to create a new account", async () => {
    const data: ICreateAccountDTO = {
      email: "test@test.com",
      name: "Tester",
      password: "testpassword",
    };

    const account = await createAccountUseCase.execute(data);
    expect(account).toMatchObject<IAccountResponseDTO>({
      email: data.email,
      name: data.name,
    });
  });

  it("Should not be able to create a new account with a registered email", () => {
    expect(async () => {
      const data1: ICreateAccountDTO = {
        email: "test@test.com",
        name: "Tester1",
        password: "testpassword2",
      };
      const data2: ICreateAccountDTO = {
        email: "test@test.com",
        name: "Tester2",
        password: "testpassword2",
      };

      await createAccountUseCase.execute(data1);
      await createAccountUseCase.execute(data2);
    }).rejects.toBeInstanceOf(AppError);
  });
});
