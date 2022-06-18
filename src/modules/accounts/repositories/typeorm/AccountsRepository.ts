import { ICreateAccountDTO } from "@modules/accounts/dtos/ICreateAccountDTO";
import { Account } from "@modules/accounts/entities/typeorm/Account";
import { IAccountsRepository } from "@modules/accounts/repositories/IAccountsRepository";
import { AppDataSource } from "@shared/infra/typeorm";
import { Repository } from "typeorm";

export class AccountsRepository implements IAccountsRepository {
  private repository: Repository<Account>;

  constructor() {
    this.repository = AppDataSource.getRepository(Account);
  }

  async createAccount({
    email,
    name,
    password,
  }: ICreateAccountDTO): Promise<Account> {
    const newAccount = this.repository.create({ email, name, password });
    return await this.repository.save(newAccount);
  }

  async findById(id: string): Promise<Account> {
    return await this.repository.findOneBy({ id });
  }

  async findByEmail(email: string): Promise<Account> {
    return await this.repository.findOneBy({ email });
  }
}
