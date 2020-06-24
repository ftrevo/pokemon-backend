const Joi = require('@hapi/joi');

const { idRegex, tokenRegex } = require('../../helpers/utils');

const keys = {
  id: Joi.string().trim().regex(idRegex).label('id'),
  playerIds: Joi.array().items(Joi.string().trim().regex(idRegex).label('id do jogador')),
  playerDetails: Joi.array().items(
    Joi.object().keys({
      _id: Joi.string().trim().regex(idRegex).label('id do jogador')
        .required(),
      name: Joi.string().trim().label('nome')
        .required(),
    }),
  ),
  winner: Joi.string().trim().regex(idRegex).label('id do ganhador'),
  maker: Joi.string().trim().regex(idRegex).label('id do criador'),
  token: Joi.string().trim().regex(tokenRegex).label('token'),
  createdAt: Joi.date().iso().label('criado em'),
  updatedAt: Joi.date().iso().label('atualizado em'),
};

module.exports = keys;
