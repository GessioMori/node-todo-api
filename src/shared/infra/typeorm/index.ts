import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "dev",
  password: "dev",
  database: "todosdb",
  migrations: ["./src/shared/infra/typeorm/migrations/*.ts"],
});
