import { ICreatePasswordRecoveryDTO } from "@modules/accounts/dtos/ICreatePasswordRecoveryDTO";
import { IPasswordRecovery } from "@modules/accounts/entities/IPasswordRecovery";
import { PasswordRecovery } from "@modules/accounts/entities/typeorm/PasswordRecovery";
import { AppDataSource } from "@shared/infra/typeorm";
import { Repository } from "typeorm";
import { IPasswordRecoveryRepository } from "../IPasswordRecoveryRepository";

export class PasswordRecoveryRepository implements IPasswordRecoveryRepository {
  private repository: Repository<PasswordRecovery>;

  constructor() {
    this.repository = AppDataSource.getRepository(PasswordRecovery);
  }

  async createPasswordRecovery({
    account_id,
    expires_at,
  }: ICreatePasswordRecoveryDTO): Promise<IPasswordRecovery> {
    const passwordRecoveryToken = this.repository.create({
      account_id,
      expires_at,
    });
    await this.repository.save(passwordRecoveryToken);
    return passwordRecoveryToken;
  }

  async findById(id: string): Promise<IPasswordRecovery> {
    const passwordRecoveryToken = await this.repository.findOne({
      where: { id },
    });
    return passwordRecoveryToken;
  }

  async deleteById(id: string): Promise<void> {
    await this.repository.delete({ id });
  }

  async deleteByAccountId(account_id: string): Promise<void> {
    await this.repository.delete({ account_id });
  }

  async findByAccountId(account_id: string): Promise<IPasswordRecovery> {
    const token = this.repository.findOne({
      where: { account_id },
    });
    return token;
  }
}
