const Joi = require('@hapi/joi');

const userKeys = require('../user/keys');
const { idRegex, tokenRegex } = require('../../helpers/utils');

const keys = {
  id: Joi.string().trim().regex(idRegex).label('id'),
  userIds: Joi.array().items(userKeys.id.label('id do jogador')),
  userDetails: Joi.array().items(
    Joi.object().keys({
      _id: userKeys.id.label('id do jogador').required(),
      name: userKeys.name.required(),
    }),
  ),
  winner: userKeys.id.label('id do ganhador'),
  winnerDetails: Joi.object().keys({
    _id: userKeys.id.label('id do ganhador').required(),
    name: userKeys.name.required(),
  }),
  maker: userKeys.id.label('id do criador'),
  makerDetails: Joi.object().keys({
    _id: userKeys.id.label('id do criador').required(),
    name: userKeys.name.required(),
  }),
  token: Joi.string().trim().regex(tokenRegex).label('token'),
  createdAt: Joi.date().iso().label('criado em'),
  updatedAt: Joi.date().iso().label('atualizado em'),
};

module.exports = keys;
