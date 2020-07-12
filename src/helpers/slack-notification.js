const gotLib = require('got');
const loggerLib = require('./logger');

const options = {
  method: 'POST',
  encoding: 'utf8',
  headers: {
    'Content-Type': 'application/json',
  },
};

module.exports = class SlackNotifier {
  /**
   * @param {import('got')} got lib que faz a request externa
   * @param {import('./logger')} logger
   */
  constructor(got = gotLib, logger = loggerLib) {
    this.got = got;
    this.logger = logger;
  }

  /**
   * @param {Object} data message that will be send to Slack
   */
  async notify(data) {
    if (process.env.ENABLE_SLACK !== 'true') {
      return;
    }

    const text = `REQUEST-ID:${data.requestId}, MESSAGE:${data.errorMessage}, ERROR-TIME:${data.errorTime}, INBOUND-TIME:${data.inboundTime}`;

    try {
      await this.got(
        process.env.SLACK_HOOK_URL,
        {
          ...options,
          body: JSON.stringify({ text }),
        },
      );
    } catch (error) {
      this.logger.error({
        message: 'Could not post data to SLACK',
        text,
        slackError: error,
        ...data,
      });
    }
  }
};
