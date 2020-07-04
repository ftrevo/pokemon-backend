/**
 * @param {Object} data Dados do model.
 * @param {import('mongoose').Model} model Model a ser usado na criação.
 * @returns {Object} Objeto criado.
 */
const create = async (data, model) => {
  const created = await model.create(data);

  return created.toJSON();
};

module.exports = create;
