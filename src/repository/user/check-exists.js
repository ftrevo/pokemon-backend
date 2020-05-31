/**
 * @param {Object} data Dados a serem verificados.
 * @param {import('../../models/user')} model UserSchema object.
 * @returns {Boolean}
 */
const checkExists = async (data, model) => {
  const exists = await model.exists(data);

  return exists;
};

module.exports = checkExists;
