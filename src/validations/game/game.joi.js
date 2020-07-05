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
  users: keys.userDetails.required(),
  token: keys.token.required(),
  createdAt: keys.createdAt.required(),
}).meta({
  className: 'game-patch-out',
});

const joinBody = Joi.object().required().keys({
  token: keys.token.required(),
}).meta({
  className: 'game-patch-body',
});

module.exports = {
  createOut,
  joinOut,
  joinBody,
};
