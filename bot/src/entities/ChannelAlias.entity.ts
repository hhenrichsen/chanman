import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    VersionColumn,
} from "typeorm";
import Container from "typedi";
import { EntityToken } from "./Entity";
import { GuildSettings } from "./Guild.entity";

@Entity()
export class ChannelAlias {
    @ManyToOne(() => GuildSettings, (guild) => guild.aliases)
    guild: GuildSettings

    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column()
    nickname: string

    @Column()
    target: string

    @CreateDateColumn()
    createdAt: Date = new Date();

    @UpdateDateColumn()
    updatedAt: Date = new Date();

    @VersionColumn()
    version = 0;
}


// Inject so we can retrieve this model when we create the connection.
// The syntax here is weird because we need the _class_, not an instance.
Container.set({ id: EntityToken, multiple: true, value: ChannelAlias });
