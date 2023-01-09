import Logger from "bunyan";
import { CacheType, Interaction } from "discord.js";
import { Service } from "typedi";
import { CommandRegistry } from "./CommandRegistry";

@Service()
export class CommandHandler {
    constructor(
        private readonly logger: Logger,
        private readonly commandRegistry: CommandRegistry,
    ) {}

    public handle(interaction: Interaction<CacheType>) {
        if (interaction.isAutocomplete()) {
            this.logger.debug(
                `Handling command autocomplete ${interaction.commandName} for ${interaction.member}`,
            );
            const command = this.commandRegistry.getCommand(
                interaction.commandName,
            );
            if (command) {
                command.autocomplete(interaction);
            } else {
                this.logger.warn(
                    `Trying to execute nonexistent autocomplete command ${interaction.commandName} for ${interaction.member}`,
                );
            }
        } else if (interaction.isChatInputCommand()) {
            this.logger.debug(
                `Handling chat input command ${interaction.commandName} for ${interaction.member}`,
            );
            const command = this.commandRegistry.getCommand(
                interaction.commandName,
            );
            if (command) {
                command.run(interaction);
            } else {
                this.logger.warn(
                    `Trying to execute nonexistent chat input command ${interaction.commandName} for ${interaction.member}`,
                );
            }
        } else {
            this.logger.warn(
                `Tried to handle unknown interaction ${interaction.type} for ${interaction.member}`,
            );
        }
    }
}
