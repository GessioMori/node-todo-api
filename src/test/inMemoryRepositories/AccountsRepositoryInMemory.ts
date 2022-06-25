import { ICreateAccountDTO } from "@modules/accounts/dtos/ICreateAccountDTO";
import { Account } from "@modules/accounts/entities/typeorm/Account";
import { IAccountsRepository } from "@modules/accounts/repositories/IAccountsRepository";

export class AccountsRepositoryInMemory implements IAccountsRepository {
  items: Account[] = [];

  async createAccount({
    email,
    name,
    password,
  }: ICreateAccountDTO): Promise<Account> {
    const newAccount = new Account({
      email,
      name,
      password,
      created_at: new Date(),
    });
    this.items.push(newAccount);
    return newAccount;
  }

  async findById(id: string): Promise<Account> {
    const account = this.items.find((item) => item.id === id);
    return account;
  }

  async findByEmail(email: string): Promise<Account> {
    const account = this.items.find((item) => item.email === email);
    return account;
  }
}
