const game = require('./game.spec');
const user = require('./user.spec');

const runTests = () => {
  describe('Validations', () => {
    game();
    user();
  });
};

module.exports = runTests;
