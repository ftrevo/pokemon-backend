const signIn = require('./sign-in.spec');
const signUp = require('./sign-up.spec');

const test = () => {
  describe('User', () => {
    signIn();
    signUp();
  });
};

module.exports = test;
