const exists = require('./exists.spec');

const runTests = () => {
  describe('Player', () => {
    exists();
  });
};

module.exports = runTests;
