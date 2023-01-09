import {
    AutocompleteInteraction,
    CacheType,
    ChatInputCommandInteraction,
    RESTPostAPIApplicationCommandsJSONBody,
} from "discord.js";

export abstract class Command {
    public abstract readonly declaration: RESTPostAPIApplicationCommandsJSONBody;

    public abstract run(
        interaction: ChatInputCommandInteraction<CacheType>,
    ): Promise<void> | void;

    public autocomplete(
        _interaction: AutocompleteInteraction<CacheType>,
    ): Promise<void> | void {
        return;
    }
}
