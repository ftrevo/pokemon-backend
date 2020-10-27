/* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */
const BaseRepo = require('./base-repository');
const playerModel = require('../models/player');

module.exports = class UserRepo extends BaseRepo {
  /**
   * @param {import('../models/player')} model model do jogador
   */
  constructor(model = playerModel) {
    super(model);
  }

  async setUp(player) {
    return super.create(
      {
        ...player,
        pokemons: [{
          number: player.starterPokemon,
          hasBase: true,
          isActive: true,
          merged: [player.starterPokemon],
        }],
      },
      [{ path: 'game', select: 'maker', populate: { path: 'maker', select: 'name' } }],
    );
  }

  async capture(data) {
    return super.findOneAndUpdate({ _id: data._id }, data.changes);
  }

  async release(data) {
    return super.findOneAndUpdate(
      { _id: data._id },
      { $pull: { pokemons: { number: data.number } } },
    );
  }
};
