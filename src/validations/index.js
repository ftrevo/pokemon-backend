const utils = require('../helpers/utils');
const { RouteNotFound, ValidationNotFound } = require('../domains/errors/exceptions');

const {
  signUpBody, signUpOut, signInBody, signInOut,
} = require('./user/user.joi');
const { createOut } = require('./game/game.joi');

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
  '/game': {
    post: {
      out: createOut,
    },
  },
};

const getRule = (path, method) => {
  if (utils.isSwaggerRoute(path)) {
    return;
  }
  const routePath = utils.getReplacedRouteString(path);
  const lowerMethod = method.toLowerCase();

  if (!validations[routePath] || !validations[routePath][lowerMethod]) {
    throw new RouteNotFound('Rota não encontrada');
  }

  const foundValidation = validations[routePath][lowerMethod];

  if (!foundValidation.out) {
    throw new ValidationNotFound('Validação do payload de saída não encontrado');
  }

  // eslint-disable-next-line consistent-return
  return foundValidation;
};

module.exports = {
  validations,
  getRule,
};
