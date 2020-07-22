const pkmUtils = require('../../helpers/pokemon-utils');

module.exports = class Related {
  /**
   * @param {import('../../helpers/pokemon-utils')} pkmUtils pokémon utils
   */
  constructor(utils = pkmUtils) {
    this.utils = utils;
  }

  get(data) {
    return new Promise((resolve) => {
      const captured = this.utils.pokedex[data.pokemon];
      const previous = this.utils.playerHasPrevious(captured, data.pokemons);
      const evolution = this.utils.playerHasEvolution(captured, data.pokemons);

      return resolve({
        previous, captured, evolution, ...data,
      });
    });
  }
};
