/**
 * @param {Object} data Dados a serem comparados.
 * @param {Object} projectionFields Dados a serem retornados.
 * @param {import('../../models/user')} model UserSchema object.
 * @returns {Object} Usuário encontrado.
 */
const findOne = async (data, projectionFields, model) => {
  const user = await model.findOne(data, projectionFields);

  return user;
};

module.exports = findOne;
