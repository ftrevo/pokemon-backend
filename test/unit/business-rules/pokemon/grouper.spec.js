const getRelated = require('./get-related.spec');
const checkPrepare = require('./check-prepare.spec');

const runTests = () => {
  describe('Pokemon', () => {
    checkPrepare();
    getRelated();
  });
};

module.exports = runTests;
