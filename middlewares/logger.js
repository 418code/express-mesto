const winston = require('winston');
require('winston-daily-rotate-file');
const expressWinston = require('express-winston');

const requestLogger = expressWinston.logger({
  exitOnError: false,
  transports: [
    new winston.transports.DailyRotateFile({
      dirname: 'logs',
      filename: 'request-%DATE%.log',
      datePattern: 'YYYY-MM-DD-HH',
      zippedArchive: true,
      maxSize: '16m',
      maxFiles: '64',
    }),
  ],
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.json(),
  ),
});

const errorLogger = expressWinston.errorLogger({
  exitOnError: false,
  transports: [
    new winston.transports.DailyRotateFile({
      dirname: 'logs',
      filename: 'error-%DATE%.log',
      datePattern: 'YYYY-MM-DD-HH',
      zippedArchive: true,
      maxSize: '16m',
      maxFiles: '64',
    }),
  ],
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.json(),
  ),
});

module.exports = {
  requestLogger,
  errorLogger,
};
