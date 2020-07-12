const base = require('./base-repository.spec');
const game = require('./game.spec');
const player = require('./player.spec');
const user = require('./user.spec');

const runTests = () => {
  describe('Validations', () => {
    base();
    game();
    player();
    user();
  });
};

module.exports = runTests;
