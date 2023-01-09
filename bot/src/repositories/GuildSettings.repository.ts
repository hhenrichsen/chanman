 
import { Service } from "typedi";
import { GuildSettings } from "../entities/Guild.entity";
import { DataSourceManager } from "../service/DataSourceManager";
import { RepositoryManager } from "./Repository";

@Service()
export class GuildSettingsRepository extends RepositoryManager<GuildSettings> {
    constructor(dataSourceManager: DataSourceManager) {
        super(GuildSettings, dataSourceManager);
    }
    
    public async saveDefaultGuild(id: string | undefined): Promise<void> {
        if (!id) {
            return;
        }
        if ((await this.getGuildById(id))) {
            return;
        }
        const settings = new GuildSettings({
            id,
        });
        await this.saveGuildSettings(settings);
    }
    
    public async getGuildById(id: string): Promise<GuildSettings | undefined> {
        return this.withRepo(async (repo) => {
            return (await repo.findOne({ where: { id } })) ?? undefined;
        });
    }
    
    public async saveGuildSettings(guild: GuildSettings) {
        return this.withRepo(async (repo) => {
            return (await repo.save(guild));
        });
    }
}
