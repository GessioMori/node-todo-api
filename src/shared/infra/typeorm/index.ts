import dotenv from "dotenv";

import { Account } from "@modules/accounts/entities/typeorm/Account";
import { PasswordRecovery } from "@modules/accounts/entities/typeorm/PasswordRecovery";
import { Token } from "@modules/accounts/entities/typeorm/Token";
import { Todo } from "@modules/todos/entities/typeorm/Todo";
import { DataSource } from "typeorm";

dotenv.config();

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.PG_HOST,
  port: Number(process.env.PG_PORT),
  username: "dotosdb",
  password: process.env.PG_PASSWORD,
  database: process.env.NODE_ENV === "test" ? "dotosdb_test" : "dotosdb",
  migrations:
    process.env.NODE_ENV === "production"
      ? ["./dist/shared/infra/typeorm/migrations/*.js"]
      : ["./src/shared/infra/typeorm/migrations/*.ts"],
  entities: [Account, Token, PasswordRecovery, Todo],
});
