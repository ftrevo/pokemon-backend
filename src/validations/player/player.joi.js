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

const playerDetailsOut = Joi.object({
  _id: keys.id.required(),
  starterPokemon: keys.starterPokemon.required(),
  game: keys.game.required(),
  user: keys.user.required(),
  pokemons: keys.pokemons.required(),
}).meta({
  className: 'player-details-out',
});

const captureParams = Joi.object().required().keys({
  _id: keys.id.required().meta({ className: 'capture-patch-params-id' }),
}).meta({
  className: 'capture-patch-params',
});

const releaseParams = Joi.object().required().keys({
  _id: keys.id.required().meta({ className: 'release-delete-params-id' }),
  number: keys.pokemon.required().meta({ className: 'release-delete-params-number' }),
}).meta({
  className: 'release-delete-params',
});

module.exports = {
  setupBody,
  setupOut,
  captureBody,
  captureParams,
  playerDetailsOut,
  releaseParams,
};
