import { Logger } from '../logging/logger';

type Converter<T> = (value: string) => T;

const stringConverter: Converter<string> = (value: string): string => value;

const integerConverter: Converter<number> = (value: string): number => {
  const num = Number(value);
  if (isNaN(num)) {
    throw new Error(`Cannot convert value to number: ${value}`);
  }

  if (!Number.isInteger(num)) {
    throw new Error(`Cannot convert value to integer: ${value}`);
  }

  return num;
};

const booleanConverter: Converter<boolean> = (value: string): boolean => {
  if (value === 'true' || value === '1') {
    return true;
  } else if (value === 'false' || value === '0') {
    return false;
  } else {
    throw new Error(`Cannot convert value to boolean: ${value}`);
  }
};

const listStringConverter: Converter<string[]> = (value: string): string[] => value.split(',');

const listIntegerConverter: Converter<number[]> = (value: string): number[] => {
  return value.split(',').map(integerConverter);
};

const discordTokenConverter: Converter<string> = (value: string): string => {
  const dotsFound = value.match(/\./g);
  if (dotsFound?.length !== 2) {
    Logger.debug('Number of dots found in the token:', dotsFound?.length);
    throw new Error(`Invalid Discord token: ${value}`);
  }
  return value;
};

const getEnv = <T>(
  key: string,
  secret: boolean,
  defaultValue: T | null | undefined,
  isRequired: boolean,
  convert: Converter<T>,
): T | null => {
  const value = process.env[key] || null;
  if (!value) {
    if (defaultValue != null) {
      if (secret) {
        Logger.info(`Environment variable ${key} is not provided, using default value.`);
      } else {
        Logger.info(`Environment variable ${key} is not provided, using default value: ${defaultValue}`);
      }
      return defaultValue;
    } else {
      if (isRequired) {
        throw new Error(`Environment variable ${key} is not provided, but required!`);
      } else {
        Logger.info(`Environment variable ${key} is not provided.`);
        return null;
      }
    }
  } else {
    if (secret) {
      Logger.info(`Environment variable ${key} is provided.`);
    } else {
      Logger.info(`Environment variable ${key}: ${value}`);
    }
  }

  return convert(value);
};

export const getEnvAsRequiredString = (key: string, secret: boolean, defaultValue?: string): string => {
  return getEnv(key, secret, defaultValue, true, stringConverter) as string;
};

export const getEnvAsOptionalString = (key: string, secret: boolean, defaultValue?: string): string | null => {
  return getEnv(key, secret, defaultValue, false, stringConverter);
};

export const getEnvAsRequiredNumber = (key: string, secret: boolean, defaultValue?: number): number => {
  return getEnv(key, secret, defaultValue, true, integerConverter) as number;
};

export const getEnvAsOptionalNumber = (key: string, secret: boolean, defaultValue?: number | null): number | null => {
  return getEnv(key, secret, defaultValue, false, integerConverter);
};

export const getEnvAsRequiredStringList = (key: string, secret: boolean, defaultValue?: string[]): string[] => {
  return getEnv(key, secret, defaultValue, true, listStringConverter) as string[];
};

export const getEnvAsOptionalStringList = (key: string, secret: boolean, defaultValue?: string[] | null): string[] | null => {
  return getEnv(key, secret, defaultValue, false, listStringConverter);
};

export const getEnvAsRequiredNumberList = (key: string, secret: boolean, defaultValue?: number[]): number[] => {
  return getEnv(key, secret, defaultValue, true, listIntegerConverter) as number[];
};

export const getEnvAsOptionalNumberList = (key: string, secret: boolean, defaultValue?: number[] | null): number[] | null => {
  return getEnv(key, secret, defaultValue, false, listIntegerConverter);
};

export const getEnvAsRequiredBoolean = (key: string, secret: boolean, defaultValue?: boolean): boolean => {
  return getEnv(key, false, defaultValue, true, booleanConverter) as boolean;
};

export const getEnvAsRequiredDiscordToken = (key: string, defaultValue?: string): string => {
  return getEnv(key, true, defaultValue, true, discordTokenConverter) as string;
};
