const game = require('./game/grouper.spec');
const user = require('./user/grouper.spec');
const rule = require('./rule.spec');

const runTests = () => {
  describe('Validations', () => {
    game();
    rule();
    user();
  });
};

module.exports = runTests;
