const errorMapper = require('./error-mapper.spec');
const slack = require('./slack-notifications.spec');

const runTests = () => {
  describe('Helpers', () => {
    errorMapper();
    slack();
  });
};

module.exports = runTests;
