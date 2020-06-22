const serverStatus = require('./server-status.spec');

const runTests = () => {
  describe('Utils', () => {
    serverStatus();
  });
};

module.exports = runTests;
