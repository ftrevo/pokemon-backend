const errors = require('./errors/grouper.spec');

const runTests = () => {
  describe('Domains', () => {
    errors();
  });
};

module.exports = runTests;
