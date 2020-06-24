const game = require('./game.spec');

const runTests = () => {
  describe('Models', () => {
    game();
  });
};

module.exports = runTests;
