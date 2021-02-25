const capture = require('./capture.spec');
const release = require('./release.spec');
const setUp = require('./set-up.spec');

const runTests = () => {
  describe('Player', () => {
    capture();
    release();
    setUp();
  });
};

module.exports = runTests;
