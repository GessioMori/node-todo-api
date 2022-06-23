import { ICreateRefreshTokenDTO } from "@modules/accounts/dtos/ICreateRefreshTokenDTO";
import { IToken } from "@modules/accounts/entities/IToken";
import { Token } from "@modules/accounts/entities/typeorm/Token";
import { AppDataSource } from "@shared/infra/typeorm";
import { Repository } from "typeorm";
import { ITokensRepository } from "../ITokensRepository";

export class TokensRepository implements ITokensRepository {
  private repository: Repository<Token>;

  constructor() {
    this.repository = AppDataSource.getRepository(Token);
  }

  async createRefreshToken({
    account_id,
    expires_at,
  }: ICreateRefreshTokenDTO): Promise<IToken> {
    const token = this.repository.create({ account_id, expires_at });
    await this.repository.save(token);
    return token;
  }

  async findByAccountId(account_id: string): Promise<IToken> {
    const token = this.repository.findOne({
      where: { account_id },
    });
    return token;
  }

  async findById(id: string): Promise<IToken> {
    const token = await this.repository.findOne({ where: { id } });
    return token;
  }

  async deleteById(id: string): Promise<void> {
    await this.repository.delete({ id });
  }

  async deleteByAccountId(account_id: string): Promise<void> {
    await this.repository.delete({ account_id });
  }
}
