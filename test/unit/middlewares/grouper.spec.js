const auth = require('./authorization.spec');
const errorMapper = require('./error-mapper.spec');
const reqIdDate = require('./req-id-date.spec');

const runTests = () => {
  describe('Middlewares', () => {
    auth();
    errorMapper();
    reqIdDate();
  });
};

module.exports = runTests;
