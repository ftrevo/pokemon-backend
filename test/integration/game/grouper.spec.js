const create = require('./create.spec');
const join = require('./join.spec');

const test = () => {
  describe('Game', () => {
    create();
    join();
  });
};

module.exports = test;
