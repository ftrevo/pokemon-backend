const game = require('./game/grouper.spec');
const general = require('./general/grouper.spec');
const player = require('./player/grouper.spec');
const user = require('./user/grouper.spec');

const runTests = () => {
  describe('Business Rules', () => {
    game();
    general();
    player();
    user();
  });
};

module.exports = runTests;
