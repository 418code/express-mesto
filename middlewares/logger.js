const winston = require('winston');
const expressWinston = require('express-winston');

// avoid logging cookies
function customRequestFilter(req, propName) {
  if (propName !== 'headers') return req[propName];

  const { cookie, ...rest } = req.headers;

  return rest;
}

const requestLogger = expressWinston.logger({
  exitOnError: false,
  transports: [
    new winston.transports.File({ filename: 'logs/request.log' }),
  ],
  requestFilter: customRequestFilter,
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.json(),
  ),
});

const errorLogger = expressWinston.errorLogger({
  exitOnError: false,
  transports: [
    new winston.transports.File({ filename: 'logs/error.log' }),
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
