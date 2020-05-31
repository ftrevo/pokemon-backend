const UserSchema = require('../../models/user');

const createUser = require('./create');
const existUser = require('./check-exists');
const findOneUser = require('./find-one');

/**
 * @param {Object} data Dados do usuario.
 * @returns {Object} Created user sanitized.
 */
const create = (data) => createUser(data, UserSchema);

/**
 * @param {Object} data Dados da query de existência.
 * @returns {Boolean}
 */
const exists = (data) => existUser(data, UserSchema);

/**
 * @param {Object} data Dados a serem comparados.
 * @param {Object} projectionFields Dados a serem retornados.
 * @returns {Object} Usuário encontrado.
 */
const findOne = (data, projection) => findOneUser(data, projection, UserSchema);

module.exports = {
  create,
  exists,
  findOne,
};
