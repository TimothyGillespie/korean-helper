import { CommandInteraction } from 'discord.js';
import { db } from './db';
import { Logger } from '../logging/logger';

export const createCommandUsage = async (interaction: CommandInteraction) => {
  try {
    return db.commandUsage.create({
      data: {
        command: interaction.commandName,
        commandId: interaction.commandId,
        options: JSON.stringify(interaction.options.data),
        userId: interaction.user.id,
        guildId: interaction.guildId,
        channelId: interaction.channelId,
      },
    });
  } catch (error) {
    Logger.error('An error occurred while storing the command usage', error);
  }

  return null;
};

export const updateCommandUsageSuccess = async (id?: number | null) => {
  if (!id) {
    Logger.warning('No command usage ID provided for updating the command usage success.');
    return;
  }
  try {
    return db.commandUsage.update({
      where: {
        id,
      },
      data: {
        success: true,
      },
    });
  } catch (error) {
    Logger.error('An error occurred while updating the command usage', error);
  }
};

export const updateCommandFailure = async (id?: number | null, error?: Error) => {
  if (!id) {
    Logger.warning('No command usage ID provided for updating the command usage success.');
    return;
  }
  try {
    return db.commandUsage.update({
      where: {
        id,
      },
      data: {
        success: false,
        errorMessage: error?.message,
      },
    });
  } catch (error) {
    Logger.error('An error occurred while updating the command usage', error);
  }
};
