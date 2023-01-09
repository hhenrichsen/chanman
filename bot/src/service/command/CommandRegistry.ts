import { Service } from "typedi";
import { Command } from "../../commands/Command";
import { JoinCommand } from "../../commands/Join.command";
import { PurgeCommand } from "../../commands/Purge.command";

@Service()
export class CommandRegistry {
    private readonly commands: Map<string, Command> = new Map();

    constructor(purgeCommand: PurgeCommand, joinCommand: JoinCommand) {
        const commands = [purgeCommand, joinCommand];
        commands.forEach((command) =>
            this.commands.set(command.declaration.name, command),
        );
    }

    public getCommandDeclarations() {
        return Array.from(this.commands.values()).map(
            (command) => command.declaration,
        );
    }

    public getCommand(name: string) {
        return this.commands.get(name);
    }
}
