import Logger from "bunyan";
import { MessageReaction } from "discord.js";
import { Service } from "typedi";
import { GuildSettingsRepository } from "../../repositories/GuildSettings.repository";
import { DeleteReactHandler } from "./DeleteReactHandler";
import { FlagReactHandler } from "./FlagReactHandler";
import { PinReactHandler } from "./PinReactHandler";

export interface EmojiReactHandler {
    emoji: string;
    handleAdd: (messageReaction: MessageReaction) => void | Promise<void>;
    handleRemove: (messageReaction: MessageReaction) => void | Promise<void>;
}

@Service()
export class ReactHandler {
    private emojiHandlers: Map<string, EmojiReactHandler> = new Map();

    constructor(
        private readonly logger: Logger,
        private readonly guildSettingsRepo: GuildSettingsRepository,
        pinReactHandler: PinReactHandler,
        flagReactHandler: FlagReactHandler,
        deleteReactHandler: DeleteReactHandler,
    ) {
        const handlers = [
            pinReactHandler,
            flagReactHandler,
            deleteReactHandler,
        ];
        for (const handler of handlers) {
            this.emojiHandlers.set(handler.emoji, handler);
        }
    }

    public handleAdd(messageReaction: MessageReaction): void | Promise<void> {
        this.logger.debug(`ReactHandler: Got added reaction ${messageReaction.emoji.name} on ${messageReaction.message.id}`);
        this.guildSettingsRepo.saveDefaultGuild(messageReaction.message.guild?.id);
        if (messageReaction.emoji.name) {
            this.emojiHandlers
                .get(messageReaction.emoji.name)
                ?.handleAdd(messageReaction);
        }
    }

    public handleRemove(
        messageReaction: MessageReaction,
    ): void | Promise<void> {
        this.logger.debug(`ReactHandler: Got removed reaction ${messageReaction.emoji.name} on ${messageReaction.message.id}`);
        this.guildSettingsRepo.saveDefaultGuild(messageReaction.message.guild?.id);
        if (messageReaction.emoji.name) {
            this.emojiHandlers
                .get(messageReaction.emoji.name)
                ?.handleRemove(messageReaction);
        }
    }
}
