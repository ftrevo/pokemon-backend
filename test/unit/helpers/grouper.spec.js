const slack = require('./slack-notifications.spec');
const validator = require('./validator.spec');

const runTests = () => {
  describe('Helpers', () => {
    slack();
    validator();
  });
};

module.exports = runTests;
