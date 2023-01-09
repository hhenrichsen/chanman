import Logger from "bunyan";
import { Service } from "typedi";
import { Bot } from "./service/Bot";
import { DataSourceManager } from "./service/DataSourceManager";

@Service()
export class BotInitializer {
    constructor(
        private readonly dataSourceManager: DataSourceManager,
        private readonly bot: Bot,
        private readonly logger: Logger,
    ) {}

    public async init() {
        this.logger.info("Connecting to database...");
        // Initial connect, we don't care about the return value
        await this.dataSourceManager.get();
        this.logger.info("Connected!");

        this.logger.info("Connected to Discord...");
        this.bot.login();
        this.logger.info("Connected!");
    }
}
