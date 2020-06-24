const exists = require('./exists.spec');

const runTests = () => {
  describe('Game', () => {
    exists();
  });
};

module.exports = runTests;
