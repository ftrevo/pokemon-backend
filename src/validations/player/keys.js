const Joi = require('@hapi/joi');
const userKeys = require('../user/keys');
const gameKeys = require('../game/keys');
const { idRegex } = require('../../helpers/utils');

const pokemonSchema = Joi.number().min(1).max(151);
const pokemonList = Joi.array().items(
  Joi.object().keys({
    number: pokemonSchema.label('número do pokémon').required(),
    hasEvolved: Joi.boolean().label('pokémon evoluido').required(),
    isActive: Joi.boolean().label('pokémon ativo').required(),
  }),
).label('lista de pokémons');

// TODO colocar tudo em um só arquivo
const keys = {
  id: Joi.string().trim().regex(idRegex).label('id'),
  createdAt: Joi.date().iso().label('criado em'),
  updatedAt: Joi.date().iso().label('atualizado em'),
  user: userKeys.id.label('id do usuário'),
  userDetail: Joi.object().keys({
    _id: userKeys.id.label('id do usuário').required(),
    name: userKeys.name.required(),
  }),
  game: gameKeys.id.label('id do jogo'),
  gameDetailStart: Joi.object().keys({
    _id: gameKeys.id.label('id do jogo').required(),
    maker: Joi.object().keys({
      _id: userKeys.id.label('id do criador').required(),
      name: userKeys.name.required(),
    }).required().label('criador'),
  }).label('jogo'),
  gameDetailFinish: Joi.object().keys({
    _id: gameKeys.id.label('id do jogo').required(),
    winner: Joi.object().keys({
      _id: userKeys.id.label('id do ganhador').required(),
      name: userKeys.name.required(),
    }).required().label('vencedor'),
  }).label('jogo'),
  starterPokemon: pokemonSchema.label('pokémon inicial'),
  starterChanged: Joi.boolean().label('pokémon inicial alterado'),
  pokemons: pokemonList.max(10),
  pokemonsStart: pokemonList.length(1),
  pokemon: pokemonSchema.label('pokémon'),
};

module.exports = keys;
