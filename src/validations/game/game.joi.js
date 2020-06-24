const Joi = require('@hapi/joi');

const keys = require('./keys');

const createOut = Joi.object().required().keys({
  _id: keys.id.required(),
  token: keys.token.required(),
  createdAt: keys.createdAt.required(),
}).meta({
  className: 'game-post-out',
});

module.exports = {
  createOut,
};
