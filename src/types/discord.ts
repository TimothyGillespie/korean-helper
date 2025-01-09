import { ChatInputCommandInteraction, SharedSlashCommand } from 'discord.js';

export type DiscordRoleWhiteListPermission = {
  type: 'role-whitelist';
  roleWhiteList: string[];
};

export type DiscordRoleBlackListPermission = {
  type: 'role-blacklist';
  roleBlackList: string[];
};

export type DiscordCommandPermission = DiscordRoleWhiteListPermission | DiscordRoleBlackListPermission;

export type DiscordCommand = {
  data: SharedSlashCommand;
  execute(interaction: ChatInputCommandInteraction): Promise<any | void>;
  permissions?: DiscordCommandPermission;
};
