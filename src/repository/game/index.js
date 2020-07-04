const GameSchema = require('../../models/game');

const createBase = require('../create');
const existBase = require('../check-exists');
const findOneAndUpdateBase = require('../find-one-and-update');

module.exports = class GameRepo {
  /**
   * @param {import('../../models/game')} schema schema do usuário
   */
  constructor(schema = GameSchema) {
    this.schema = schema;
  }

  async create(data) {
    return createBase(data, this.schema);
  }

  async exists(data) {
    return existBase(data, this.schema);
  }

  async join({ token, player }) {
    return findOneAndUpdateBase(
      { token },
      { $addToSet: { players: [player] } },
      this.schema,
      [{ path: 'maker', select: 'name' }, { path: 'players', select: 'name' }],
    );
  }
};
