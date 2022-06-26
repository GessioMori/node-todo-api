import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from "typeorm";
import { v4 as uuid } from "uuid";
import { IPasswordRecovery } from "../IPasswordRecovery";
import { Account } from "./Account";

@Entity("password_recovery")
export class PasswordRecovery implements IPasswordRecovery {
  @PrimaryColumn()
  id: string;

  @Column()
  account_id: string;

  @Column()
  expires_at: Date;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => Account)
  @JoinColumn({ name: "account_id" })
  account: Account;

  constructor(
    props: Omit<PasswordRecovery, "id" | "created_at" | "account">,
    id?: string
  ) {
    Object.assign(this, props);
    if (!id) {
      this.id = uuid();
    }
  }
}
