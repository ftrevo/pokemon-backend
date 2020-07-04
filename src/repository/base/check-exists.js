/**
 * @param {Object} data Dados a serem usados na query de verificação.
 * @param {import('mongoose').Model} model Model a ser usado na verificação.
 * @returns {Boolean}
 */
const checkExists = async (data, model) => {
  const exists = await model.exists(data);

  return exists;
};

module.exports = checkExists;
