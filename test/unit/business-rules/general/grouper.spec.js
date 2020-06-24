const serverStatus = require('./server-status.spec');

const runTests = () => {
  describe('General', () => {
    serverStatus();
  });
};

module.exports = runTests;
