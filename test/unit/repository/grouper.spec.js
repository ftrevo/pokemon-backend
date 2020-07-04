const game = require('./game.spec');
const user = require('./user.spec');
const base = require('./base-repository.spec');

const runTests = () => {
  describe('Validations', () => {
    base();
    game();
    user();
  });
};

module.exports = runTests;
