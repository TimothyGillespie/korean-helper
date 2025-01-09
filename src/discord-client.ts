import { Client, GatewayIntentBits, Partials, REST, Routes } from 'discord.js';
import { DiscordCommand } from './types/discord';
import { DISCORD_CLIENT_ID, DISCORD_TOKEN } from './configurations/config';
import { Logger } from './logging/logger';

export const discordClient = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
  partials: [],
});

export const startDiscordClient = async () => {
  await discordClient.login(DISCORD_TOKEN);
};

export const closeDiscordClient = async () => {
  await discordClient.destroy();
};

export const discordRESTClient = new REST({ version: '10' }).setToken(DISCORD_TOKEN);

export const syncCommands = async (commands: DiscordCommand[]) => {
  discordRESTClient
    .put(Routes.applicationCommands(DISCORD_CLIENT_ID), {
      body: commands.map((singleCommand: DiscordCommand) => singleCommand.data.toJSON()),
    })
    .then(() => {
      Logger.info('Successfully registered application commands.');
    });
};
