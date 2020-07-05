const BaseRepo = require('./base-repository');
const gameModel = require('../models/game');

module.exports = class GameRepo extends BaseRepo {
  /**
   * @param {import('../models/game')} model model do game
   */
  constructor(model = gameModel) {
    super(model);
  }

  async join({ token, user }) {
    return super.findOneAndUpdate(
      { token },
      { $addToSet: { users: [user] } },
      [{ path: 'maker', select: 'name' }, { path: 'users', select: 'name' }],
    );
  }
};
