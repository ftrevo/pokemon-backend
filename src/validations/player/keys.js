const Joi = require('@hapi/joi');
const userKeys = require('../user/keys');
const gameKeys = require('../game/keys');
const { idRegex } = require('../../helpers/utils');
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
  starterPokemon: Joi.number().min(1).max(151).label('pokémon inicial'),
  starterChanged: Joi.boolean().label('pokémon inicial alterado'),
  pokemons: Joi.object().keys({
    active: Joi.array().items(Joi.number()).max(6).label('lista de pokémons ativos'),
    bag: Joi.array().items(Joi.number()).max(4).label('lista de pokémons reservas'),
  }).label('pokémons'),
  pokemonsStart: Joi.object().keys({
    active: Joi.array().length(1).items(Joi.number()).required()
      .label('lista de pokémons ativos'),
    bag: Joi.array().length(0).items(Joi.number()).required()
      .label('lista de pokémons reservas'),
  }).label('pokémons'),
};

module.exports = keys;
