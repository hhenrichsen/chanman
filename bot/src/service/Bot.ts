import Logger from "bunyan";
import {
    Client,
    Events,
    GatewayIntentBits,
    Partials,
    REST,
    Routes,
} from "discord.js";
import { Service } from "typedi";
import { CommandHandler } from "./command/CommandHandler";
import { CommandRegistry } from "./command/CommandRegistry";
import { ReactHandler } from "./react/ReactHandler";

const { BOT_TOKEN, BOT_CLIENT_ID } = process.env;

@Service()
export class Bot {
    private client: Client;
    private rest: REST;
    private token: string;

    constructor(
        private readonly logger: Logger,
        private readonly commandRegistry: CommandRegistry,
        private readonly commandHandler: CommandHandler,
        private readonly reactHandler: ReactHandler,
    ) {
        if (!BOT_TOKEN) {
            throw new Error(
                "BOT_TOKEN was not set, bot cannot be initialized.",
            );
        }
        this.token = BOT_TOKEN;

        this.client = new Client({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.GuildMessageReactions,
            ],
            partials: [Partials.Message, Partials.Channel, Partials.Reaction],
        });

        this.rest = new REST({ version: "10" });

        this.registerListeners();
    }

    public login() {
        this.client.login(this.token);
        this.addCommands();
    }

    private addCommands() {
        if (BOT_CLIENT_ID) {
            this.rest.setToken(this.token);
            const commands = this.commandRegistry.getCommandDeclarations();
            this.rest.put(Routes.applicationCommands(BOT_CLIENT_ID), {
                body: commands,
            });
            this.logger.info(`Registered ${commands.length} commands.`);
        } else {
            this.logger.warn(
                "No BOT_CLIENT_ID provided; slash commands may not work.",
            );
        }
    }

    private registerListeners() {
        this.client.on("ready", () => {
            this.logger.info("Bot ready!");
            this.logger.info(
                "https://discord.com/oauth2/authorize?client_id=806249847773462619&scope=bot&permissions=17381204023",
            );
        });

        this.client.on(Events.InteractionCreate, (interaction) => {
            this.commandHandler.handle(interaction);
        });

        this.client.on(
            Events.MessageReactionAdd,
            async (maybePartialReaction) => {
                const reaction = await maybePartialReaction.fetch();
                this.reactHandler.handleAdd(reaction);
            },
        );

        this.client.on(
            Events.MessageReactionRemove,
            async (maybePartialReaction) => {
                const reaction = await maybePartialReaction.fetch();
                this.reactHandler.handleRemove(reaction);
            },
        );
    }
}
