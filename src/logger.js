import winston from 'winston';
import { logger as config } from './config';

const transports = [];

if (config.console) transports.push(new (winston.transports.Console)());

const logger = new winston.Logger({
  level: config.level,
  transports,
});

export default logger;
