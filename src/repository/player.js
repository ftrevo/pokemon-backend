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
      { ...player, pokemons: [{ number: player.starterPokemon }] },
      [{ path: 'game', select: 'maker', populate: { path: 'maker', select: 'name' } }],
    );
  }
};
