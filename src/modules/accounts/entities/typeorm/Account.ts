import { Column, CreateDateColumn, Entity, PrimaryColumn } from "typeorm";
import { v4 as uuid } from "uuid";
import { IAccount } from "../IAccount";

@Entity("accounts")
export class Account implements IAccount {
  @PrimaryColumn()
  id: string;

  @Column()
  email: string;

  @Column()
  name: string;

  @Column()
  password: string;

  @CreateDateColumn()
  created_at: Date;

  constructor(
    props: Omit<Account, "id" | "created_at"> | Omit<Account, "id">,
    id?: string
  ) {
    Object.assign(this, props);
    if (!id) {
      this.id = uuid();
    }
  }
}
