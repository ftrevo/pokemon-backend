const Joi = require('@hapi/joi');

const { idRegex } = require('../../helpers/utils');

const keys = {
  id: Joi.string().trim().regex(idRegex).label('id'),
  name: Joi.string().trim().label('nome'),
  password: Joi.string().trim().min(4).label('senha'),
  email: Joi.string().trim().label('e-mail'),
  deviceToken: Joi.string().trim().label('token do device'),
  createdAt: Joi.date().iso().label('criado em'),
  updatedAt: Joi.date().iso().label('atualizado em'),
  token: Joi.object({
    type: Joi.string().trim().required().label('tipo do token'),
    value: Joi.string().trim().required().label('valor do token'),
  }).label('token'),
};

module.exports = keys;
