import process from 'process';
import { ChatInputCommandInteraction, Collection, Events, GuildMember, TextChannel } from 'discord.js';
import { discordClient, startDiscordClient, syncCommands } from './discord-client';
import { DiscordCommand } from './types/discord';
import { createCommandUsage, updateCommandFailure, updateCommandUsageSuccess } from './database/command-usage';
import { Logger } from './logging/logger';
import { meaningOf } from './slash-commands/meaning-of';
import { QUESTION_CHANNEL_ID } from './configurations/config';
import { handleQuestionMessage } from './events/handleQuestionMessage';

const commands: DiscordCommand[] = [
  // Enter your commands here explicitly
  meaningOf,
];

const commandCollection = new Collection<string, DiscordCommand>();

for (const singleCommand of commands) {
  commandCollection.set(singleCommand.data.name, singleCommand);
}

discordClient.once('ready', async (client) => {
  Logger.info(`🚀 Logged in as ${client.user.tag}`);

  const gracefulShutdown = () => {
    Logger.info('Shutting down gracefully...');
    client.destroy();
    Logger.info('Discord client destroyed.');
    process.exit();
  };

  process.on('SIGTERM', gracefulShutdown);
  process.on('SIGINT', gracefulShutdown);

  client.on(Events.MessageCreate, async (message) => {
    if (message.channelId === QUESTION_CHANNEL_ID) handleQuestionMessage(message);
  });

  client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isCommand()) return;

    Logger.info(`Received command: ${interaction.commandName} from ${interaction.user.tag} (${interaction.user.id})`);
    let commandUsageData = await createCommandUsage(interaction);

    const discordCommand = commandCollection.get(interaction.commandName);

    if (!discordCommand) {
      Logger.error(`Command ${interaction.commandName} not found.`);
      await updateCommandFailure(commandUsageData?.id, new Error('Command not found.'));
      interaction.reply({
        content: 'There was an error while executing this command!',
        ephemeral: true,
        allowedMentions: {},
      });
      return;
    }

    if (discordCommand.permissions != null) {
      switch (discordCommand.permissions.type) {
        case 'role-whitelist': {
          const memberRoles = (interaction.member as GuildMember).roles.cache;
          const isPermittedRole = discordCommand.permissions.roleWhiteList.some((singleRoleId) => memberRoles.has(singleRoleId));

          if (!isPermittedRole) {
            Logger.error(
              `${discordCommand.data.name} command not permitted for ${interaction.user.tag} (${interaction.user.id}) - missing whitelisted role.`,
            );

            await interaction.reply({
              content: 'You do not have the required role to use this command.',
              ephemeral: true,
              allowedMentions: {},
            });
            await updateCommandFailure(commandUsageData?.id, new Error('Missing whitelisted role.'));
            return;
          }
          break;
        }
        case 'role-blacklist': {
          const memberRoles = (interaction.member as GuildMember).roles.cache;
          const isPermittedRole = !discordCommand.permissions.roleBlackList.some((singleRoleId) => memberRoles.has(singleRoleId));

          if (!isPermittedRole) {
            Logger.error(
              `${discordCommand.data.name} command not permitted for ${interaction.user.tag} (${interaction.user.id}) - has blacklisted role.`,
            );

            await interaction.reply({
              content: 'Your role is not permitted to use this command.',
              ephemeral: true,
              allowedMentions: {},
            });

            await updateCommandFailure(commandUsageData?.id, new Error('Has blacklisted role.'));
            return;
          }

          break;
        }
      }
    }

    discordCommand
      .execute(interaction as ChatInputCommandInteraction)
      .then(() => updateCommandUsageSuccess(commandUsageData?.id))
      .catch(async (error: Error) => {
        Logger.error(error);
        await updateCommandFailure(commandUsageData?.id, error);
        interaction.reply({
          content: 'There was an error while executing this command!',
          ephemeral: true,
          allowedMentions: {},
        });
      });
  });
});

syncCommands(commands);
startDiscordClient();
