const winston = require('winston');
const Logsene = require('winston-logsene');
const { Loggly } = require('winston-loggly-bulk');

const transform = (toBeFormatted) => {
  if (typeof toBeFormatted.message === 'string') {
    return toBeFormatted;
  }
  return { ...toBeFormatted.message, message: toBeFormatted.message.errorMessage };
};

const logger = winston.createLogger({
  levels: winston.config.npm.levels,
  transports: [],
  silent: process.env.LOG_SILENT === 'true',
});

if (process.env.LOG_CONSOLE === 'true') {
  const logTransport = new winston.transports.Console({
    colorize: true,
    handleExceptions: true,
    level: process.env.LOG_CONSOLE_LEVEL,
    prettyPrint: true,
    silent: false,
  });

  if (!logger.transports.includes(logTransport)) {
    logger.add(logTransport);
  }
}

if (process.env.ENABLE_LOGGLY === 'true') {
  const logglyTransport = new Loggly({
    token: process.env.LOGS_LOGGLY_KEY,
    subdomain: process.env.LOGS_LOGGLY_SUBDOMAIN,
    json: true,
    format: { transform },
    level: process.env.LOG_EXTERNAL_LEVEL,
  });

  if (!logger.transports.includes(logglyTransport)) {
    logger.add(logglyTransport);
  }
}

if (process.env.ENABLE_SEMATEXT === 'true') {
  const logseneTransport = new Logsene({
    token: process.env.LOG_SEMATEXT_KEY,
    url: process.env.LOG_SEMATEX_URL,
    format: { transform },
    json: true,
    level: process.env.LOG_EXTERNAL_LEVEL,
  });

  if (!logger.transports.includes(logseneTransport)) {
    logger.add(logseneTransport);
  }
}

module.exports = logger;
