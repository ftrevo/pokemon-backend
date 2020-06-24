const { getDefaultResData } = require('./utils');
const SlackNotifier = require('./slack-notification');
const defaultLogger = require('./logger');

const getMessage = (error) => {
  if (Array.isArray(error.message)) {
    return error.message;
  }

  if (error.name === 'ValidationError' && Array.isArray(error.details)) {
    return error.details.map((detail) => detail.message);
  }

  return [error.message];
};

module.exports = class ErrorMapper {
  constructor(slack = new SlackNotifier(), logger = defaultLogger) {
    this.slack = slack;
    this.logger = logger;
    this.handleErrors = this.handleErrors.bind(this);
  }

  // eslint-disable-next-line no-unused-vars
  async handleErrors(error, request, response, next) {
    const errorTime = new Date();
    const { requestId, inboundTime } = response.locals;

    const message = getMessage(error);

    const errorData = {
      requestId,
      errorMessage: message.reduce((msg, acc) => `${msg}-${acc}`),
      errorTime: errorTime.toISOString(),
      inboundTime: inboundTime.toISOString(),
    };

    if (error.isBusiness) {
      this.logger.debug({ ...errorData, error });
    } else {
      this.logger.error({ ...errorData, error });
      await this.slack.notify(errorData);
    }

    return response
      .status(error.statusCode || 500)
      .send({ message, ...getDefaultResData(response.locals) });
  }
};
