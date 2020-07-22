const utils = require('../helpers/utils');
const { RouteNotFound, ValidationNotFound } = require('../domains/errors/exceptions');

const {
  signUpBody, signUpOut, signInBody, signInOut,
} = require('./user/user.joi');
const {
  createOut, joinOut, joinBody,
} = require('./game/game.joi');
const {
  setupBody, setupOut, captureBody, captureOut, captureParams,
} = require('./player/player.joi');

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
    patch: {
      body: joinBody,
      out: joinOut,
    },
  },
  '/player': {
    post: {
      body: setupBody,
      out: setupOut,
    },
  },
  '/player/{id}/capture': {
    patch: {
      body: captureBody,
      params: captureParams,
      out: captureOut,
    },
  },
};

const getRule = (path, method) => {
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
