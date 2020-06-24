const exceptions = require('./exceptions.spec');
const httpException = require('./httpException.spec');

const runTests = () => {
  describe('Errors', () => {
    exceptions();
    httpException();
  });
};

module.exports = runTests;
