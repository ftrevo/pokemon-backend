const capture = require('./capture.spec');
const setUp = require('./set-up.spec');
const release = require('./release.spec');

const test = () => {
  describe('Player', () => {
    capture();
    setUp();
    release();
  });
};

module.exports = test;
