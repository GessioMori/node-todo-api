import { Account } from "../entities/typeorm/Account";

export type IAccountResponseDTO = Pick<Account, "email" | "name">;
