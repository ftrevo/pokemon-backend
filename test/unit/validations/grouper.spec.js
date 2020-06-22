const rule = require('./rule.spec');
const user = require('./user/grouper.spec');

const runTests = () => {
  describe('Validations', () => {
    rule();
    user();
  });
};

module.exports = runTests;
