const Joi = require('@hapi/joi');

const keys = require('./keys');

const setupBody = Joi.object().required().keys({
  starterPokemon: keys.starterPokemon.required(),
  game: keys.game.required(),
}).meta({
  className: 'set-up-post-body',
});

const setupOut = Joi.object().required().keys({
  _id: keys.id.required(),
  starterPokemon: keys.starterPokemon.required(),
  game: keys.gameDetailStart.required(),
  user: keys.user.required(),
  pokemons: keys.pokemonsStart.required(),
}).meta({
  className: 'set-up-post-out',
});

const captureBody = Joi.object().required().keys({
  pokemon: keys.pokemon.required(),
}).meta({
  className: 'capture-patch-body',
});

const captureOut = Joi.object({
  _id: keys.id.required(),
  starterPokemon: keys.starterPokemon.required(),
  game: keys.game.required(),
  user: keys.user.required(),
  pokemons: keys.pokemons.required(),
}).meta({
  className: 'capture-patch-out',
});

const captureParams = Joi.object().required().keys({
  _id: keys.id.required().meta({ className: 'capture-patch-params-id' }),
}).meta({
  className: 'capture-patch-params',
});

module.exports = {
  setupBody,
  setupOut,
  captureBody,
  captureParams,
  captureOut,
};
