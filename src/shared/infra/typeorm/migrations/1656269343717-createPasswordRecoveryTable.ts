import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class createPasswordRecoveryTable1656269343717
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "password_recovery",
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
            name: "FK_account_password",
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
    await queryRunner.dropForeignKey(
      "password_recovery",
      "FK_account_password"
    );
    await queryRunner.dropTable("password_recovery");
  }
}
