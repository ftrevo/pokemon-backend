const Joi = require('@hapi/joi');

const { idRegex } = require('../../helpers/utils');
// TODO juntar em um único arquivo de chaves
const keys = {
  id: Joi.string().trim().regex(idRegex).label('id'),



  // user: {
  //   type: ObjectId,
  //   ref: 'User',
  // },
  // game: {
  //   type: ObjectId,
  //   ref: 'Game',
  // },
  // pokemons: {
  //   active: [Number],
  //   bag: [Number],
  // },
  // starter: Number,
};

module.exports = keys;
