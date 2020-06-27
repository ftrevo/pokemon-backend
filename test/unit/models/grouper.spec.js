const game = require('./game.spec');
const user = require('./user.spec');

const runTests = () => {
  describe('Models', () => {
    game();
    user();
  });
};

module.exports = runTests;
