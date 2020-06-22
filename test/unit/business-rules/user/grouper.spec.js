const exists = require('./exists.spec');
const get = require('./get.spec');
const sign = require('./sign.spec');

const runTests = () => {
  describe('User', () => {
    exists();
    get();
    sign();
  });
};

module.exports = runTests;
