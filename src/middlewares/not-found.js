const { RouteNotFound } = require('../domains/errors/exceptions');

// TODO AJUSTAR
const notFound = () => {
  throw new RouteNotFound('Rota não encontrada');
};

module.exports = notFound;
