const setUp = require('./set-up.spec');

const runTests = () => {
  describe('Player', () => {
    setUp();
  });
};

module.exports = runTests;
