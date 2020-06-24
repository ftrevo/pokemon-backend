const create = require('./create.spec');

const runTests = () => {
  describe('Game', () => {
    create();
  });
};

module.exports = runTests;
