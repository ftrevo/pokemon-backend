const user = require('./user/grouper.spec');
const utils = require('./utils/grouper.spec');

const runTests = () => {
  describe('Business Rules', () => {
    user();
    utils();
  });
};

module.exports = runTests;
