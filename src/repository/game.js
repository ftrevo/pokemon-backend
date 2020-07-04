const BaseRepo = require('./base-repository');
const gameModel = require('../models/game');

module.exports = class GameRepo extends BaseRepo {
  /**
   * @param {import('../models/game')} model model do game
   */
  constructor(model = gameModel) {
    super(model);
  }

  async join({ token, player }) {
    return super.findOneAndUpdate(
      { token },
      { $addToSet: { players: [player] } },
      [{ path: 'maker', select: 'name' }, { path: 'players', select: 'name' }],
    );
  }
};
