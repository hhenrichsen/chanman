import { Message, MessageReaction } from "discord.js";
import { Service } from "typedi";
import { GuildSettingsRepository } from "../../repositories/GuildSettings.repository";
import { EmojiReactHandler } from "./ReactHandler";

@Service()
export class PinReactHandler implements EmojiReactHandler {
    constructor(private readonly guildSettings: GuildSettingsRepository) {}

    public readonly emoji: string = "📌";

    public async handleAdd(messageReaction: MessageReaction): Promise<void> {
        const messageAndSettings = await this.getMessageAndSettings(
            messageReaction,
        );
        if (!messageAndSettings) {
            return;
        }
        const { guildSettings, message } = messageAndSettings;
        if (!guildSettings.pinThreshold || message.pinned) {
            return;
        }
        if (messageReaction.count >= guildSettings.pinThreshold) {
            this.pinMessage(message);
        }
    }

    public async handleRemove(messageReaction: MessageReaction): Promise<void> {
        const messageAndSettings = await this.getMessageAndSettings(
            messageReaction,
        );
        if (!messageAndSettings) {
            return;
        }
        const { guildSettings, message } = messageAndSettings;
        if (!guildSettings.pinThreshold) {
            return;
        }
        if (messageReaction.count < guildSettings.pinThreshold) {
            if (message.pinned) {
                await message.unpin();
            }
        }
    }

    private async pinMessage(message: Message<boolean>) {
        const pinned = await message.channel.messages.fetchPinned();
        if (pinned.size == 50) {
            const oldest = pinned.reduce(
                (a, i) => (i.createdTimestamp < a.createdTimestamp ? i : a),
                message,
            );
            await oldest.unpin();
        }
        await message.pin();
    }

    private async getMessageAndSettings(messageReaction: MessageReaction) {
        let message = messageReaction.message;
        if (message.partial) {
            message = await message.fetch();
        }
        if (!message.guild) {
            return undefined;
        }
        if (messageReaction.emoji.name != this.emoji) {
            return undefined;
        }
        const guildSettings = await this.guildSettings.getGuildById(
            message.guild.id,
        );
        if (!guildSettings) {
            return undefined;
        }
        return { guildSettings, message };
    }
}
