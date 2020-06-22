const signIn = require('./sign-in.spec');
const signUp = require('./sign-up.spec');

const runTests = () => {
  describe('User', () => {
    signIn();
    signUp();
  });
};

module.exports = runTests;
