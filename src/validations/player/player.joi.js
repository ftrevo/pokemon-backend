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


module.exports = {
  setupBody,
  setupOut,
};
