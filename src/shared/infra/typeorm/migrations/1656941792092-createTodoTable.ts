import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class createTodoTable1656941792092 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "todos",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
          },
          {
            name: "content",
            type: "varchar(200)",
          },
          {
            name: "is_completed",
            type: "boolean",
          },
          {
            name: "due_to",
            type: "timestamp",
            isNullable: true,
          },
          {
            name: "account_id",
            type: "uuid",
          },
          {
            name: "created_at",
            type: "timestamp",
            default: "now()",
          },
        ],
        foreignKeys: [
          {
            name: "FK_account_todos",
            referencedTableName: "accounts",
            referencedColumnNames: ["id"],
            columnNames: ["account_id"],
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
          },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey("todos", "FK_account_todos");
    await queryRunner.dropTable("todos");
  }
}
