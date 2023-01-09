import { Service } from "typedi";
import { GuildSettings } from "../entities/Guild.entity";
import { DataSourceManager } from "../service/DataSourceManager";
import { RepositoryManager } from "./Repository";

@Service()
export class GuildSettingsRepository extends RepositoryManager<GuildSettings> {
    private readonly cache = new Map<string, GuildSettings>();
    private readonly live = new Map<string, Date>();
    private readonly timeoutMs = 5 * 60 * 1000;

    constructor(dataSourceManager: DataSourceManager) {
        super(GuildSettings, dataSourceManager);
    }

    public async saveDefaultGuild(id: string | undefined): Promise<void> {
        if (!id) {
            return;
        }
        if (await this.getGuildById(id)) {
            return;
        }
        const settings = new GuildSettings({
            id,
        });
        await this.saveGuildSettings(settings);
        this.cache.set(id, settings);
    }

    public async getGuildById(id: string): Promise<GuildSettings | undefined> {
        const lastAccessed = this.live.get(id);
        if (lastAccessed) {
            if (
                (new Date().getTime() - lastAccessed.getTime()) / 1000 <=
                this.timeoutMs
            ) {
                return this.cache.get(id);
            }
        }
        return this.withRepo(async (repo) => {
            const value = (await repo.findOne({ where: { id } })) ?? undefined;
            value && this.cache.set(id, value);
            value && this.live.set(id, new Date());
            return value;
        });
    }

    public async saveGuildSettings(guild: GuildSettings) {
        this.live.set(guild.id, new Date());
        this.cache.set(guild.id, guild);
        return this.withRepo(async (repo) => {
            return await repo.save(guild);
        });
    }
}
