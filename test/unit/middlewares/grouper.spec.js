const auth = require('./authorization.spec');
const reqIdDate = require('./req-id-date.spec');

const runTests = () => {
  describe('Middlewares', () => {
    auth();
    reqIdDate();
  });
};

module.exports = runTests;
