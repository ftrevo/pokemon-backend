const GameSchema = require('../models/game');
const baseMethods = require('./base');

module.exports = class GameRepo {
  /**
   * @param {import('../models/game')} schema schema do usuário
   * @param {import('./base')} base métodos base
   */
  constructor(schema = GameSchema, base = baseMethods) {
    this.schema = schema;
    this.base = base;
  }

  async create(data) {
    return this.base.create(data, this.schema);
  }

  async exists(data) {
    return this.base.exists(data, this.schema);
  }

  async join({ token, player }) {
    return this.base.findOneAndUpdate(
      { token },
      { $addToSet: { players: [player] } },
      this.schema,
      [{ path: 'maker', select: 'name' }, { path: 'players', select: 'name' }],
    );
  }
};
