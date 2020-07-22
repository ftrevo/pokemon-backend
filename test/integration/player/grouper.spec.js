const capture = require('./capture.spec');
const setUp = require('./set-up.spec');

const test = () => {
  describe('Player', () => {
    capture();
    setUp();
  });
};

module.exports = test;
