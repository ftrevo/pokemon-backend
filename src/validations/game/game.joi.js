const Joi = require('@hapi/joi');

const keys = require('./keys');
const playerKeys = require('../player/keys');

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

const setupBody = Joi.object().required().keys({
  pokemon: playerKeys.starterPokemon.required(),
}).meta({
  className: 'set-up-post-body',
});

const setupParams = Joi.object().required().keys({
  id: keys.id.required().meta('set-up-post-params-id'),
});

const setupOut = Joi.object().required().keys({
  _id: playerKeys.id.required(),
  starterPokemon: playerKeys.starterPokemon.required(),
  game: keys.id.required(),
  user: playerKeys.user.required(),
  pokemons: playerKeys.pokemons.required(),
}).meta({
  className: 'set-up-post-out',
});


module.exports = {
  createOut,
  joinOut,
  joinBody,
  setupBody,
  setupParams,
  setupOut,
};
