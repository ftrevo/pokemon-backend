const capture = require('./capture.spec');
const setUp = require('./set-up.spec');

const runTests = () => {
  describe('Player', () => {
    capture();
    setUp();
  });
};

module.exports = runTests;
