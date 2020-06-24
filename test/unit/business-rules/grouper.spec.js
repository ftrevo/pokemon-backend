const game = require('./game/grouper.spec');
const user = require('./user/grouper.spec');
const general = require('./general/grouper.spec');

const runTests = () => {
  describe('Business Rules', () => {
    game();
    general();
    user();
  });
};

module.exports = runTests;
