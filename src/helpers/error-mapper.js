const { getDefaultResData } = require('./utils');
const slackNotification = require('./slack-notification');
const logger = require('./logger');

const getMessage = (error) => {
  if (Array.isArray(error.message)) {
    return error.message;
  }

  if (error.name === 'ValidationError' && Array.isArray(error.details)) {
    return error.details.map((detail) => detail.message);
  }

  return [error.message];
};

// eslint-disable-next-line no-unused-vars
const handleErrors = async (error, request, response, next) => {
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
    logger.debug({ ...errorData, error });
  } else {
    logger.error({ ...errorData, error });
    await slackNotification(errorData);
  }

  return response
    .status(error.statusCode || 500)
    .send({ message, ...getDefaultResData(response.locals) });
};

module.exports = handleErrors;
