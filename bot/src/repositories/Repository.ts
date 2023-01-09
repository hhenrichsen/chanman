import { EntityTarget, ObjectLiteral, Repository } from "typeorm";
import { DataSourceManager } from "../service/DataSourceManager";

export class RepositoryManager<T extends ObjectLiteral> {
    private repo?: Repository<T>;
    
    constructor(private readonly cls: EntityTarget<T>, private readonly dataSourceManager: DataSourceManager) { }
    
    private async getRepo() {
        if (!this.repo) {
            this.repo = (await this.dataSourceManager.get()).getRepository(this.cls);
        }
        return this.repo;
    }

    protected async withRepo<R>(fn: (repo: Repository<T>) => Promise<R>): Promise<R> {
        return fn(await this.getRepo());
    }
}