const BaseExists = require('../exists');
const gameRepo = require('../../repository/game');

const { getUnprocessable } = require('../../domains/errors/exceptions');

module.exports = class GameExists extends BaseExists {
  /**
   * @param {import('../../repository/game')} repo repository do jogo
   */
  constructor(repo = gameRepo) {
    super(repo);
  }

  create(data) {
    return this.exists(
      { ...data, winner: { $exists: false } },
      true,
      getUnprocessable('O usuário já tem um jogo não finalizado'),
    );
  }
};
