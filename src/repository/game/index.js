const GameSchema = require('../../models/game');

const createGame = require('../create');
const existGame = require('../check-exists');

const create = (data) => createGame(data, GameSchema);
const exists = (data) => existGame(data, GameSchema);

module.exports = {
  create,
  exists,
};
