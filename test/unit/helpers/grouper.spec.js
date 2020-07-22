const slack = require('./slack-notifications.spec');
const validator = require('./validator.spec');
const pokemonUtils = require('./pokemon-utils.spec');

const runTests = () => {
  describe('Helpers', () => {
    pokemonUtils();
    slack();
    validator();
  });
};

module.exports = runTests;
