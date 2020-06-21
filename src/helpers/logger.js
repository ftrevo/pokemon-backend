const winston = require('winston');
const Logsene = require('winston-logsene');

const transform = (toBeFormatted) => {
  if (typeof toBeFormatted.message === 'string') {
    return toBeFormatted;
  }
  return { ...toBeFormatted.message, message: toBeFormatted.message.errorMessage };
};

const logger = winston.createLogger({
  levels: winston.config.npm.levels,
  transports: [
    new winston.transports.Console({
      colorize: true,
      handleExceptions: true,
      level: process.env.LOG_CONSOLE_LEVEL,
      prettyPrint: true,
      silent: false,
    }),
  ],
  silent: process.env.LOG_SILENT === 'true',
});

if (process.env.ENABLE_SEMATEXT === 'true') {
  logger.add(new Logsene({
    token: process.env.LOG_SEMATEXT_KEY,
    url: process.env.LOG_SEMATEX_URL,
    format: { transform },
    json: true,
    level: process.env.LOG_EXTERNAL_LEVEL,
  }));
}

module.exports = logger;
