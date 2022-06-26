import { ICreatePasswordRecoveryDTO } from "../dtos/ICreatePasswordRecoveryDTO";
import { IPasswordRecovery } from "../entities/IPasswordRecovery";

export interface IPasswordRecoveryRepository {
  createPasswordRecovery(
    data: ICreatePasswordRecoveryDTO
  ): Promise<IPasswordRecovery>;
  findById(id: string): Promise<IPasswordRecovery>;
  deleteById(id: string): Promise<void>;
  deleteByAccountId(account_id: string): Promise<void>;
  findByAccountId(account_id: string): Promise<IPasswordRecovery>;
}
