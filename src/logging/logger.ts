import * as winston from 'winston';
import { DEBUG } from '../configurations/config';

export const LoggingLevels = {
  EMERGENCY: 'emerg',
  ALERT: 'alert',
  CRITICAL: 'crit',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
  DEBUG: 'debug',
};

const customFormatCLI = winston.format.combine(
  winston.format.colorize({ all: true }),
  winston.format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss.SSS',
  }),
  winston.format.align(),
  winston.format.printf((info) => `[${info.timestamp}] ${info.level}: ${info.message}`),
);

export const Logger = winston.createLogger({
  levels: winston.config.syslog.levels,
  transports: [
    new winston.transports.File({
      filename: 'application.log',
      level: LoggingLevels.INFO,
      format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
    }),
    new winston.transports.Console({
      format: customFormatCLI,
      level: LoggingLevels.DEBUG,
    }),
  ],
  // Removal of non-defined functions via Omit
}) as Omit<winston.Logger, 'warn'>;
