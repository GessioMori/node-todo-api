import { ICreateAccountDTO } from "../dtos/ICreateAccountDTO";
import { Account } from "../entities/typeorm/Account";

export interface IAccountsRepository {
  createAccount(data: ICreateAccountDTO, id?: string): Promise<Account>;
  findById(id: string): Promise<Account>;
  findByEmail(email: string): Promise<Account>;
}
