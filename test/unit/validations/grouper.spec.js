const game = require('./game/grouper.spec');
const user = require('./user/grouper.spec');
const player = require('./player/grouper.spec');
const rule = require('./rule.spec');


const runTests = () => {
  describe('Validations', () => {
    game();
    player();
    user();
    rule();
  });
};

module.exports = runTests;
