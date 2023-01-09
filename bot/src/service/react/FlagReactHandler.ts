import { MessageReaction } from "discord.js";
import { Service } from "typedi";
import { EmojiReactHandler } from "./ReactHandler";

@Service()
export class FlagReactHandler implements EmojiReactHandler {
    emoji = "🚩";
    handleAdd: (messageReaction: MessageReaction) => void | Promise<void>;
    handleRemove: (messageReaction: MessageReaction) => void | Promise<void>;
}