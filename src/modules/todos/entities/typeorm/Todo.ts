import { Account } from "@modules/accounts/entities/typeorm/Account";
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from "typeorm";
import { v4 as uuid } from "uuid";
import { ITodo } from "../ITodo";

@Entity("todos")
export class Todo implements ITodo {
  @PrimaryColumn()
  id: string;

  @Column()
  account_id: string;

  @Column()
  content: string;

  @Column()
  is_completed: boolean;

  @Column({ nullable: true })
  due_to: Date;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => Account)
  @JoinColumn({ name: "account_id" })
  account: Account;

  constructor(
    props:
      | Omit<Todo, "id" | "created_at" | "is_completed" | "account">
      | Omit<Todo, "id">,
    id?: string
  ) {
    Object.assign(this, props);

    if (!id) {
      this.id = uuid();
      this.is_completed = false;
    } else {
      this.id = id;
    }
  }
}
