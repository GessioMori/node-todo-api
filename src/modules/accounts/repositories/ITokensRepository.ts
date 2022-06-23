import { ICreateRefreshTokenDTO } from "../dtos/ICreateRefreshTokenDTO";
import { IToken } from "../entities/IToken";

export interface ITokensRepository {
  createRefreshToken(data: ICreateRefreshTokenDTO): Promise<IToken>;
  findById(id: string): Promise<IToken>;
  deleteById(id: string): Promise<void>;
  deleteByAccountId(account_id: string): Promise<void>;
  findByAccountId(account_id: string): Promise<IToken>;
}
