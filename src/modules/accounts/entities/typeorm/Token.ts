import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from "typeorm";
import { v4 as uuid } from "uuid";
import { Account } from "./Account";

@Entity("tokens")
export class Token {
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

  constructor(props: Omit<Token, "id" | "created_at">, id?: string) {
    Object.assign(this, props);
    if (!id) {
      this.id = uuid();
    }
  }
}
