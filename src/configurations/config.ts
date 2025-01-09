import { getEnvAsRequiredBoolean, getEnvAsRequiredDiscordToken, getEnvAsRequiredString } from './config-env-retrieval';

export const DEBUG = getEnvAsRequiredBoolean('DEBUG', false, false);
export const DISCORD_TOKEN = getEnvAsRequiredDiscordToken('DISCORD_TOKEN');
export const KRDICT_API_KEY = getEnvAsRequiredString('KRDICT_API_KEY', true);
export const OPENAI_API_KEY = getEnvAsRequiredString('OPENAI_API_KEY', true);

export const QUESTION_CHANNEL_ID = getEnvAsRequiredString('QUESTION_CHANNEL_ID', true);

// The first part of the Discord bot token is the client ID encoded as base64
export const DISCORD_CLIENT_ID = Buffer.from(DISCORD_TOKEN.split('.')[0]!, 'base64').toString('utf-8');
