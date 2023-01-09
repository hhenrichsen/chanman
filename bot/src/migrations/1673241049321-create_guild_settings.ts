import { MigrationInterface, QueryRunner } from "typeorm";

export class createGuildSettings1673241049321 implements MigrationInterface {
    name = "createGuildSettings1673241049321";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE \`guild_settings\` (\`id\` varchar(32) NOT NULL, \`categoryId\` varchar(32) NULL, \`logChannel\` varchar(32) NULL, \`flagChannel\` varchar(32) NULL, \`pinThreshold\` int NOT NULL, \`flagThreshold\` int NOT NULL, \`deleteThreshold\` int NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`version\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`guild_settings\``);
    }
}
