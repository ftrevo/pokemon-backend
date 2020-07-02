/**
 * @param {Object} data Dados a serem usados na query.
 * @param {Object} updateData Dados a serem retornados.
 * @param {import('mongoose').Model} model Model a ser usado na busca.
 * @param {Object} populateData Dados a serem utilizados na query de populate.
 * @returns {Object} Objeto encontrado.
 */
const findOneAndUpdate = async (data, updateData, model, populateData) => {
  const found = await model
    .findOneAndUpdate(data, updateData, { new: true, useFindAndModify: false }).exec();

  if (populateData) {
    await found.populate(populateData).execPopulate();
  }

  return found.toJSON();
};

module.exports = findOneAndUpdate;
