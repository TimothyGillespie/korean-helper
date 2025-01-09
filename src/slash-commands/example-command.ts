import { GuildMember, SlashCommandBuilder } from 'discord.js';
import { DiscordCommand } from '../types/discord';
import { Logger } from '../logging/logger';

export const exampleCommand: DiscordCommand = {
  data: new SlashCommandBuilder()
    .setName('example-command')
    .setDescription('This is just an example command.')
    .addStringOption((option) => option.setName('youtube-id').setDescription('The YouTube video ID or URL.').setRequired(true)),
  execute: async (interaction) => {
    Logger.info('Executing example command...');
    return interaction.reply({
      content: 'This is just an example command.',
      ephemeral: true,
      allowedMentions: {},
    });
  },
};
