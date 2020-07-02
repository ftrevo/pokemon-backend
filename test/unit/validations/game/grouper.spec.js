const create = require('./create.spec');
const join = require('./join.spec');

const runTests = () => {
  describe('Game', () => {
    create();
    join();
  });
};

module.exports = runTests;
