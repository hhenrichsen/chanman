import {
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    PrimaryColumn,
    UpdateDateColumn,
    VersionColumn,
} from "typeorm";
import Container from "typedi";
import { EntityToken } from "./Entity";
import { ChannelAlias } from "./ChannelAlias.entity";

@Entity()
export class GuildSettings {
    constructor(props: Partial<GuildSettings>) {
        Object.assign(this, props);
    }

    @PrimaryColumn("varchar", { length: 32 })
    id: string;

    @Column("varchar", { length: 32, nullable: true })
    categoryId?: string;

    @Column("varchar", { length: 32, nullable: true })
    logChannel?: string;

    @Column("varchar", { length: 32, nullable: true })
    flagChannel?: string;

    @Column("int")
    pinThreshold = 2;

    @Column("int")
    flagThreshold = 1;

    @Column("int")
    deleteThreshold = 5;

    @OneToMany(() => ChannelAlias, (alias) => alias.guild)
    aliases: ChannelAlias[]

    @CreateDateColumn()
    createdAt: Date = new Date();

    @UpdateDateColumn()
    updatedAt: Date = new Date();

    @VersionColumn()
    version = 0;
}

// Inject so we can retrieve this model when we create the connection.
// The syntax here is weird because we need the _class_, not an instance.
Container.set({ id: EntityToken, multiple: true, value: GuildSettings });
