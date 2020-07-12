const BaseExists = require('../exists');
const PlayerRepo = require('../../repository/player');

const { getUnprocessable } = require('../../domains/errors/exceptions');

module.exports = class GameExists extends BaseExists {
  /**
   * @param {import('../../repository/player')} repo repository do jogador
   */
  constructor(repo = new PlayerRepo()) {
    super(repo);
  }

  async create(data) {
    await super.exists(
      { game: data.game, user: data.user },
      true,
      getUnprocessable('O jogador já iniciou este jogo'),
    );
    return data;
  }
};
