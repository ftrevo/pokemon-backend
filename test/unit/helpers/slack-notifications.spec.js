const expect = require('expect');
const SlackNotifier = require('../../../src/helpers/slack-notification');

const getGotMock = (shouldThrow, stash) => {
  if (shouldThrow) {
    return (url, data) => {
      stash.push('error on got');
      stash.push(data);
      throw new Error('Error on GOT when sending data to Slack');
    };
  }

  return (url, data) => {
    stash.push('success on got');
    stash.push(data);
  };
};

const getLoggerMock = (stash) => ({
  error: (data) => {
    stash.push('success on logger');
    stash.push(data);
  },
});

const runTests = () => {
  describe('Slack Notifications', () => {
    before(() => {
      process.env.ENABLE_SLACK = 'true';
    });

    after(() => {
      process.env.ENABLE_SLACK = 'false';
    });

    it('success', async () => {
      const stash = [];
      const gotMock = getGotMock(false, stash);

      const slack = new SlackNotifier(gotMock);

      const mockData = {
        requestId: 1,
        errorMessage: 2,
        errorTime: 3,
        inboundTime: 4,
      };

      slack.notify(mockData);

      expect(stash).toHaveProperty('0', 'success on got');
      expect(stash).toHaveProperty(
        '1',
        {
          method: 'POST',
          encoding: 'utf8',
          headers: { 'Content-Type': 'application/json' },
          body: '{"text":"REQUEST-ID:1, MESSAGE:2, ERROR-TIME:3, INBOUND-TIME:4"}',
        },
      );
    });

    it('error on slack, sent to logger', async () => {
      const stash = [];
      const gotMock = getGotMock(true, stash);
      const loggerMock = getLoggerMock(stash);

      const slack = new SlackNotifier(gotMock, loggerMock);

      const mockData = {
        requestId: 5,
        errorMessage: 6,
        errorTime: 7,
        inboundTime: 8,
      };

      slack.notify(mockData);

      const text = 'REQUEST-ID:5, MESSAGE:6, ERROR-TIME:7, INBOUND-TIME:8';

      const sentToGot = {
        method: 'POST',
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        body: `{"text":"${text}"}`,
      };

      expect(stash).toHaveProperty('0', 'error on got');
      expect(stash).toHaveProperty('1', sentToGot);
      expect(stash).toHaveProperty('2', 'success on logger');
      expect(stash).toHaveProperty('3.message', 'Could not post data to SLACK');
      expect(stash).toHaveProperty('3.text', text);
      expect(stash).toHaveProperty('3.requestId', 5);
      expect(stash).toHaveProperty('3.errorMessage', 6);
      expect(stash).toHaveProperty('3.errorTime', 7);
      expect(stash).toHaveProperty('3.inboundTime', 8);
      expect(stash).toHaveProperty('3.slackError.message', 'Error on GOT when sending data to Slack');
      expect(stash).toHaveProperty('3.slackError.stack');
    });
  });
};

module.exports = runTests;
