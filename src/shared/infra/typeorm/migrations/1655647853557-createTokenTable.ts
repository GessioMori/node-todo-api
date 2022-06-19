import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class createTokenTable1655647853557 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "tokens",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
          },
          {
            name: "account_id",
            type: "uuid",
          },
          {
            name: "expires_at",
            type: "timestamp",
          },
          {
            name: "created_at",
            type: "timestamp",
            default: "now()",
          },
        ],
        foreignKeys: [
          {
            name: "FK_account_token",
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
    await queryRunner.dropForeignKey("tokens", "FK_account_token");
    await queryRunner.dropTable("tokens");
  }
}
