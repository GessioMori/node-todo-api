import { ICreatePasswordRecoveryDTO } from "@modules/accounts/dtos/ICreatePasswordRecoveryDTO";
import { IPasswordRecovery } from "@modules/accounts/entities/IPasswordRecovery";
import { PasswordRecovery } from "@modules/accounts/entities/typeorm/PasswordRecovery";
import { IPasswordRecoveryRepository } from "@modules/accounts/repositories/IPasswordRecoveryRepository";

export class PasswordRecoveryRepositoryInMemory
  implements IPasswordRecoveryRepository
{
  private items: IPasswordRecovery[] = [];

  async createPasswordRecovery({
    account_id,
    expires_at,
  }: ICreatePasswordRecoveryDTO): Promise<IPasswordRecovery> {
    const newToken: IPasswordRecovery = new PasswordRecovery({
      account_id,
      expires_at,
    });
    this.items.push(newToken);
    return newToken;
  }

  async findById(id: string): Promise<IPasswordRecovery> {
    const token = this.items.find((item) => item.id === id);
    return token;
  }

  async deleteById(id: string): Promise<void> {
    const tokenIndex = this.items.findIndex((item) => item.id === id);
    this.items.splice(tokenIndex, 1);
  }

  async deleteByAccountId(account_id: string): Promise<void> {
    this.items = this.items.filter((item) => item.account_id !== account_id);
  }

  async findByAccountId(account_id: string): Promise<IPasswordRecovery> {
    const token = this.items.find((item) => item.account_id === account_id);
    return token;
  }

  async makeTokenExpired(id: string): Promise<void> {
    const tokenIndex = this.items.findIndex((item) => item.id === id);
    this.items[tokenIndex] = {
      ...this.items[tokenIndex],
      expires_at: new Date("2000-01-01"),
    };
  }
}
