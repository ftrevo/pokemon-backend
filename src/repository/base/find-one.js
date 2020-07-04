/**
 * @param {Object} data Dados a serem usados na query.
 * @param {Object} projectionFields Dados a serem retornados.
 * @param {import('mongoose').Model} model Model a ser usado na busca.
 * @returns {Object} Objeto encontrado.
 */
const findOne = async (data, projectionFields, model) => {
  const found = await model.findOne(data, projectionFields);

  return found;
};

module.exports = findOne;
