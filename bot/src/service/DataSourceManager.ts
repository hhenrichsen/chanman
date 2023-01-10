import { EntityToken } from "../entities/Entity";
import Container, { Service } from "typedi";
import { DataSource } from "typeorm";
import Logger from "bunyan";

// Make sure we get entities into the injector.
import "../entities/Guild.entity";
import "../entities/ChannelAlias.entity"

const { DATABASE_URL, NODE_ENV } = process.env;

@Service()
export class DataSourceManager {
    private dataSource?: DataSource = undefined;

    constructor(private readonly logger: Logger) {}

    async get(): Promise<DataSource> {
        if (!this.dataSource) {
            const entities = [...Container.getMany(EntityToken)];
            this.logger.info(`Registerred ${entities.length} entities.`);

            const dataSource = new DataSource({
                type: "mysql",
                url: DATABASE_URL,
                entities,
                migrationsTableName: "_migrations",
                synchronize: NODE_ENV?.toLowerCase() != "production",
            });

            this.dataSource = await dataSource.initialize();
        }
        return this.dataSource;
    }
}
