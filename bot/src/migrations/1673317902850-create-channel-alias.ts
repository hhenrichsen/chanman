import { MigrationInterface, QueryRunner } from "typeorm";

export class createChannelAlias1673317902850 implements MigrationInterface {
    name = 'createChannelAlias1673317902850'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`channel_alias\` (\`id\` varchar(36) NOT NULL, \`nickname\` varchar(255) NOT NULL, \`target\` varchar(255) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`version\` int NOT NULL, \`guildId\` varchar(32) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`channel_alias\` ADD CONSTRAINT \`FK_10fee86eceba4db51a4c3675135\` FOREIGN KEY (\`guildId\`) REFERENCES \`guild_settings\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`channel_alias\` DROP FOREIGN KEY \`FK_10fee86eceba4db51a4c3675135\``);
        await queryRunner.query(`DROP TABLE \`channel_alias\``);
    }

}
