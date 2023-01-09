import {
    AutocompleteInteraction,
    CacheType,
    ChatInputCommandInteraction,
    DiscordAPIError,
    SlashCommandBuilder,
} from "discord.js";
import { Command } from "./Command";
import { PermissionFlagsBits } from "discord.js";
import { Service } from "typedi";
import { getValidChannels, isGuildCategory } from "../util/Guild";
import Logger from "bunyan";
import { GuildSettingsRepository } from "../repositories/GuildSettings.repository";

@Service()
export class PurgeCommand extends Command {
    constructor(
        private readonly logger: Logger,
        private readonly guildSettingsRepo: GuildSettingsRepository,
    ) {
        super();
    }

    public override readonly declaration = new SlashCommandBuilder()
        .setName("purge")
        .setDescription("Deletes a category of channels")
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
        .addStringOption((option) =>
            option
                .setName("category_id")
                .setDescription("select a category to delete")
                .setRequired(true)
                .setAutocomplete(true),
        )
        .toJSON();

    public override async run(
        interaction: ChatInputCommandInteraction<CacheType>,
    ): Promise<void> {
        const guild = interaction.guild;
        if (!guild) {
            this.logger.debug("PurgeCommand: No guild found");
            return;
        }
        this.guildSettingsRepo.saveDefaultGuild(guild.id);
        this.logger.debug("PurgeCommand: Loading channels");
        const guildChannels = await getValidChannels(guild);
        const guildCategories = guildChannels.filter(isGuildCategory);
        this.logger.debug("PurgeCommand: Done loading channels");
        if (interaction.isChatInputCommand()) {
            const categoryID = interaction.options.getString("category_id");
            if (!categoryID) {
                interaction.reply({
                    ephemeral: true,
                    content: "Missing channel ID",
                });
                return;
            }

            const category = guildCategories.find(
                (category) => category.id == categoryID,
            );
            if (!category) {
                interaction.reply({
                    ephemeral: true,
                    content: "Could not find a category with that ID.",
                });
                return;
            }

            const toDelete = guildChannels.filter(
                (channel) => channel.parentId == categoryID,
            );
            try {
                await Promise.all(toDelete.map((channel) => channel.delete()));
                await interaction.reply({
                    ephemeral: true,
                    content: "Cleared!",
                });
            } catch (error) {
                if (error instanceof DiscordAPIError) {
                    if (error.code == 50013) {
                        await interaction.reply({
                            ephemeral: true,
                            content:
                                "I don't have permission to delete those channels.",
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

    public override async autocomplete(
        interaction: AutocompleteInteraction<CacheType>,
    ): Promise<void> {
        const guild = interaction.guild;
        if (!guild) {
            return;
        }
        const guildChannels = await getValidChannels(guild);
        const guildCategories = guildChannels.filter(isGuildCategory);
        if (interaction.isAutocomplete()) {
            this.logger.info(`Completing purge`);
            const choices = [];
            for (const category of guildCategories) {
                choices.push({
                    value: `${category.id}`,
                    name: `${category.name}`,
                });
            }
            this.logger.info(choices);
            await interaction.respond(choices);
        }
    }
}
