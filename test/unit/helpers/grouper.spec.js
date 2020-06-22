const slack = require('./slack-notifications.spec');

const runTests = () => {
  describe('Helpers', () => {
    slack();
  });
};

module.exports = runTests;
