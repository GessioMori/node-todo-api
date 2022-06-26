import { ICreateRefreshTokenDTO } from "@modules/accounts/dtos/ICreateRefreshTokenDTO";
import { IToken } from "@modules/accounts/entities/IToken";
import { Token } from "@modules/accounts/entities/typeorm/Token";
import { ITokensRepository } from "@modules/accounts/repositories/ITokensRepository";

export class TokensRepositoryInMemory implements ITokensRepository {
  items: Token[] = [];

  async createRefreshToken({
    account_id,
    expires_at,
  }: ICreateRefreshTokenDTO): Promise<IToken> {
    const newToken: Token = new Token({ account_id, expires_at });
    this.items.push(newToken);
    return newToken;
  }

  async findByAccountId(account_id: string): Promise<IToken> {
    const token = this.items.find((item) => item.account_id === account_id);
    return token;
  }

  async findById(id: string): Promise<IToken> {
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

  async makeTokenExpired(id: string): Promise<void> {
    const tokenIndex = this.items.findIndex((item) => item.id === id);
    this.items[tokenIndex] = {
      ...this.items[tokenIndex],
      expires_at: new Date("2000-01-01"),
    };
  }
}
