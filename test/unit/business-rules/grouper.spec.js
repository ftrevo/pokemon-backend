const game = require('./game/grouper.spec');
const user = require('./user/grouper.spec');
const utils = require('./utils/grouper.spec');

const runTests = () => {
  describe('Business Rules', () => {
    game();
    user();
    utils();
  });
};

module.exports = runTests;
