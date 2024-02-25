import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateUsersTable1706164439632 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'users',
        columns: [
          {
            name: 'id',
            type: 'bigint',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          { name: 'name', type: 'varchar', length: '200' },
          { name: 'email', type: 'varchar', length: '200', isUnique: true },
          { name: 'password', type: 'varchar', length: '250' },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('users', true);
  }
}
