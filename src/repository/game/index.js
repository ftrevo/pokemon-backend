const GameSchema = require('../../models/game');

const createGame = require('../create');
const existGame = require('../check-exists');
const findOneAndUpdateGame = require('../find-one-and-update');

const create = (data) => createGame(data, GameSchema);
const exists = (data) => existGame(data, GameSchema);
const join = ({ token, player }) => findOneAndUpdateGame(
  { token },
  { $addToSet: { players: [player] } },
  GameSchema,
  [{ path: 'maker', select: 'name' }, { path: 'players', select: 'name' }],
);

module.exports = {
  create,
  exists,
  join,
};
