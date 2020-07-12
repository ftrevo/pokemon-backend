const game = require('./game.spec');
const player = require('./player.spec');
const user = require('./user.spec');

const runTests = () => {
  describe('Models', () => {
    game();
    player();
    user();
  });
};

module.exports = runTests;
