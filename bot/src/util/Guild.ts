import { CategoryChannel, Channel, ChannelType, Guild } from "discord.js";
import { filterTruthy } from "./Types";

export async function getValidChannels(guild: Guild) {
        return [...(await guild.channels.fetch()).values()].filter(filterTruthy);
}

export async function getCategories(guild: Guild) {
    return (await getValidChannels(guild)).filter(isGuildCategory);
}

export function isGuildCategory(channel: Channel): channel is CategoryChannel {
    return channel.type == ChannelType.GuildCategory;
}