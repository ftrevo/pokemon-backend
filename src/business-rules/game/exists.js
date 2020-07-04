const BaseExists = require('../exists');
const GameRepo = require('../../repository/game');

const { getUnprocessable } = require('../../domains/errors/exceptions');

module.exports = class GameExists extends BaseExists {
  /**
   * @param {import('../../repository/game')} repo repository do jogo
   */
  constructor(repo = new GameRepo()) {
    super(repo);
  }

  async create(maker) {
    await this.exists(
      { maker, winner: { $exists: false } },
      true,
      getUnprocessable('O usuário já tem um jogo não finalizado'),
    );
    return maker;
  }

  async join(data) {
    await this.exists(
      {
        token: data.token,
        winner: { $exists: false },
        'players.5': { $exists: false },
      },
      false,
      getUnprocessable('Jogo não encontrado, já finalizado ou com o máximo de jogadores permitido'),
    );
    return data;
  }
};
