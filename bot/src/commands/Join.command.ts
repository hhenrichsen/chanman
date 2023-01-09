import Logger from "bunyan";
import {
    AutocompleteInteraction,
    CacheType,
    ChatInputCommandInteraction,
    DiscordAPIError,
    SlashCommandBuilder,
} from "discord.js";
import { Service } from "typedi";
import { GuildSettingsRepository } from "../repositories/GuildSettings.repository";
import { getValidChannels, isGuildCategory } from "../util/Guild";
import { Command } from "./Command";

@Service()
export class JoinCommand extends Command {
    public override readonly declaration = new SlashCommandBuilder()
        .setName("join")
        .setDescription("Join a class channel")
        .setDMPermission(false)
        .addStringOption((option) =>
            option
                .setName("name")
                .setDescription("join a channel with the given name")
                .setRequired(true)
                .setAutocomplete(true),
        )
        .toJSON();

    constructor(
        private readonly logger: Logger,
        private readonly guildSettingsRepo: GuildSettingsRepository,
    ) {
        super();
    }

    public override async autocomplete(
        interaction: AutocompleteInteraction<CacheType>,
    ): Promise<void> {
        const guild = interaction.guild;
        if (!guild) {
            this.logger.debug("JoinCommand: No guild found.");
            return;
        }

        this.logger.debug("Getting guild settings");
        const settings = await this.guildSettingsRepo.getGuildById(guild.id);
        if (!settings) {
            this.logger.debug("JoinCommand: Failed to find guild settings");
            return;
        }

        const channels = await getValidChannels(guild);
        const category = channels
            .filter(isGuildCategory) // Probably not needed, but nice to check for
            .find((category) => category.id == settings.categoryId);

        if (!category) {
            this.logger.debug("JoinCommand: No category found");
            return;
        }

        const categoryChannels = channels.filter(
            (channel) => channel.parentId == category.id,
        );
        const result = [];
        for (const channelMaybe of categoryChannels) {
            const channel = await channelMaybe.fetch();
            if (
                !channel.isThread() &&
                !channel.isDMBased() &&
                channel.isTextBased() &&
                !channel.isVoiceBased()
            ) {
                result.push({
                    value: channel.name,
                    name: channel.topic || channel.name.toUpperCase(),
                });
            }
        }
        try {
            await interaction.respond(result);
        } catch (error) {
            this.logger.error(error);
        }
    }

    public override async run(
        interaction: ChatInputCommandInteraction<CacheType>,
    ): Promise<void> {
        const guild = interaction.guild;
        if (!guild) {
            this.logger.debug("JoinCommand: No guild found.");
            return;
        }
        this.guildSettingsRepo.saveDefaultGuild(guild.id);

        this.logger.debug("Getting guild settings");
        const settings = await this.guildSettingsRepo.getGuildById(guild.id);
        if (!settings) {
            this.logger.debug("JoinCommand: Failed to find guild settings");
            return;
        }

        const channels = await getValidChannels(guild);
        const category = channels
            .filter(isGuildCategory) // Probably not needed, but nice to check for
            .find((category) => category.id == settings.categoryId);

        if (!category) {
            this.logger.debug("JoinCommand: No category found");
            return;
        }

        const name =
            interaction.options.getString("name", true) ??
            interaction.options.data[0];

        if (!name) {
            await interaction.reply({
                ephemeral: true,
                content: "Please give me a class to join.",
            });
            return;
        }

        const fixedName = name.replace(/-/g, "").toLowerCase();

        try {
            const maybeChannel = channels.find(
                (channel) =>
                    channel.name == fixedName &&
                    channel.parentId == category.id,
            );
            const channel =
                maybeChannel && maybeChannel.partial
                    ? await maybeChannel.fetch()
                    : maybeChannel ??
                      (await guild.channels.create({
                          parent: category.id,
                          name,
                      }));

            await channel.permissionOverwrites.edit(interaction.user, {
                ViewChannel: true,
            });
            await interaction.reply({
                ephemeral: true,
                content: "Joined!",
            });
        } catch (error) {
            if (error instanceof DiscordAPIError) {
                if (error.code == 50013) {
                    await interaction.reply({
                        ephemeral: true,
                        content:
                            "I don't have permission to edit channels. Please contact an admin.",
                    });
                }
            } else {
                await interaction.reply({
                    ephemeral: true,
                    content: "An internal error occurred.",
                });
            }
        }
    }
}
