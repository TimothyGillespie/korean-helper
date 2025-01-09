import { getEnvAsRequiredBoolean, getEnvAsRequiredDiscordToken } from './config-env-retrieval';

export const DEBUG = getEnvAsRequiredBoolean('DEBUG', false, false);
export const DISCORD_TOKEN = getEnvAsRequiredDiscordToken('DISCORD_TOKEN');

// The first part of the Discord bot token is the client ID encoded as base64
export const DISCORD_CLIENT_ID = Buffer.from(DISCORD_TOKEN.split('.')[0]!, 'base64').toString('utf-8');
