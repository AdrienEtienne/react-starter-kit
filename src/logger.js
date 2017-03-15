import winston from 'winston';
import {
  LOGGER_CONSOLE,
  LOGGER_FILE,
  LOGGER_FILE_NAME,
  LOGGER_LEVEL,
 } from './config';

const transports = [];

if (LOGGER_CONSOLE) transports.push(new (winston.transports.Console)());
if (LOGGER_FILE) {
  transports.push(new (winston.transports.File)({ name: 'log-file', filename: `${LOGGER_FILE_NAME}.log` }));
  transports.push(new (winston.transports.File)({ name: 'error-file', filename: `${LOGGER_FILE_NAME}-error.log`, level: 'error' }));
}

const logger = new winston.Logger({
  level: LOGGER_LEVEL,
  transports,
});

logger.info(`Logger config : level ${LOGGER_LEVEL}, console ${LOGGER_CONSOLE}, file ${LOGGER_FILE}`);

export default logger;
