const got = require('got');

const logger = require('./logger');

const options = {
  method: 'POST',
  encoding: 'utf8',
  headers: {
    'Content-Type': 'application/json',
  },
};

/**
 * @param {Object} data message that will be send to Slack
 */
const notify = async (data) => {
  const text = `REQUEST-ID:${data.requestId}, MESSAGE:${data.errorMessage}, ERROR-TIME:${data.errorTime}, INBOUND-TIME:${data.inboundTime}`;

  try {
    await got(
      process.env.SLACK_HOOK_URL,
      {
        ...options,
        body: JSON.stringify({ text }),
      },
    );
  } catch (error) {
    logger.error({ message: 'Could not post data to SLACK', text, ...data });
  }
};

module.exports = notify;
