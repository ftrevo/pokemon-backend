/* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] class-methods-use-this: 0 */
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

  async findOne(data) {
    const returned = await super.findOne(
      { _id: data._id },
      true,
      getUnprocessable('Jogador não encontrado'),
    );
    return { ...data, ...returned.toJSON() };
  }

  async pokemon(data) {
    await super.exists(
      { game: data.game, 'pokemons.merged': data.pokemon },
      true,
      getUnprocessable('O pokémon já foi capturado neste jogo'),
    );
    return data;
  }

  async andOwnsPokemon(data) {
    const user = await super.findOne(
      {
        _id: data._id, user: data.user, 'pokemons.number': data.number,
      },
      true,
      getUnprocessable('O pokémon que você está tentando soltar não foi capturado por você'),
    );
    return { ...data, ...user.toJSON() };
  }

  async isBase(data) { // TODO ver uma maneira melhor de fazer este teste
    if (data.number === data.starterPokemon) {
      throw getUnprocessable('Você não pode liberar seu pokémon inicial');
    }
    return data;
  }
};
