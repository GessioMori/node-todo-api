import { Account } from "@modules/accounts/entities/typeorm/Account";
import { PasswordRecovery } from "@modules/accounts/entities/typeorm/PasswordRecovery";
import { Token } from "@modules/accounts/entities/typeorm/Token";
import { Todo } from "@modules/todos/entities/typeorm/Todo";
import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "dev",
  password: "dev",
  database: process.env.NODE_ENV === "test" ? "todosdb_test" : "todosdb",
  migrations: ["./src/shared/infra/typeorm/migrations/*.ts"],
  entities: [Account, Token, PasswordRecovery, Todo],
});
