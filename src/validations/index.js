const {
  signUpBody,
  signUpOut,
  signInBody,
  signInOut,
} = require('./user/user.joi');
const { statusOut } = require('./utils/status.joi');

const validations = {
  '/': {
    get: {
      out: statusOut,
    },
  },
  '/user/sign-up': {
    post: {
      body: signUpBody,
      out: signUpOut,
    },
  },
  '/user/sign-in': {
    post: {
      body: signInBody,
      out: signInOut,
    },
  },
};

module.exports = validations;
