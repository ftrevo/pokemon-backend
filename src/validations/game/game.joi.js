const Joi = require('@hapi/joi');

const keys = require('./keys');

const createOut = Joi.object().required().keys({
  _id: keys.id.required(),
  token: keys.token.required(),
  createdAt: keys.createdAt.required(),
}).meta({
  className: 'game-post-out',
});

const joinOut = Joi.object().required().keys({
  _id: keys.id.required(),
  maker: keys.makerDetails.required(),
  players: keys.playerDetails.required(),
  token: keys.token.required(),
  createdAt: keys.createdAt.required(),
}).meta({
  className: 'game-patch-out',
});

const joinParams = Joi.object().required().keys({
  token: keys.token.required(),
}).meta({
  className: 'game-patch-params',
});

module.exports = {
  createOut,
  joinOut,
  joinParams,
};
