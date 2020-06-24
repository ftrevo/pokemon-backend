const create = require('./create.spec');

const test = () => {
  describe('Game', () => {
    create();
  });
};

module.exports = test;
